/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import useUserTrips from "@/hooks/api/use-user-trips";
import useTripsEvents from "@/hooks/api/use-trips-events";
import useSelectedTrip from "@/hooks/use-selected-trip";
import { ACTION } from "@/hooks/use-actions";

export function useSortedTripsEvents() {
  const { userTrips } = useUserTrips();
  const { tripEvents, dispatchTripEvents, loadingEvents, eventsError } =
    useTripsEvents();
  const [selectedTrip] = useSelectedTrip();

  const [days, setDays] = useState<Array<any>>();

  useEffect(() => {
    if (loadingEvents) return;

    const sortedDays: object[] = [];
    let iteratedDate = new Date(userTrips[selectedTrip]?.start_date);

    for (let i = 0; i < userTrips[selectedTrip]?.days; i++) {
      let currentDate = ConvertDate(iteratedDate);

      const currentEvents: object[] = [];
      tripEvents.forEach((event: { event_date: string }) => {
        if (currentDate == event.event_date) currentEvents.push(event);
      });

      sortedDays.push({
        id: currentDate,
        events: currentEvents,
      });

      iteratedDate.setDate(iteratedDate.getDate() + 1);
    }

    setDays(sortedDays);

    // console.log("days:");
    // console.log(days);
  }, [tripEvents]);

  return [days, dispatchTripEvents];
}

export function useSetTripsEvents(payload?: any[]) {
  if (!payload) return;

  const updatedTripEvents: object[] = [];
  for (let i = 0; i < payload.length; i++) {
    if (!payload[i].events[0]) continue;

    payload[i].events.forEach((event: object) => {
      updatedTripEvents.push(event);
    });
  }
  // console.log(updatedTripEvents);

  return payload;
}

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
