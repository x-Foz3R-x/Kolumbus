"use client";

import {
  useState,
  useEffect,
  useReducer,
  useContext,
  createContext,
} from "react";
import { UT } from "@/config/actions";

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
      state = state?.map((trip, index) => {
        if (index == action.trip) {
          return { ...trip, [action.field]: action.payload };
        } else {
          return trip;
        }
      });
      return state;
    // Updating multiple fields of a specific trip in the state
    case UT.UPDATE_FIELDS:
      state = state?.map((trip, index) => {
        if (index == action.trip) {
          const newTrip = { ...trip };
          for (let i = 0; i < action.fields.length; i++) {
            newTrip[action.fields[i]] = action.payload[i];
          }
          return newTrip;
        } else {
          return trip;
        }
      });
      return state;
    // Updating a specific event field in the state
    case UT.UPDATE_EVENT_FIELD:
      if (action.payload) {
        const { tripIndex, dayIndex, eventIndex, field, payload } = action;
        const newState = [...state];

        newState[tripIndex].itinerary[dayIndex].events[eventIndex][field] =
          payload;

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
