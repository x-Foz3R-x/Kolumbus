"use client";

import { createRef, useEffect, useMemo, useState } from "react";
import Sortable from "sortablejs";
import { ReactSortable } from "react-sortablejs";
import useUserTrips from "@/hooks/api/use-user-trips";
import useTripsEvents from "@/hooks/api/use-trips-events";
import useSelectedTrip from "@/hooks/use-selected-trip";
import { ACTION } from "@/hooks/use-actions";

import Day from "./Day";

export default function DaysSection() {
  const { userTrips, dispatchUserTrips, loadingTrips } = useUserTrips();
  const { tripEvents, dispatchTripEvents, loadingEvents, eventsError } =
    useTripsEvents();
  const [selectedTrip] = useSelectedTrip();

  // const [loading, setLoading] = useState(true);

  const DaysRefs = useMemo(() => {
    const refs: any = {};
    for (let i = 0; i < userTrips[selectedTrip]["days"]; i++) {
      refs["day" + i] = createRef();
    }
    return refs;
  }, [userTrips, selectedTrip]);

  const RenderDays = () => {
    const days = [];

    for (let i = 0; i < userTrips[selectedTrip]["days"]; i++) {
      days.push(
        <ul
          key={"day " + i}
          ref={DaysRefs["day" + i]}
          className="mt-5 flex h-[6.75rem] w-full items-center gap-2 px-3 last:mb-5 "
        >
          <Day number={i} />
        </ul>
      );
    }
    return days;
  };

  if (DaysRefs["day" + 0].current != null) {
    for (let i = 0; i < userTrips[selectedTrip]["days"]; i++) {
      Sortable.create(DaysRefs["day" + i].current, {
        group: "shared",
        animation: 150,
        easing: "cubic-bezier(0.175, 0.885, 0.32, 1.1)",
        handle: "li",
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        forceFallback: true,
        fallbackTolerance: 3,
        // onStart: function () {
        // let styl =
        //   "-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;-o-user-select: none;       user-select: none;";
        // for (let j = 0; j < document.querySelectorAll(".date").length; j++) {
        //   document.querySelectorAll(".date")[j].setAttribute("style", styl);
        // }
        // },
        // onEnd: async function (event) {
        // for (let i = 0; i < document.querySelectorAll(".date").length; i++) {
        //   document.querySelectorAll(".date")[i].setAttribute("style", "");
        // }
        // await Post.Trips(
        //   JSON.stringify(Event.UpdatePosition(trips, tripSel, event))
        // );
        // },
        multiDrag: true,
        selectedClass: "event-selected",
        swapThreshold: 1,
      });
    }
  }

  return <section className="flex w-full flex-col">{RenderDays()}</section>;
}
