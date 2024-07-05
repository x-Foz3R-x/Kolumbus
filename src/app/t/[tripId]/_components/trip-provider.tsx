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
import type { EventSchema } from "~/lib/validations/event";

type TripContext = {
  trip: TripSchema;
  setTrip: (tripOrIndex: TripSchema | number, description?: string) => void;
  myMemberships: MyMembershipSchema[];
  setMyMemberships: (myMemberships: MyMembershipSchema[]) => void;

  userId: string;
  permissions: MemberPermissions;

  updateItinerary: (itineraryOrIndex: ItinerarySchema | number, desc?: string) => void;
  createTrip: (name: string, startDate: string, endDate: string) => void;
  deleteEvent: (event: EventSchema) => void;
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

  const [trip, setTrip, { changes }] = useHistoryState(props.trip, { initialDescription: "Fetch" });
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
  const deleteEvent = api.event.delete.useMutation(toastHandler("Event deleted"));

  const handleCreate = useCallback(
    (name: string, startDate: string, endDate: string) => {
      const position = myMemberships.length;
      const trip = constructTrip({
        id: createId(10),
        ownerId: props.userId,
        name,
        startDate,
        endDate,
      });

      createTrip.mutate(
        { ...trip, position },
        { onError: () => router.refresh(), onSuccess: () => router.push(`/t/${trip.id}`) },
      );
    },
    [props.userId, createTrip, myMemberships, router],
  );

  const handleEventDelete = useCallback(
    (event: EventSchema) => {
      if (
        (event.createdBy === props.userId && !permissions.deleteOwnEvents) ||
        (event.createdBy !== props.userId && !permissions.deleteEvents)
      ) {
        return;
      }

      const newItinerary = structuredClone(trip.itinerary);

      const dayIndex = newItinerary.findIndex((day) => day.date === event.date);
      if (dayIndex === -1) return;

      if (!newItinerary[dayIndex]) return;
      if (!newItinerary[dayIndex].events[event.position]) return;

      newItinerary[dayIndex].events.splice(event.position, 1);
      newItinerary[dayIndex].events.map((event, index) => (event.position = index));

      setTrip({ ...trip, itinerary: newItinerary });

      deleteEvent.mutate(
        {
          id: event.id,
          tripId: trip.id,
          date: event.date,
          position: event.position,
          createdBy: props.userId,
        },
        { onError: () => router.refresh() },
      );
    },
    [props.userId, trip, setTrip, permissions, deleteEvent, router],
  );

  const updateItinerary = useCallback(
    (itineraryOrIndex: TripSchema["itinerary"] | number, desc?: string) => {
      setTrip(
        typeof itineraryOrIndex === "number"
          ? itineraryOrIndex
          : { ...trip, itinerary: itineraryOrIndex },
        desc,
      );
    },
    [trip, setTrip],
  );

  console.log(changes);

  const value = useMemo(
    () => ({
      trip,
      setTrip,
      myMemberships,
      setMyMemberships,

      userId: props.userId,
      permissions,

      updateItinerary,
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
      handleCreate,
      handleEventDelete,
    ],
  );

  return <TripContext.Provider value={value}>{props.children}</TripContext.Provider>;
};
