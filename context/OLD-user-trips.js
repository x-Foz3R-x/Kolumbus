/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  useState,
  useEffect,
  useReducer,
  useContext,
  createContext,
} from "react";

const UserTripsContext = createContext();

export function useUserTrips() {
  return useContext(UserTripsContext);
}

/**
 * @param REPLACE > { type: ACTION.REPLACE, payload: payload }
 * @param ADD > { type: ACTION.ADD, payload: payload }
 * @param UPDATE > { type: ACTION.X_UPDATES, trip: selectedTrip, field: string, payload: data }
 * @param X_UPDATES > { type: ACTION.X_UPDATES, trip: selectedTrip, fields: string[], payload: data[] }
 */
const ACTION = {
  // dispatch({ type: ACTION.REPLACE, payload: payload });
  REPLACE: "replace",

  // dispatch({ type: ACTION.ADD, payload: payload });
  ADD: "add",

  // dispatch({ type: ACTION.X_UPDATES, trip: selectedTrip, field: string, payload: data, });
  UPDATE: "update",

  // dispatch({ type: ACTION.X_UPDATES, trip: selectedTrip, fields: string[], payload: data[], });
  X_UPDATES: "x_updates",
};

function UserTrips(state, action) {
  switch (action.type) {
    case ACTION.REPLACE:
      if (action.payload) return (state = action.payload);
    case ACTION.ADD:
      if (action.payload) return (state = [...state, action.payload]);
    case ACTION.UPDATE:
      state = state.map((trip, index) => {
        if (index == action.trip) {
          return { ...trip, [action.field]: action.payload };
        } else {
          return trip;
        }
      });
      return state;
    case ACTION.X_UPDATES:
      state = state.map((trip, index) => {
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
    default:
      return state;
  }
}

export function UserTripsProvider({ children }) {
  const [userTrips, dispatch] = useReducer(UserTrips, []);
  const [selectedTrip, setSelectedTrip] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("selected_trip")) {
      setSelectedTrip(JSON.parse(sessionStorage.getItem("selected_trip")));
    } else {
      sessionStorage.setItem("selected_trip", "0");
    }
  }, []);

  const value = {
    userTrips,
    dispatch,
    ACTION,
    selectedTrip,
    setSelectedTrip,
  };

  return (
    <UserTripsContext.Provider value={value}>
      {children}
    </UserTripsContext.Provider>
  );
}
