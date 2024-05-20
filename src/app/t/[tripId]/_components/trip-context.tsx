"use client";

import { createContext, useContext, useMemo, useState } from "react";

import useHistoryState from "~/hooks/use-history-state";
import type { TripContext as TripContextType } from "~/lib/validations/trip";

type TripContext = {
  trip: TripContextType["trip"];
  setTrip: (tripOrIndex: TripContextType["trip"] | number, description?: string) => void;
  myMemberships: TripContextType["myMemberships"];
  setMyMemberships: (myMemberships: TripContextType["myMemberships"]) => void;
};
export const TripContext = createContext<TripContext | null>(null);
export const useTripContext = () => {
  const context = useContext(TripContext);
  if (context == null)
    throw new Error("useTripContext must be used within a <TripContext.Provider />");
  return context;
};

export const TripContextProvider = (props: {
  context: TripContextType;
  children: React.ReactNode;
}) => {
  const [trip, setTrip, { changes }] = useHistoryState(props.context.trip, {
    initialDescription: "Fetch",
    limit: 10,
  });
  const [myMemberships, setMyMemberships] = useState(props.context.myMemberships);

  console.log(changes);

  const value = useMemo(
    () => ({ trip, setTrip, myMemberships, setMyMemberships }),
    [trip, setTrip, myMemberships],
  );

  return <TripContext.Provider value={value}>{props.children}</TripContext.Provider>;
};
