/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

import useAppdata from "@/context/appdata";

import { UT } from "@/types";
import type { Trip } from "@/types";

export default function useUserTrips() {
  const { userTrips, dispatchUserTrips, selectedTrip } = <
    { userTrips: Trip[]; dispatchUserTrips: any; selectedTrip: number }
  >useAppdata();

  const [loadingTrips, setLoadingTrips] = useState(true);
  const [tripsError, setTripsError] = useState<string | null>(null);
  const [fetchMore, setFetchMore] = useState(true);
  const [fetchedTripsIndex, setFetchedTripsIndex] = useState<number[]>([-1]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (fetchMore === false) return;
        // If there is no current user, retrieve user trips from local storage
        let userTrips;
        if (localStorage.getItem("trips")) {
          userTrips = JSON.parse(localStorage.getItem("trips")!);
        }
        return;
      } catch (error) {
        setTripsError("Failed to fetch user trips");
        console.log(error);
      } finally {
        setFetchMore(false);
      }
    }

    // Fetching events data if the selected trip events has not been fetched before
    if (!fetchedTripsIndex.includes(selectedTrip)) {
      setFetchedTripsIndex((selectedTrips) => [...selectedTrips, selectedTrip]);
      setLoadingTrips(true);
      fetchData();
    }
  }, [selectedTrip]);

  // useEffect(() => {
  //   if (userTrips.length > selectedTrip) setLoadingTrips(false);
  // }, [userTrips]);

  // Function to trigger a refetch of trip events
  const fetchMoreTrips = () => {
    setFetchMore(true);
  };

  return {
    userTrips,
    dispatchUserTrips,
    loadingTrips,
    tripsError,
    fetchMoreTrips,
  };
}
