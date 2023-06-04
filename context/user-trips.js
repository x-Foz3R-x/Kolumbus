/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useContext, createContext, useReducer } from "react";

const UserTripsContext = createContext();

export function useUserTrips() {
  return useContext(UserTripsContext);
}

const ACTIONS = {
  REPLACE: "replace",
  ADD: "add",
};

function UserTrips(state, action) {
  switch (action.type) {
    case ACTIONS.REPLACE:
      if (action.payload) return (state = action.payload);
    case ACTIONS.ADD:
      if (action.payload) return (state = [...state, action.payload]);
    default:
      return state;
  }
}

export function UserTripsProvider({ children }) {
  const [userTrips, dispatch] = useReducer(UserTrips, []);

  const value = {
    userTrips,
    dispatch,
    ACTIONS,
  };

  return (
    <UserTripsContext.Provider value={value}>
      {children}
    </UserTripsContext.Provider>
  );
}
