/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { FormatDate } from "@/lib/utils";
import { UT } from "@/config/actions";

import type { Trip, Days, Day, Events, Event } from "@/types";

import { useAuth } from "@/context/auth";
import { useUserData } from "@/context/user-data";
import { fallbackTrip } from "@/config/fallback-data";

export default function useUserTrips() {
  const { currentUser } = useAuth();
  const { userTrips, dispatchUserTrips, selectedTrip, setSelectedTrip } =
    useUserData();

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
        const q = query(
          colRef,
          where("owner_id", "==", currentUser.uid),
          orderBy("position")
        );
        const docSnap = await getDocs(q);

        // Iterate over the fetched documents and dispatch them to the userTrips
        for (let i = 0; i < docSnap?.docs.length; i++) {
          const trip = docSnap?.docs[i];
          let Trip: Trip = <Trip>trip.data() || fallbackTrip;
          Trip.id = trip.id;

          // Fetch selected trip itinerary
          if (Trip.position === selectedTrip) {
            // Querying the events sub collection
            const subColRef = collection(db, `trips/${trip.id}/events`);
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
                id: `d${i}@` + Trip.id,
                date: currentDate,
                drag_type: "day",
                events: currentDateEvents,
              };

              TripDays.push(Day);
              iteratedDate.setDate(iteratedDate.getDate() + 1);
            }

            Trip.itinerary = TripDays;
          }

          dispatchUserTrips({
            type: UT.ADD_REPLACE_TRIP,
            payload: Trip,
          });
        }
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
      setFetchedTripsIndex((selectedTrips) => [...selectedTrips, selectedTrip]);
      setLoadingTrips(true);
      fetchData();
    }
  }, [selectedTrip]);

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

    selectedTrip,
    setSelectedTrip,
  };
}
