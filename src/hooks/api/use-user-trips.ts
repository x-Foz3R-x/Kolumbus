/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { FormatDate, ACTIONS } from "@/lib/utils";

import type { Trip, Days, Day, Events, Event } from "@/types";

import { useAuth } from "@/context/auth";
import { useUserData } from "@/context/user-data";

export default function useUserTrips() {
  const { currentUser } = useAuth();
  const { userTrips, dispatchUserTrips, selectedTrip } = useUserData();

  const [loadingTrips, setLoadingTrips] = useState(true);
  const [tripsError, setTripsError] = useState<string | null>(null);
  const [fetchMore, setFetchMore] = useState(true);
  const [fetchedTripsIndex, setFetchedTripsIndex] = useState<number[]>([-1]);

  useEffect(() => {
    async function fetchData() {
      try {
        // If there is no current user, retrieve trips from local storage
        if (!currentUser) {
          const docSnap = JSON.parse(localStorage.getItem("trips")!);
          dispatchUserTrips({ type: ACTIONS.REPLACE, payload: docSnap });
          return;
        }

        // Fetch trips from the Firestore collection based on the current user's ID and order them by position
        const colRef = collection(db, "trips");
        const q = query(
          colRef,
          where("owner_id", "==", currentUser.uid),
          where("position", "==", selectedTrip)
        );
        const docSnap = await getDocs(q);

        const tripsData = userTrips;

        // Iterate over the fetched documents and dispatch them to the userTrips
        docSnap?.docs.forEach(async (trip) => {
          let Trip: Trip | any = trip.data();
          Trip.id = trip.id;

          // Querying the events sub collection
          const subColRef = collection(db, "trips", trip.id, "events");
          const subQ = query(subColRef, orderBy("position"));
          const subDocSnap = await getDocs(subQ);

          // Store event data in an array
          const TripEvents: Events = [];
          subDocSnap?.forEach((event) => {
            let Event: Event | any = event.data();
            Event.id = event.id;
            TripEvents.push(Event);
          });

          const TripDays: Days = [];
          let iteratedDate = new Date(Trip?.start_date);

          // Generate the itinerary
          for (let i = 0; i < Trip.days; i++) {
            const currentDate = FormatDate(iteratedDate);
            const currentDateEvents: Events = TripEvents.filter(
              (event: Event) => event.date === currentDate
            );

            const Day: Day = {
              id: `d${i}`,
              date: currentDate,
              drag_type: "day",
              events: currentDateEvents,
            };

            TripDays.push(Day);
            iteratedDate.setDate(iteratedDate.getDate() + 1);
          }

          Trip.itinerary = TripDays;

          // Generate the trips
          for (let j = 0; j <= Trip.position; j++) {
            // Replace the existing trip at the specified position with the new trip
            if (Trip.position === j) tripsData.splice(j, 1, Trip);
            // Replace the existing trip at the specified position with the existing trip from userTrips
            else if (typeof userTrips[j] !== "undefined")
              tripsData.splice(j, 1, userTrips[j]);
            // Add an empty trip at the specified position
            else if (typeof userTrips[j] === "undefined") tripsData.push([]);
          }

          dispatchUserTrips({ type: ACTIONS.REPLACE, payload: tripsData });
        });
      } catch (error) {
        setTripsError("Failed to fetch user trips");
        console.log(error);
      } finally {
        setLoadingTrips(false);
        setFetchMore(false);
      }
    }

    // Fetching events data if the selected trip events has not been fetched before
    if (!fetchedTripsIndex.includes(selectedTrip)) {
      fetchData();
      setFetchedTripsIndex((selectedTrips) => [...selectedTrips, selectedTrip]);
    }
  }, [fetchMore]);

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
