"use client";

import {
  useState,
  useEffect,
  useReducer,
  useContext,
  createContext,
} from "react";
import { ACTIONS } from "@/lib/utils";

// Creating a context for user data
const UserDataContext = createContext();

// Custom hook to access user data context
export function useUserData() {
  return useContext(UserDataContext);
}

// Reducer function for managing user trips info state
function TripsInfoReducer(state, action) {
  switch (action.type) {
    // Adding a new payload to the state
    case ACTIONS.ADD:
      if (action.payload) return (state = [...state, action.payload]);
    // Emptying state
    case ACTIONS.EMPTY:
      return (state = []);
    // Replacing the state with a new payload
    case ACTIONS.REPLACE:
      if (action.payload) return (state = action.payload);
    // Updating a specific trip info in the state
    case ACTIONS.UPDATE:
      state = state?.map((trip, index) => {
        if (index == action.trip) {
          return { ...trip, [action.field]: action.payload };
        } else {
          return trip;
        }
      });
      return state;
    // Updating multiple fields of a specific trip info in the state
    case ACTIONS.X_UPDATES:
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
    // Return unchanged state
    default:
      return state;
  }
}

// Reducer function for managing user trips state
function TripsReducer(state, action) {
  switch (action.type) {
    // Replacing the state with a new payload
    case ACTIONS.REPLACE:
      if (action.payload) {
        const newState = [...state];
        for (let i = 0; i < action.payload.position + 1; i++) {
          if (typeof state[i] === "undefined") state = [...state, {}];
        }
        newState.splice(action.payload.position, 1, action.payload);
        return newState;
      }
      return state;
    // Replacing the state trip with a new payload
    case ACTIONS.REPLACE_TRIP:
      if (action.payload) {
        const newState = [...state];
        newState.splice(action.payload.position, 1, action.payload);
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
  const [userTripsInfo, dispatchUserTripsInfo] = useReducer(TripsInfoReducer);
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
    userTripsInfo,
    dispatchUserTripsInfo,

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
