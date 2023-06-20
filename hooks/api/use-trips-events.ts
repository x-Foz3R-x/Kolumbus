/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// Importing necessary dependencies and functions
import { useState, useEffect } from "react";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth";
import { useUserData } from "@/context/user-data";
import useUserTrips from "@/hooks/api/use-user-trips";
import useSelectedTrip from "@/hooks/use-selected-trip";
import { ACTION } from "@/hooks/use-actions";

// Defining the custom hook
export default function useTripsEvents() {
  const { currentUser } = useAuth();
  const { userTrips, dispatchUserTrips, loadingTrips } = useUserTrips();
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
            const subQ = query(subColRef, orderBy("event_position"));
            const subDocSnap = await getDocs(subQ);

            let currentTripEvents: object[] = [];
            // Storing event data in an array
            subDocSnap?.forEach((event) => {
              let data = event.data();
              data.id = event.id;

              currentTripEvents.push(data);
            });

            // let currentTripEvents: any[] = [];

            // let currentDate = new Date(userTrips[selectedTrip]?.["start_date"]);

            // for (let i = 0; i < userTrips[selectedTrip]?.["days"]; i++) {
            //   subDocSnap?.forEach((event) => {
            //     if (ConvertDate(currentDate) != event.data()["event_date"])
            //       return;

            //     if (currentTripEvents[i] != undefined) {
            //       currentTripEvents[i] = [
            //         ...currentTripEvents[i],
            //         event.data(),
            //       ];
            //     } else currentTripEvents[i] = [event.data()];
            //   });

            //   if (currentTripEvents[i] == undefined)
            //     currentTripEvents = [...currentTripEvents, []];

            //   currentDate.setDate(currentDate.getDate() + 1);
            // }

            // Dispatching an action to add the fetched events to the user data
            dispatchTripEvents({
              type: ACTION.REPLACE,
              payload: currentTripEvents,
            });
          });
        } else {
          const docSnap = JSON.parse(localStorage.getItem("trips_events")!);
          dispatchTripEvents({
            type: ACTION.REPLACE,
            payload: docSnap,
          });
          // console.log("unavailable in guest mode");
        }
      } catch (error) {
        // Handling errors while fetching trip events
        setEventsError("failed to fetch trip events");
        console.log(error);
      } finally {
        // Marking the loading state as false
        setLoadingEvents(false);
        setRefetch(false);
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
    setRefetch(true);
  };

  /**
   * Converts date to text.
   * @param {Date} dateToConvert
   * @returns {string} Date in yyyy-mm-dd format
   */
  function ConvertDate(dateToConvert: Date) {
    let date = new Date(dateToConvert);

    let dd: string | number = date.getDate();
    let mm: string | number = date.getMonth() + 1;
    let yyyy: number = date.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    return yyyy + "-" + mm + "-" + dd;
  }

  // Returning the necessary values and functions for external usage
  return {
    tripEvents,
    dispatchTripEvents,
    loadingEvents,
    eventsError,
    refetchEvents,
  };
}
