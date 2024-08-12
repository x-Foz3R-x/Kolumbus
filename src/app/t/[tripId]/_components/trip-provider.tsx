"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import useHistoryState from "~/hooks/use-history-state";
import type { ItinerarySchema, TripSchema } from "~/lib/validations/trip";
import {
  MemberPermissionFlags,
  type MyMembershipSchema,
  type MemberPermissions,
} from "~/lib/validations/membership";
import { createId, decodePermissions } from "~/lib/utils";
import { api } from "~/trpc/react";
import { toastHandler } from "~/lib/trpc";
import { constructTrip } from "~/lib/constructors";
import type { PlaceSchema } from "~/lib/validations/place";

type TripContext = {
  trip: TripSchema;
  setTrip: (tripOrIndex: TripSchema | number, description?: string) => void;
  myMemberships: MyMembershipSchema[];
  setMyMemberships: (myMemberships: MyMembershipSchema[]) => void;

  userId: string;
  permissions: MemberPermissions;

  updateItinerary: (itineraryOrIndex: ItinerarySchema | number, desc?: string) => void;
  getItineraryEntry: (index: number) => ItinerarySchema;

  createTrip: (name: string, startDate: string, endDate: string) => void;
  deleteEvent: (event: PlaceSchema) => void;
};
export const TripContext = createContext<TripContext | null>(null);
export const useTripContext = () => {
  const context = useContext(TripContext);
  if (context == null)
    throw new Error("useTripContext must be consumed within <TripContext.Provider />");
  return context;
};

export const TripProvider = (props: {
  userId: string;
  trip: TripSchema;
  myMemberships: MyMembershipSchema[];
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [trip, setTrip, { getEntry }] = useHistoryState(props.trip, {
    initialDescription: "Fetch",
  });
  const [myMemberships, setMyMemberships] = useState(props.myMemberships);

  const permissions = useMemo(
    () =>
      decodePermissions<MemberPermissions>(
        trip.members.find((member) => member.userId === props.userId)?.permissions ?? 0,
        MemberPermissionFlags,
      ),
    [trip.members, props.userId],
  );

  const createTrip = api.trip.create.useMutation(toastHandler("Trip created"));
  const deleteItem = api.place.delete.useMutation(toastHandler("Item deleted"));

  const handleCreate = useCallback(
    (name: string, startDate: string, endDate: string) => {
      const sortIndex = myMemberships.length;
      const trip = constructTrip({
        id: createId(10),
        ownerId: props.userId,
        name,
        startDate,
        endDate,
      });

      createTrip.mutate(
        { ...trip, sortIndex },
        { onError: () => router.refresh(), onSuccess: () => router.push(`/t/${trip.id}`) },
      );
    },
    [props.userId, createTrip, myMemberships, router],
  );

  const handleEventDelete = useCallback(
    (place: PlaceSchema) => {
      if (place.createdBy === props.userId && !permissions.editItinerary) {
        return;
      }

      const newItinerary = structuredClone(trip.itinerary);

      const dayIndex = newItinerary.findIndex((_, index) => index === place.dayIndex);
      if (dayIndex === -1) return;

      if (!newItinerary[dayIndex]) return;
      if (!newItinerary[dayIndex].places[place.sortIndex]) return;

      newItinerary[dayIndex].places.splice(place.sortIndex, 1);
      newItinerary[dayIndex].places.map((place, index) => (place.sortIndex = index));

      setTrip({ ...trip, itinerary: newItinerary });

      deleteItem.mutate(
        {
          id: place.id,
          tripId: trip.id,
          dayIndex,
          sortIndex: place.sortIndex,
        },
        { onError: () => router.refresh() },
      );
    },
    [props.userId, trip, setTrip, permissions, deleteItem, router],
  );

  const updateItinerary = useCallback(
    (itineraryOrIndex: ItinerarySchema | number, desc?: string) => {
      setTrip(
        typeof itineraryOrIndex === "number"
          ? itineraryOrIndex
          : { ...trip, itinerary: itineraryOrIndex },
        desc,
      );
    },
    [trip, setTrip],
  );
  const getItineraryEntry = useCallback(
    (index: number) => {
      return getEntry(index).itinerary;
    },
    [getEntry],
  );

  const value = useMemo(
    () => ({
      trip,
      setTrip,
      myMemberships,
      setMyMemberships,

      userId: props.userId,
      permissions,

      updateItinerary,
      getItineraryEntry,

      createTrip: handleCreate,
      deleteEvent: handleEventDelete,
    }),
    [
      props.userId,
      trip,
      permissions,
      setTrip,
      myMemberships,
      updateItinerary,
      getItineraryEntry,
      handleCreate,
      handleEventDelete,
    ],
  );

  return <TripContext.Provider value={value}>{props.children}</TripContext.Provider>;
};
