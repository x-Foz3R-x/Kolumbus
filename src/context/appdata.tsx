"use client";

import React, { createContext, useContext, useEffect, useState, useReducer } from "react";
import api from "@/app/_trpc/client";
import { DispatchAction, Trip, UT } from "@/types";

type AppdataContext = {
  userTrips: Trip[];
  dispatchUserTrips: React.Dispatch<DispatchAction>;
  selectedTrip: number;
  setSelectedTrip: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  isModalShown: boolean;
  setModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  modalChildren: null;
  setModalChildren: React.Dispatch<React.SetStateAction<null>>;
};
const appdataContext = createContext<AppdataContext | null>(null);

/**
 * Custom hook to access appdata context.
 * @returns The appdata context.
 */
export default function useAppdata() {
  const context = useContext(appdataContext);
  if (!context) throw new Error("useAppdata must be used within a AppDataProvider");
  return context;
}

export function AppdataProvider({ children }: { children: React.ReactNode }) {
  const [userTrips, dispatchUserTrips] = useReducer(TripsReducer, []);
  const [selectedTrip, setSelectedTrip] = useState(-1);
  const [isLoading, setLoading] = useState(true);

  const [isModalShown, setModalShown] = useState(false);
  const [modalChildren, setModalChildren] = useState(null);

  const { data, isLoading: areTripsLoading } = api.trip.getAllWithEvents.useQuery();

  useEffect(() => {
    if (typeof data === "undefined" || areTripsLoading) return;

    dispatchUserTrips({ type: UT.REPLACE, userTrips: data });
    setLoading(false);
  }, [data, areTripsLoading]);

  // console.log("userTrips", userTrips);

  const value = {
    userTrips,
    dispatchUserTrips,
    selectedTrip,
    setSelectedTrip,
    isLoading,
    setLoading,

    isModalShown,
    setModalShown,
    modalChildren,
    setModalChildren,
  };
  return <appdataContext.Provider value={value}>{children}</appdataContext.Provider>;
}

/**
 * Reducer function for managing user trips state.
 * @param trips - The current state of trips.
 * @param action - The action to perform on the state.
 * @returns The updated state of trips.
 */
function TripsReducer(trips: Trip[], action: DispatchAction) {
  switch (action.type) {
    case UT.REPLACE:
      if (action.userTrips) {
        const newTrips: Trip[] = action.userTrips;
        return newTrips;
      }
      return trips;
    /** Return unchanged state */
    default:
      return trips;
  }
}
