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

import { api } from "~/trpc/react";
import { createId } from "~/lib/utils";
import { toastHandler } from "~/lib/trpc";
import { constructMembership, constructTrip } from "~/lib/constructors";
import type { MyMembershipSchema } from "~/lib/validations/membership";
import type { UserTypeSchema } from "~/lib/validations/auth";

type LibraryContext = {
  userType: UserTypeSchema;
  memberships: MyMembershipSchema[];
  sharedMemberships: MyMembershipSchema[];
  loadingTripId: string | null;
  createTrip: (name: string, startDate: string, endDate: string) => void;
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
  userId: string;
  userType: UserTypeSchema;
  memberships: MyMembershipSchema[];
  sharedMemberships: MyMembershipSchema[];
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [memberships, setMemberships] = useState(props.memberships);
  const [sharedMemberships, setSharedMemberships] = useState(props.sharedMemberships);

  const loadingTripIdRef = useRef<string | null>(null);

  const createTrip = api.trip.create.useMutation(toastHandler("Trip created"));
  const duplicateTrip = api.trip.duplicate.useMutation(toastHandler("Trip duplicated"));
  const leaveTrip = api.trip.leave.useMutation(toastHandler());
  const deleteTrip = api.trip.delete.useMutation(toastHandler());

  const handleCreate = useCallback(
    (name: string, startDate: string, endDate: string) => {
      const position = memberships.length;
      const trip = constructTrip({
        id: createId(10),
        ownerId: props.userId,
        name,
        startDate,
        endDate,
      });
      const membership: MyMembershipSchema = {
        ...constructMembership({
          userId: props.userId,
          tripId: trip.id,
          tripPosition: position,
          permissions: -1,
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
    [props.userId, createTrip, memberships],
  );
  const handleDuplicate = useCallback(
    (id: string) => {
      // Find the membership to duplicate
      const originalMembership = memberships.find((membership) => membership.tripId === id);
      if (!originalMembership) return;

      // Create membership duplicate
      const duplicatedMembership = structuredClone(originalMembership);
      duplicatedMembership.userId = props.userId;
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
    [props.userId, duplicateTrip, memberships],
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
  }, [props.memberships, props.sharedMemberships]);

  const value = useMemo(
    () => ({
      userType: props.userType,
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
      props.userType,
      handleCreate,
      handleDuplicate,
      handleLeave,
      handleDelete,
    ],
  );

  return <LibraryContext.Provider value={value}>{props.children}</LibraryContext.Provider>;
}
