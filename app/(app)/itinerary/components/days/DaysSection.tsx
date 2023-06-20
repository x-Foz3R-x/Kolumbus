"use client";

import { useEffect, useState } from "react";
import { ReactSortable, Sortable } from "react-sortablejs";
import useUserTrips from "@/hooks/api/use-user-trips";
import useTripsEvents from "@/hooks/api/use-trips-events";
import useSelectedTrip from "@/hooks/use-selected-trip";
import { ACTION } from "@/hooks/use-actions";

import Event from "./Event";

// Sortable.mount(new MultiDrag());

export default function DaysSection() {
  const { userTrips, dispatchUserTrips, loadingTrips } = useUserTrips();
  const { tripEvents, dispatchTripEvents, loadingEvents, eventsError } =
    useTripsEvents();
  const [selectedTrip] = useSelectedTrip();

  const [state, setState] = useState([]);

  useEffect(() => {
    if (!loadingEvents) {
      setState(tripEvents);
    }
  }, [loadingEvents]);

  // const [state, setState] = useState([
  //   { id: 1, name: "shrek" },
  //   { id: 2, name: "fiona" },
  // ]);

  console.log(state);

  const RenderDays = () => {
    const days = [];
    let currentDate = new Date(userTrips[selectedTrip]?.["start_date"]);

    for (let i = 0; i < userTrips[selectedTrip]["days"]; i++) {
      let kupa = [
        "biyeuw",
        "fnqeuripf",
        "bfiqepouv",
        "avierkj3",
        "qpbgoelvxnja",
        "vnbqeouivw",
        "bao6gvb3df",
        "asj0qv9buy",
      ];
      // const sortableKey = kupa[i];
      days.push(
        <ReactSortable
          key={kupa[i]}
          list={state}
          setList={setState}
          tag={"ul"}
          group="days"
          sort={true}
          selectedClass="event-selected"
          ghostClass="event-ghost"
          chosenClass="event-chosen"
          dragClass="event-darg"
          animation={150}
          easing="cubic-bezier(0.175, 0.885, 0.32, 1.1)"
          forceFallback={true}
          fallbackTolerance={3}
          multiDrag={true}
          swapThreshold={1}
          className="flex h-[108px] w-full gap-2"
        >
          {state?.map((event: any) =>
            ConvertDate(currentDate) != event["event_date"] ? (
              <></>
            ) : (
              <>
                {console.log(event.event_name)}
                <Event key={event.id} event={event} />
              </>
            )
          )}
        </ReactSortable>
      );

      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
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

  return (
    <section className="flex w-full flex-col gap-5 py-5 pl-4">
      {!loadingEvents && RenderDays()}
    </section>
  );
}
