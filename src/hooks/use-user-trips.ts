/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";

import { useAuth } from "@/context/auth";
import useAppData from "@/context/app-data";

import { db } from "@/lib/firebase";
import { generateItinerary } from "@/lib/utils";
import { tripTemplate } from "@/config/template-data";
import { UT } from "@/types";
import type { Trip, Event } from "@/types";

export default function useUserTrips() {
  const { currentUser } = useAuth();
  const { userTrips, dispatchUserTrips, selectedTrip } = <
    { userTrips: Trip[]; dispatchUserTrips: any; selectedTrip: number }
  >useAppData();

  const [loadingTrips, setLoadingTrips] = useState(true);
  const [tripsError, setTripsError] = useState<string | null>(null);
  const [fetchMore, setFetchMore] = useState(true);
  const [fetchedTripsIndex, setFetchedTripsIndex] = useState<number[]>([-1]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (fetchMore === false) return;
        // If there is no current user, retrieve user trips from local storage
        if (!currentUser) {
          let userTrips;
          if (localStorage.getItem("trips")) {
            userTrips = JSON.parse(localStorage.getItem("trips")!);
          } else {
            userTrips = "[WELCOME TRIP]";
            localStorage.setItem("trips", userTrips);
          }
          dispatchUserTrips({ type: UT.REPLACE, payload: userTrips });
          return;
        }

        // Fetch trips from the Firestore collection based on the current user's ID and order them by position
        const colRef = collection(db, "trips");
        const q = query(colRef, where("owner_id", "==", currentUser.uid), orderBy("position"));
        const docSnap = await getDocs(q);

        // Iterate over the fetched documents and dispatch them to the userTrips
        for (let i = 0; i < docSnap?.docs.length; i++) {
          const tripSnap = docSnap?.docs[i];
          let trip: Trip = tripSnap.data() ? <Trip>tripSnap.data() : <Trip>{ ...tripTemplate };
          trip.id = tripSnap.id;

          // Fetch selected trip itinerary
          if (trip.position === selectedTrip) {
            // Querying the events sub collection
            const subColRef = collection(db, `trips/${tripSnap.id}/events`);
            const subQ = query(subColRef, orderBy("position"));
            const subDocSnap = await getDocs(subQ);

            // Store event data in an array
            const events: Event[] = [];
            subDocSnap?.forEach((eventSnap) => {
              const event = <Event>eventSnap.data();
              event.id = eventSnap.id;
              event.drag_type = "event";
              events.push(event);
            });

            trip.itinerary = generateItinerary(trip, events);
          }

          dispatchUserTrips({
            type: UT.ADD_REPLACE_TRIP,
            payload: trip,
          });
        }
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

  useEffect(() => {
    if (userTrips.length > selectedTrip) setLoadingTrips(false);
  }, [userTrips]);

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
