/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// Importing necessary dependencies and functions
import { useState, useEffect } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth";
import { useUserData } from "@/context/user-data";
import useSelectedTrip from "@/hooks/use-selected-trip";
import { ACTION } from "@/hooks/use-actions";

// Defining the custom hook
export default function useTripsEvents() {
  const { currentUser } = useAuth();
  const { tripEvents, dispatchTripEvents } = useUserData();

  const [selectedTrip] = useSelectedTrip();

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState("");

  const [refetch, setRefetch] = useState(true);
  const [fetchedData, setFetchedData] = useState<number[]>([]);

  useEffect(() => {
    // Function to fetch trip events data
    async function fetchData() {
      try {
        if (currentUser) {
          // Querying the trips collection in Firestore
          const colRef = collection(db, "trips");
          const q = query(
            colRef,
            where("owner_id", "==", currentUser.uid),
            where("position", "==", selectedTrip)
          );

          // Retrieving trip documents that match the query
          const docSnap = await getDocs(q);

          // Processing each trip document
          docSnap?.docs.forEach(async (trip) => {
            // Querying the events sub collection of each trip
            const subColRef = collection(db, "trips", trip.id, "events");
            const subDocSnap = await getDocs(subColRef);

            let currentTripEvents: object[] = [];
            // Storing event data in an array
            subDocSnap?.forEach((event) => {
              currentTripEvents = [...currentTripEvents, event.data()];
            });

            // Dispatching an action to add the fetched events to the user data
            dispatchTripEvents({
              type: ACTION.ADD,
              payload: currentTripEvents,
            });
          });
        } else {
          // const docSnap = JSON.parse(localStorage.getItem("trips") || "");
          // setPayload(docSnap);
          console.log("unavailable in guest mode");
        }
      } catch (error) {
        // Handling errors while fetching trip events
        setEventsError("failed to fetch trip events");
        console.log(error);
      } finally {
        // Marking the loading state as false
        setLoadingEvents(false);
      }
    }

    // Fetching events data if the selected trip events has not been fetched before
    if (!fetchedData.includes(selectedTrip)) {
      fetchData();
      setFetchedData((selected) => [...selected, selectedTrip]);
    }
  }, [refetch]);

  // Function to trigger a refetch of trip events
  const refetchEvents = () => {
    setRefetch(!refetch);
  };

  // Returning the necessary values and functions for external usage
  return {
    tripEvents,
    dispatchTripEvents,
    loadingEvents,
    eventsError,
    refetchEvents,
  };
}
