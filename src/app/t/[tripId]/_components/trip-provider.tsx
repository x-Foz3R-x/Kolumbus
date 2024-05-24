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

type TripContext = {
  trip: TripSchema;
  setTrip: (tripOrIndex: TripSchema | number, description?: string) => void;
  myMemberships: TripContextType["myMemberships"];
  setMyMemberships: (myMemberships: TripContextType["myMemberships"]) => void;

  userId: string;
  permissions: MemberPermissions;

  createTrip: (name: string, startDate: string, endDate: string) => void;
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

  const value = useMemo(
    () => ({
      trip,
      setTrip,
      myMemberships,
      setMyMemberships,

      userId: props.userId,
      permissions,

      createTrip: handleCreate,
    }),
    [props.userId, trip, permissions, setTrip, myMemberships, handleCreate],
  );

  return <TripContext.Provider value={value}>{props.children}</TripContext.Provider>;
};

function convertTrip(trip: TripContextType["trip"]): TripSchema {
  const { events, ...rest } = trip;
  return { ...rest, itinerary: generateItinerary(trip.startDate, trip.endDate, events) };
}
