"use client";

import React, { createContext, useContext, useEffect, useState, useReducer } from "react";
import { generateItinerary } from "@/lib/utils";
import { DispatchAction, Trip, UT } from "@/types";

type AppdataContext = {
  userTrips: Trip[];
  dispatchUserTrips: React.Dispatch<DispatchAction>;

  selectedTrip: number;
  setSelectedTrip: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSaving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
};
const appdataContext = createContext<AppdataContext | null>(null);
export default function useAppdata() {
  const context = useContext(appdataContext);
  if (!context) throw new Error("useAppdata must be used within a AppDataProvider");
  return context;
}

export function AppdataProvider({ trips, children }: { trips: Trip[]; children?: React.ReactNode }) {
  const [userTrips, dispatchUserTrips] = useReducer(TripsReducer, trips);

  const [selectedTrip, setSelectedTrip] = useState(-1);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);

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
      }}
    >
      {children}
    </appdataContext.Provider>
  );
}

function TripsReducer(trips: Trip[], action: DispatchAction) {
  switch (action.type) {
    case UT.REPLACE:
      if (action.trips) return action.trips;
      return trips;
    case UT.CREATE_TRIP:
      if (action.trip) {
        const newTrips = [...trips];

        const trip = action.trip;
        trip.itinerary = generateItinerary(trip.startDate, trip.endDate, []);
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
        const newTrips = [...trips];
        const trip = action.trip;

        // Update the position of the trips that are after the trip being deleted
        const tripsToUpdate = newTrips.slice(trip.position + 1);
        tripsToUpdate.forEach((trip, i) => (trip.position = trip.position + i));

        // Remove the deleted trip from the state
        newTrips.splice(trip.position, 1);
        return newTrips;
      }
      return trips;
    case UT.REPLACE_ITINERARY:
      if (action.payload) {
        const newTrips = [...trips];
        const { tripId, itinerary } = action.payload;

        const tripIndex = newTrips.findIndex((trip) => trip.id === tripId);
        if (tripIndex === -1) return trips;

        newTrips[tripIndex].itinerary = itinerary;

        return newTrips;
      }
      return trips;
    case UT.CREATE_EVENT:
      if (action.payload) {
        const newTrips = [...trips];
        const { tripId, event, index } = action.payload;

        const tripIndex = newTrips.findIndex((trip) => trip.id === tripId);
        if (tripIndex === -1) return trips;

        const dayIndex = newTrips[tripIndex].itinerary.findIndex((day) => day.date === event.date);
        if (dayIndex === -1) return trips;

        if (!index) newTrips[tripIndex].itinerary[dayIndex].events.push(event);
        else {
          newTrips[tripIndex].itinerary[dayIndex].events.splice(index, 0, event);
          newTrips[tripIndex].itinerary[dayIndex].events.map((event, index) => (event.position = index));
        }

        return newTrips;
      }
      return trips;
    case UT.UPDATE_EVENT:
      if (action.payload) {
        const newTrips = [...trips];
        const { tripId, event } = action.payload;

        const tripIndex = newTrips.findIndex((trip) => trip.id === tripId);
        if (tripIndex === -1) return trips;

        const dayIndex = newTrips[tripIndex].itinerary.findIndex((day) => day.date === event.date);
        if (dayIndex === -1) return trips;

        const eventIndex = newTrips[tripIndex].itinerary[dayIndex].events.findIndex((e) => e.id === event.id);
        if (eventIndex === -1) return trips;

        if (!newTrips[tripIndex].itinerary[dayIndex].events[eventIndex]) return trips;
        newTrips[tripIndex].itinerary[dayIndex].events[eventIndex] = event;

        return newTrips;
      }
      return trips;
    case UT.DELETE_EVENT:
      if (action.payload) {
        const newTrips = [...trips];
        const { tripId, event } = action.payload;

        const tripIndex = newTrips.findIndex((trip) => trip.id === tripId);
        if (tripIndex === -1) return trips;

        const dayIndex = newTrips[tripIndex].itinerary.findIndex((day) => day.date === event.date);
        if (dayIndex === -1) return trips;

        if (!newTrips[tripIndex].itinerary[dayIndex].events[event.position]) return trips;

        newTrips[tripIndex].itinerary[dayIndex].events.splice(event.position, 1);
        newTrips[tripIndex].itinerary[dayIndex].events.map((event, index) => (event.position = index));

        return newTrips;
      }
      return trips;
    /** Return unchanged state */
    default:
      return trips;
  }
}
