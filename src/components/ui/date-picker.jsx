"use client";

import { useState, useEffect, useRef } from "react";
import { easepick, AmpPlugin, RangePlugin, LockPlugin, DateTime } from "@easepick/bundle";

import useAppdata from "@/context/appdata";
import { CalculateDays, FormatDate } from "@/lib/utils";
import { UT } from "@/types";

import Icon from "../icons";
import { EventsOnExcludedDaysModal } from "./modal";

export default function DatePicker() {
  const { userTrips, dispatchUserTrips, selectedTrip, isLoading, setModalShown, setModalChildren } =
    useAppdata();

  const [isDisplayed, setDisplay] = useState(false);
  const [startDate, setStartDate] = useState(new DateTime());
  const [endDate, setEndDate] = useState(new DateTime());

  useEffect(() => {
    if (isLoading || selectedTrip === -1 || !userTrips) return;

    setStartDate(new DateTime(userTrips[selectedTrip]?.startDate));
    setEndDate(new DateTime(userTrips[selectedTrip]?.endDate));
  }, [userTrips, selectedTrip, isLoading]);

  const DatePickerRef = useRef();

  const handlePicker = () => {
    if (isDisplayed) return;
    if (!isDisplayed) setDisplay(true);

    const picker = new easepick.create({
      element: DatePickerRef.current,
      css: ["/easepick.css"],
      autoApply: false,
      zIndex: 10,
      plugins: [AmpPlugin, RangePlugin, LockPlugin],
      AmpPlugin: {
        dropdown: {
          months: true,
          years: true,
          minYear: new Date().getFullYear() - 5,
          maxYear: new Date().getFullYear() + 10,
        },
      },
      RangePlugin: {
        startDate: startDate,
        endDate: endDate,
      },
      LockPlugin: {
        maxDays: 30,
      },
    });

    picker.show();
    picker.on("select", async () => {
      const pickedStartDate = picker.getStartDate();
      const pickedEndDate = picker.getEndDate();

      if (startDate === pickedStartDate && endDate === pickedEndDate) return;

      const currentTrip = userTrips[selectedTrip];
      currentTrip.startDate = FormatDate(pickedStartDate);
      currentTrip.endDate = FormatDate(pickedEndDate);
      currentTrip.days = CalculateDays(pickedStartDate, pickedEndDate);

      if (startDate >= pickedStartDate && endDate <= pickedEndDate) {
        setStartDate(pickedStartDate);
        setEndDate(pickedEndDate);

        dispatchUserTrips({ type: UT.REPLACE, userTrips });
        return;
      }

      const currentItinerary = userTrips[selectedTrip]?.itinerary;
      if (currentItinerary === undefined) return;
      const numberOfDays = currentItinerary.length - 1;

      const startDaysToDelete =
        startDate < pickedStartDate ? CalculateDays(startDate, pickedStartDate) - 1 : 0;
      const endDaysToDelete = endDate > pickedEndDate ? CalculateDays(pickedEndDate, endDate) - 1 : 0;

      let eventsToDelete = [];
      for (let i = 0; i < startDaysToDelete; i++) {
        const events = currentItinerary[i]?.events;
        events?.forEach((event) => {
          eventsToDelete.push(event);
        });
      }
      for (let i = numberOfDays; i > numberOfDays - endDaysToDelete; i--) {
        const events = currentItinerary[i]?.events;
        events?.forEach((event) => {
          eventsToDelete.push(event);
        });
      }

      if (eventsToDelete.length === 0) {
        setStartDate(pickedStartDate);
        setEndDate(pickedEndDate);

        dispatchUserTrips({ type: UT.REPLACE, userTrips });
        return;
      }

      const handleExcludedDays = () => {
        setStartDate(pickedStartDate);
        setEndDate(pickedEndDate);

        dispatchUserTrips({ type: UT.REPLACE, userTrips });
        setModalShown(false);
      };

      setModalShown(true);
      setModalChildren(EventsOnExcludedDaysModal(eventsToDelete, handleExcludedDays));
    });
    picker.on("hide", () => {
      setDisplay(false);
      picker.destroy();
    });
  };

  return (
    <div className="relative select-none">
      <Icon.rangeCalendar className="absolute h-9 fill-kolumblue-500" />

      <section className="absolute h-9 w-[5.0625rem] text-center text-[10px] font-medium text-white/75">
        <div className="absolute left-[-0.125rem] top-1 w-10">
          {!isLoading && startDate?.toLocaleString("default", { month: "short" }).toUpperCase()}
        </div>
        <div className="absolute right-[-0.125rem] top-1 w-10">
          {!isLoading && endDate?.toLocaleString("default", { month: "short" }).toUpperCase()}
        </div>
      </section>

      <section className="absolute h-9 w-[5.0625rem] text-center text-sm font-medium">
        <div className="absolute bottom-0 left-[-0.125rem] w-10">{!isLoading && startDate?.getDate()}</div>
        <div className="absolute bottom-0 right-[-0.125rem] w-10">{!isLoading && endDate?.getDate()}</div>
      </section>

      <input
        id="datepicker"
        className="relative z-10 h-9 w-[5.0625rem] cursor-pointer appearance-none border-none bg-transparent text-xs font-thin text-transparent outline-0"
        onClick={handlePicker}
        ref={DatePickerRef}
        readOnly
      />
    </div>
  );
}
