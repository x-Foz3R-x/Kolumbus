"use client";

import React, { createContext, useContext, useEffect, useState, useReducer } from "react";
import { GenerateItinerary } from "@/lib/utils";
import { DispatchAction, Trip, UT } from "@/types";

//#region Context
type AppdataContext = {
  userTrips: Trip[];
  dispatchUserTrips: React.Dispatch<DispatchAction>;
  selectedTrip: number;
  setSelectedTrip: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSaving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;

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
//#endregion

type AppdataProviderProps = {
  trips: Trip[];
  children: React.ReactNode;
};
/**
 * Provider component for appdata context.
 * @param serverTrips - The user's trips from the server.
 * @param children - The children components to render.
 * @returns The provider component.
 */
export function AppdataProvider({ trips, children }: AppdataProviderProps) {
  const [userTrips, dispatchUserTrips] = useReducer(TripsReducer, trips);
  const [selectedTrip, setSelectedTrip] = useState(-1);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);

  const [isModalShown, setModalShown] = useState(false);
  const [modalChildren, setModalChildren] = useState(null);

  useEffect(() => {
    if (userTrips?.length !== 0 && typeof userTrips[selectedTrip]?.itinerary !== "undefined") setLoading(false);
  }, [userTrips, selectedTrip]);

  return (
    <appdataContext.Provider
      value={{
        userTrips,
        dispatchUserTrips,
        selectedTrip,
        setSelectedTrip,
        isLoading,
        setLoading,
        isSaving,
        setSaving,

        isModalShown,
        setModalShown,
        modalChildren,
        setModalChildren,
      }}
    >
      {children}
    </appdataContext.Provider>
  );
}

/**
 * Reducer function for managing user trips state.
 * @param trips - The current state of trips.
 * @param action - DispatchAction object containing the action type and payload.
 * @returns The updated state of trips.
 */
function TripsReducer(trips: Trip[], action: DispatchAction) {
  switch (action.type) {
    case UT.REPLACE:
      if (action.userTrips) return action.userTrips;
      return trips;
    case UT.CREATE_TRIP:
      if (action.trip) {
        const newTrips = [...trips];

        const trip = action.trip;
        trip.itinerary = GenerateItinerary(trip.id, trip.startDate, trip.endDate, []);
        newTrips.push(trip);

        return newTrips;
      }
      return trips;
    case UT.UPDATE_TRIP:
      if (action.trip) {
        const newTrips = [...trips];
        const trip = action.trip;

        if (newTrips[trip.position].id !== trip.id) return trips;

        newTrips.splice(trip.position, 1, trip);

        return newTrips;
      }
      return trips;
    case UT.DELETE_TRIP:
      if (action.trip) {
      }
      return trips;
    case UT.CREATE_EVENT:
      if (action.payload) {
        const newTrips = [...trips];
        const { selectedTrip, dayPosition, placeAt, event } = action.payload;

        const dayEvents = newTrips[selectedTrip].itinerary[dayPosition].events;

        if (placeAt === "start") dayEvents.unshift(event);
        else if (placeAt === "end") dayEvents.push(event);

        dayEvents.forEach((event, index) => (event.position = index));
        return newTrips;
      }
      return trips;
    case UT.UPDATE_EVENT:
      if (action.payload) {
        const newTrips = [...trips];
        const { selectedTrip, dayPosition, event } = action.payload;

        if (newTrips[selectedTrip].itinerary[dayPosition].events[event.position].id !== event.id) return trips;
        newTrips[selectedTrip].itinerary[dayPosition].events[event.position] = event;

        return newTrips;
      }
      return trips;
    case UT.DELETE_EVENT:
      if (action.payload) {
        const newTrips = [...trips];
        const { selectedTrip, dayPosition, event } = action.payload;

        if (newTrips[selectedTrip].itinerary[dayPosition].events[event.position].id !== event.id) return trips;

        newTrips[selectedTrip].itinerary[dayPosition].events.splice(event.position, 1);
        newTrips[selectedTrip].itinerary[dayPosition].events.forEach((event, index) => (event.position = index));

        return newTrips;
      }
      return trips;
    /** Return unchanged state */
    default:
      return trips;
  }
}
