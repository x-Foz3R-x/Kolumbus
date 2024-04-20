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
import { mutationOpts } from "~/lib/trpc";
import { buildMembership, buildTrip } from "~/lib/templates";
import type { MyMembership, MyUserRole } from "~/types";

type LibraryContext = {
  userRole: MyUserRole;
  memberships: MyMembership[];
  sharedMemberships: MyMembership[];
  loadingTripId: string | null;
  isSaving: boolean;
  createTrip: (name: string) => void;
  duplicateTrip: (id: string) => void;
  // leaveTrip: (id: string) => void;
  deleteTrip: (id: string) => void;
};
const LibraryContext = createContext<LibraryContext | null>(null);
export default function useLibraryContext() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error("useLibraryContext must be used within a LibraryProvider");
  return context;
}

export function LibraryProvider(props: {
  userRole: MyUserRole;
  memberships: MyMembership[];
  sharedMemberships: MyMembership[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useUser();

  const [memberships, setMemberships] = useState(props.memberships);
  const [sharedMemberships, setSharedMemberships] = useState(props.sharedMemberships);
  const [isSaving, setSaving] = useState(false);

  const loadingTripIdRef = useRef<string | null>(null);

  const createTrip = api.trip.create.useMutation(mutationOpts("Trip created"));
  const duplicateTrip = api.trip.duplicate.useMutation(mutationOpts("Trip duplicated"));
  // const leaveTripApi = api.trip.leave.useMutation(mutationOpts());
  const deleteTrip = api.trip.delete.useMutation(mutationOpts());

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
  // const handleLeave = useCallback(
  //   (id: string) => {
  //     if (!user) return;

  //     const membershipClone = structuredClone(sharedMemberships);
  //     const tripPosition = sharedMemberships.find((membership) => membership.tripId === id)?.tripPosition;

  //     if (tripPosition === undefined) return;

  //     const updatedMemberships = sharedMemberships
  //       .filter((membership) => membership.tripId !== id)
  //       .map((membership) =>
  //         membership.tripPosition > tripPosition ? { ...membership, tripPosition: membership.tripPosition - 1 } : membership,
  //       );

  //     setSharedMemberships(updatedMemberships);

  //     leaveTripApi.mutate(
  //       { tripId: id },
  //       {
  //         onError(error) {
  //           console.error(error.message);
  //           setSharedMemberships(membershipClone);
  //         },
  //       },
  //     );
  //   },
  //   [user, leaveTripApi, sharedMemberships],
  // );
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
      deleteTrip.mutate({ tripId: id }, { onError: () => router.refresh() });
    },
    [deleteTrip, memberships, router],
  );

  // Keep memberships up to date with db
  useEffect(() => {
    setMemberships(props.memberships);
    setSharedMemberships(props.sharedMemberships);
  }, [props]);

  // Handle saving state
  useEffect(() => {
    const isPending = createTrip.isPending || duplicateTrip.isPending || deleteTrip.isPending;
    setSaving(isPending);
  }, [createTrip.isPending, duplicateTrip.isPending, deleteTrip.isPending]);

  const value = useMemo(
    () => ({
      userRole: props.userRole,
      memberships,
      sharedMemberships,
      loadingTripId: loadingTripIdRef.current,
      isSaving,
      createTrip: handleCreate,
      duplicateTrip: handleDuplicate,
      // leaveTrip: handleLeave,
      deleteTrip: handleDelete,
    }),
    [
      memberships,
      sharedMemberships,
      props.userRole,
      isSaving,
      handleCreate,
      handleDuplicate,
      handleDelete,
    ],
  );

  return <LibraryContext.Provider value={value}>{props.children}</LibraryContext.Provider>;
}
