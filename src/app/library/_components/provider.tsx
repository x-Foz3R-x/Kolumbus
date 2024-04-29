"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { api } from "~/trpc/react";
import { createId } from "~/lib/utils";
import { toastHandler } from "~/lib/trpc";
import { buildMembership, buildTrip } from "~/lib/templates";
import type { MyMembership, UserRoleLimits } from "~/types";

type LibraryContext = {
  userRoleLimits: UserRoleLimits;
  memberships: MyMembership[];
  sharedMemberships: MyMembership[];
  loadingTripId: string | null;
  createTrip: (name: string) => void;
  duplicateTrip: (id: string) => void;
  leaveTrip: (id: string) => void;
  deleteTrip: (id: string) => void;
};
const LibraryContext = createContext<LibraryContext | null>(null);
export default function useLibraryContext() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error("useLibraryContext must be used within a LibraryProvider");
  return context;
}

export function LibraryProvider(props: {
  userRoleLimits: UserRoleLimits;
  memberships: MyMembership[];
  sharedMemberships: MyMembership[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useUser();

  const [memberships, setMemberships] = useState(props.memberships);
  const [sharedMemberships, setSharedMemberships] = useState(props.sharedMemberships);

  const loadingTripIdRef = useRef<string | null>(null);

  const createTrip = api.trip.create.useMutation(toastHandler("Trip created"));
  const duplicateTrip = api.trip.duplicate.useMutation(toastHandler("Trip duplicated"));
  const leaveTrip = api.trip.leave.useMutation(toastHandler());
  const deleteTrip = api.trip.delete.useMutation(toastHandler());

  const handleCreate = useCallback(
    (name: string) => {
      if (!user) return;

      const position = memberships.length;
      const trip = buildTrip({ id: createId(10), ownerId: user.id, name });
      const membership: MyMembership = {
        ...buildMembership({
          userId: user.id,
          tripId: trip.id,
          tripPosition: position,
          owner: true,
        }),
        trip: {
          name: trip.name,
          startDate: trip.startDate,
          endDate: trip.endDate,
          image: trip.image,
          events: [],
          eventCount: 0,
        },
      };

      setMemberships([...memberships, membership]);
      loadingTripIdRef.current = membership.tripId;
      createTrip.mutate(
        { ...trip, position },
        {
          onError: () => {
            setMemberships(memberships.filter((m) => m.tripId !== loadingTripIdRef.current));
          },
          onSettled: () => (loadingTripIdRef.current = null),
        },
      );
    },
    [user, createTrip, memberships],
  );
  const handleDuplicate = useCallback(
    (id: string) => {
      if (!user) return;

      // Find the membership to duplicate
      const originalMembership = memberships.find((membership) => membership.tripId === id);
      if (!originalMembership) return;

      // Create membership duplicate
      const duplicatedMembership = structuredClone(originalMembership);
      duplicatedMembership.tripId = createId(10);
      duplicatedMembership.tripPosition += 1;
      duplicatedMembership.createdAt = new Date();
      duplicatedMembership.updatedAt = new Date();

      // Update tripPosition of memberships and insert the duplicated membership
      const newMemberships = [...memberships].map((membership) =>
        membership.tripPosition > originalMembership.tripPosition
          ? { ...membership, tripPosition: membership.tripPosition + 1 }
          : membership,
      );
      newMemberships.splice(duplicatedMembership.tripPosition, 0, duplicatedMembership);

      setMemberships(newMemberships);
      loadingTripIdRef.current = duplicatedMembership.tripId;
      duplicateTrip.mutate(
        { id, duplicateId: duplicatedMembership.tripId },
        {
          onError: () => {
            setMemberships(memberships.filter((m) => m.tripId !== loadingTripIdRef.current));
          },
          onSettled: () => (loadingTripIdRef.current = null),
        },
      );
    },
    [user, duplicateTrip, memberships],
  );
  const handleLeave = useCallback(
    (id: string) => {
      const position = sharedMemberships.find(
        (membership) => membership.tripId === id,
      )?.tripPosition;
      if (position === undefined) return;

      const filteredMemberships = sharedMemberships
        .filter((membership) => membership.tripId !== id)
        .map((membership) =>
          membership.tripPosition > position
            ? { ...membership, tripPosition: membership.tripPosition - 1 }
            : membership,
        );

      setSharedMemberships(filteredMemberships);
      leaveTrip.mutate({ id }, { onError: () => router.refresh() });
    },
    [leaveTrip, sharedMemberships, router],
  );
  const handleDelete = useCallback(
    (id: string) => {
      const position = memberships.find((membership) => membership.tripId === id)?.tripPosition;
      if (position === undefined) return;

      const filteredMemberships = [...memberships]
        .filter((membership) => membership.tripId !== id)
        .map((membership) =>
          membership.tripPosition > position
            ? { ...membership, tripPosition: membership.tripPosition - 1 }
            : membership,
        );

      setMemberships(filteredMemberships);
      deleteTrip.mutate({ id }, { onError: () => router.refresh() });
    },
    [deleteTrip, memberships, router],
  );

  // Keep memberships up to date with db
  useEffect(() => {
    setMemberships(props.memberships);
    setSharedMemberships(props.sharedMemberships);
  }, [props]);

  const value = useMemo(
    () => ({
      userRoleLimits: props.userRoleLimits,
      memberships,
      sharedMemberships,
      loadingTripId: loadingTripIdRef.current,
      createTrip: handleCreate,
      duplicateTrip: handleDuplicate,
      leaveTrip: handleLeave,
      deleteTrip: handleDelete,
    }),
    [
      memberships,
      sharedMemberships,
      props.userRoleLimits,
      handleCreate,
      handleDuplicate,
      handleLeave,
      handleDelete,
    ],
  );

  return <LibraryContext.Provider value={value}>{props.children}</LibraryContext.Provider>;
}
