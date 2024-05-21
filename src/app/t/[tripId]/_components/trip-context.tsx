"use client";

import { createContext, useContext, useMemo, useState } from "react";

import useHistoryState from "~/hooks/use-history-state";
import { generateItinerary } from "~/lib/utils";
import type { Trip, TripContext as TripContextType } from "~/lib/validations/trip";

type TripContext = {
  userId: string;
  trip: Trip;
  setTrip: (tripOrIndex: Trip | number, description?: string) => void;
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

  console.log(trip);

  const value = useMemo(
    () => ({ userId: props.userId, trip, setTrip, myMemberships, setMyMemberships }),
    [props.userId, trip, setTrip, myMemberships],
  );

  return <TripContext.Provider value={value}>{props.children}</TripContext.Provider>;
};

function convertTrip(trip: TripContextType["trip"]): Trip {
  const { events, ...rest } = trip;
  return { ...rest, itinerary: generateItinerary(trip.startDate, trip.endDate, events) };
}
