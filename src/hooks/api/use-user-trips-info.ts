/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// Importing necessary dependencies and custom hooks
import { useState, useEffect } from "react";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth";
import { useUserData } from "@/context/user-data";
import { ACTIONS } from "@/lib/utils";

// Custom hook for fetching user trips
export default function useUserTripsInfo() {
  const { currentUser } = useAuth();
  const { userTripsInfo, dispatchUserTripsInfo } = useUserData();

  const [loadingTrips, setLoadingTrips] = useState(true);
  const [tripsError, setTripsError] = useState<string | null>(null);

  const [refetch, setRefetch] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (currentUser) {
          // Fetch trips from the Firestore collection based on the current user's ID and order them by position
          const colRef = collection(db, "trips");
          const q = query(
            colRef,
            where("owner_id", "==", currentUser.uid),
            orderBy("position")
          );

          const docSnap = await getDocs(q);

          // Empty the userTripsInfo state
          dispatchUserTripsInfo({ type: ACTIONS.EMPTY });

          // Iterate over the fetched documents and add them to the userTripsInfo state
          docSnap?.docs.forEach((trip) => {
            dispatchUserTripsInfo({ type: ACTIONS.ADD, payload: trip.data() });
          });
        } else {
          // If there is no current user, retrieve trips from local storage
          const docSnap = JSON.parse(localStorage.getItem("trips") || "");
          dispatchUserTripsInfo({ type: ACTIONS.REPLACE, payload: docSnap });
        }
      } catch (error) {
        setTripsError("failed to fetch user trips");
        console.log(error);
      } finally {
        setLoadingTrips(false);
      }
    }

    fetchData();
  }, [refetch]);

  // Function to trigger trips refetching
  const refetchTrips = () => {
    setRefetch(!refetch);
  };

  return {
    userTripsInfo,
    dispatchUserTripsInfo,
    loadingTrips,
    tripsError,
    refetchTrips,
  };
}
