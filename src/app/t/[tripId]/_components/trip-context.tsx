"use client";

import { createContext, useContext, useMemo, useState } from "react";

import useHistoryState from "~/hooks/use-history-state";
import { MemberPermissionsTemplate } from "~/lib/templates";
import { decodePermissions, generateItinerary } from "~/lib/utils";
import type { Trip, TripContext as TripContextType } from "~/lib/validations/trip";
import type { MemberPermissions } from "~/types";

type TripContext = {
  userId: string;
  trip: Trip;
  setTrip: (tripOrIndex: Trip | number, description?: string) => void;
  permissions: MemberPermissions;
  myMemberships: TripContextType["myMemberships"];
  setMyMemberships: (myMemberships: TripContextType["myMemberships"]) => void;
};
export const TripContext = createContext<TripContext | null>(null);
export const useTripContext = () => {
  const context = useContext(TripContext);
  if (context == null)
    throw new Error("useTripContext must be consumed within <TripContext.Provider />");
  return context;
};

export const TripContextProvider = (props: {
  userId: string;
  context: TripContextType;
  children: React.ReactNode;
}) => {
  const [trip, setTrip, {}] = useHistoryState<Trip>(convertTrip(props.context.trip), {
    initialDescription: "Fetch",
    limit: 10,
  });
  const [myMemberships, setMyMemberships] = useState(props.context.myMemberships);

  const permissions = useMemo(
    () =>
      decodePermissions<MemberPermissions>(
        trip.members.find((member) => member.userId === props.userId)?.permissions ?? 0,
        MemberPermissionsTemplate,
      ),
    [trip.members, props.userId],
  );

  console.log(trip);

  const value = useMemo(
    () => ({ userId: props.userId, trip, setTrip, permissions, myMemberships, setMyMemberships }),
    [props.userId, trip, permissions, setTrip, myMemberships],
  );

  return <TripContext.Provider value={value}>{props.children}</TripContext.Provider>;
};

function convertTrip(trip: TripContextType["trip"]): Trip {
  const { events, ...rest } = trip;
  return { ...rest, itinerary: generateItinerary(trip.startDate, trip.endDate, events) };
}
