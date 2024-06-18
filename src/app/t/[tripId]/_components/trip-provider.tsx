"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import useHistoryState from "~/hooks/use-history-state";
import type { TripSchema, TripContextSchema as TripContextType } from "~/lib/validations/trip";
import { MemberPermissionFlags, type MemberPermissions } from "~/lib/validations/membership";
import { createId, decodePermissions, generateItinerary } from "~/lib/utils";
import { api } from "~/trpc/react";
import { toastHandler } from "~/lib/trpc";
import { constructTrip } from "~/lib/constructors";
import type { EventSchema } from "~/lib/validations/event";

type TripContext = {
  trip: TripSchema;
  setTrip: (tripOrIndex: TripSchema | number, description?: string) => void;
  myMemberships: TripContextType["myMemberships"];
  setMyMemberships: (myMemberships: TripContextType["myMemberships"]) => void;

  userId: string;
  permissions: MemberPermissions;

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
  context: TripContextType;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [trip, setTrip, {}] = useHistoryState<TripSchema>(convertTrip(props.context.trip), {
    initialDescription: "Fetch",
    limit: 10,
  });
  const [myMemberships, setMyMemberships] = useState(props.context?.myMemberships);

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

  console.log(trip);

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

  const value = useMemo(
    () => ({
      trip,
      setTrip,
      myMemberships,
      setMyMemberships,

      userId: props.userId,
      permissions,

      createTrip: handleCreate,
      deleteEvent: handleEventDelete,
    }),
    [props.userId, trip, permissions, setTrip, myMemberships, handleCreate, handleEventDelete],
  );

  return <TripContext.Provider value={value}>{props.children}</TripContext.Provider>;
};

function convertTrip(trip: TripContextType["trip"]): TripSchema {
  const { events, ...rest } = trip;
  return { ...rest, itinerary: generateItinerary(trip.startDate, trip.endDate, events) };
}
