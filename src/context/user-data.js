"use client";

import {
  useState,
  useEffect,
  useReducer,
  useContext,
  createContext,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { UT } from "@/config/actions";
import { generateItinerary } from "@/lib/utils";

// Creating a context for user data
const UserDataContext = createContext([]);

// Custom hook to access user data context
export function useUserData() {
  return useContext(UserDataContext);
}

// Reducer function for managing user trips state
function TripsReducer(state, action) {
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

        if (typeof newState[action.payload.position]?.itinerary !== "undefined")
          return newState;

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
          const events = trip.itinerary?.flatMap((day) => day?.events) ?? [];

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
          ...Object.fromEntries(
            fields.map((field, index) => [field, values[index]])
          ),
          updated_at: Date.now(),
        };

        // Regenerate the itinerary if requested
        if (regenerate) {
          // Flatten the events array from the existing itinerary
          const events = trip.itinerary?.flatMap((day) => day?.events) ?? [];

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
        const { selectedTrip, dayIndex, eventIndex, field, value } =
          action.payload;
        const newState = [...state];

        newState[selectedTrip].updated_at = Date.now();
        newState[selectedTrip].itinerary[dayIndex].events[eventIndex][field] =
          value;

        return newState;
      }
      return state;
    // Inserting empty event
    case UT.INSERT_EVENT:
      if (action.payload) {
        const { selectedTrip, dayIndex, position } = action.payload;
        const newState = [...state];

        newState[selectedTrip].updated_at = Date.now();

        const pushIndex =
          newState[selectedTrip].itinerary[dayIndex].events.length + 1;
        const event = {
          address: "",
          cost: 0,
          date: newState[selectedTrip].itinerary[dayIndex].date,
          drag_type: "event",
          id: uuidv4(),
          link: "",
          name: "",
          position: position === "at_start" ? 0 : pushIndex,
          type: "",
        };

        if (position === "at_start") {
          newState[selectedTrip].itinerary[dayIndex].events.splice(0, 0, event);
        }

        if (position === "at_end") {
          newState[selectedTrip].itinerary[dayIndex].events.splice(
            pushIndex,
            0,
            event
          );
        }

        return newState;
      }
      return state;
    // Return unchanged state
    default:
      return state;
  }
}

// UserDataProvider component for providing user data context
export function UserDataProvider({ children }) {
  const [userTrips, dispatchUserTrips] = useReducer(TripsReducer, []);
  const [selectedTrip, setSelectedTrip] = useState(0);

  // Initializing the selected trip from session storage or defaulting to 0
  useEffect(() => {
    if (sessionStorage.getItem("selected_trip")) {
      setSelectedTrip(JSON.parse(sessionStorage.getItem("selected_trip")));
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
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}
