"use client";

import React, { createContext, useContext, useEffect, useState, useReducer } from "react";

import { generateItinerary } from "@/lib/utils";
import { UT, Trip, Day } from "@/types";

// Creating a context for user data
const appDataContext = createContext<any>({});

// Custom hook to access user data context
export default function useAppData() {
  return useContext(appDataContext);
}

// Reducer function for managing user trips state
function TripsReducer(state: Trip[], action: { type: UT; payload: any }) {
  const _state = [...state];

  switch (action.type) {
    // replacing the state with a new payload
    case UT.REPLACE:
      if (action.payload) {
        let newState = [...state];
        newState = action.payload;
        return newState;
      }
      return state;
    // Adding/replacing the state trip with a new payload
    case UT.ADD_REPLACE_TRIP:
      if (action.payload) {
        const newState = [...state];

        if (typeof newState[action.payload.position]?.itinerary !== "undefined") return newState;

        newState.splice(action.payload.position, 1, action.payload);

        return newState;
      }
      return state;
    // Replacing the state trip itinerary with a new payload
    case UT.REPLACE_TRIP:
      if (action.payload) {
        const newState = [...state];
        newState.splice(action.payload.position, 1, action.payload);
        return newState;
      }
      return state;
    // Updating a specific trip field in the state
    case UT.UPDATE_FIELD:
      if (action.payload) {
        const { regenerate, selectedTrip, field, value } = action.payload;
        const newState = [...state];
        const trip = newState[selectedTrip];

        // Create an updated state with the modified field and current timestamp
        const updatedState = {
          ...trip,
          updated_at: Date.now(),
          [field]: value,
        };

        // Regenerate the itinerary if requested
        if (regenerate) {
          // Flatten the events array from the existing itinerary
          const events = trip.itinerary?.flatMap((day: Day) => day?.events) ?? [];

          // Generate a new itinerary based on the updated state and events
          updatedState.itinerary = generateItinerary(updatedState, events);
        }

        // Update the selected state in the new state and return it
        newState[selectedTrip] = updatedState;
        return newState;
      }
      return state;
    // Updating multiple fields of a specific trip in the state
    case UT.UPDATE_FIELDS:
      if (action.payload) {
        const { regenerate, selectedTrip, fields, values } = action.payload;
        const newState = [...state];
        const trip = newState[selectedTrip];

        // Create an updated state with the modified fields and current timestamp
        const updatedState = {
          ...trip,
          ...Object.fromEntries(fields.map((field: string, index: number) => [field, values[index]])),
          updated_at: Date.now(),
        };

        // Regenerate the itinerary if requested
        if (regenerate) {
          // Flatten the events array from the existing itinerary
          const events = trip.itinerary?.flatMap((day: Day) => day?.events) ?? [];

          // Generate a new itinerary based on the updated state and events
          updatedState.itinerary = generateItinerary(updatedState, events);
        }

        // Update the selected state in the new state and return it
        newState[selectedTrip] = updatedState;
        return newState;
      }
      return state;
    // Updating a specific event field in the state
    case UT.UPDATE_EVENT_FIELD:
      if (action.payload) {
        const typedPayload: {
          selectedTrip: number;
          dayIndex: number;
          eventIndex: number;
          field: string;
          value: string;
        } = action.payload;
        const { selectedTrip, dayIndex, eventIndex, field, value } = typedPayload;
        const newState = [...state];

        newState[selectedTrip].updated_at = Date.now();
        newState[selectedTrip].itinerary[dayIndex].events[eventIndex][field] = value;

        return newState;
      }
      return state;
    case UT.UPDATE_TRIP:
      if (action.payload) {
        const { trip, selectedTrip, regenerate } = action.payload;

        if (regenerate) {
          // Flatten the events array from the existing itinerary
          const events = trip.itinerary?.flatMap((day: Day) => day?.events) ?? [];

          // Generate a new itinerary based on the updated state and events
          trip.itinerary = generateItinerary(trip, events);
        }

        _state[selectedTrip] = trip;
        return _state;
      }
      return state;
    // Inserting trip to user trip
    case UT.INSERT_TRIP:
      if (!action.payload) return state;

      const { trip } = action.payload;
      _state.push(trip);

      return _state;
    // Inserting event to user trip
    case UT.INSERT_EVENT:
      if (!action.payload) return state;

      const { selectedTrip, dayIndex, placeAt, event } = action.payload;
      const itinerary = _state[selectedTrip].itinerary[dayIndex].events;

      _state[selectedTrip].updated_at = Date.now();

      if (placeAt === "start") itinerary.unshift(event);
      else if (placeAt === "end") itinerary.push(event);

      itinerary.forEach((event, index) => (event.position = index));
      return _state;
    // Return unchanged state
    default:
      return state;
  }
}

// UserDataProvider component for providing user data context
export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [userTrips, dispatchUserTrips] = useReducer(TripsReducer, []);
  const [selectedTrip, setSelectedTrip] = useState(0);

  const [isModalShown, setModalShown] = useState(false);
  const [modalChildren, setModalChildren] = useState(null);

  // Initializing the selected trip from session storage or defaulting to 0
  useEffect(() => {
    if (sessionStorage.getItem("selected_trip")) {
      setSelectedTrip(JSON.parse(sessionStorage.getItem("selected_trip")!));
    } else {
      sessionStorage.setItem("selected_trip", "0");
    }
  }, []);

  // Value object for the user data context
  const value = {
    userTrips,
    dispatchUserTrips,

    selectedTrip,
    setSelectedTrip,

    isModalShown,
    setModalShown,
    modalChildren,
    setModalChildren,
  };

  return <appDataContext.Provider value={value}>{children}</appDataContext.Provider>;
}
