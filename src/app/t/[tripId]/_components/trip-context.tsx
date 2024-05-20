"use client";

import { createContext, useContext, useMemo, useState } from "react";

import useHistoryState from "~/hooks/use-history-state";
import type { TripContext as TripContextType } from "~/lib/validations/trip";

type TripContext = {
  trip: TripContextType["trip"];
  setTrip: (trip: TripContextType["trip"]) => void;
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
  const [trip, setTrip, {}] = useHistoryState(props.context.trip);
  const [myMemberships, setMyMemberships] = useState(props.context.myMemberships);

  const value = useMemo(
    () => ({ trip, setTrip, myMemberships, setMyMemberships }),
    [trip, setTrip, myMemberships],
  );

  return <TripContext.Provider value={value}>{props.children}</TripContext.Provider>;
};
