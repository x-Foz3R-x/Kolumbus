/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { easepick, AmpPlugin, RangePlugin, LockPlugin, DateTime } from "@easepick/bundle";

import useAppData from "@/context/app-data";
import useUserTrips from "@/hooks/use-user-trips";
import { calculateDays, formatDate } from "@/lib/utils";
import { UT } from "@/types";

import Icon from "../icons";
import { EventsOnExcludedDaysModal } from "../ui/modal";
import { firebaseUpdateTrip } from "@/hooks/use-firebase-operations";

export default function DatePicker() {
  const { selectedTrip, setModalShown, setModalChildren } = useAppData();
  const { userTrips, dispatchUserTrips, loadingTrips } = useUserTrips();

  const [isPickerOpen, setPickerOpen] = useState(false);
  const [date, setDate] = useState({
    start: new DateTime(),
    end: new DateTime(),
  });

  useEffect(() => {
    if (!loadingTrips) {
      setDate({
        start: new Date(userTrips[selectedTrip]?.start_date),
        end: new Date(userTrips[selectedTrip]?.end_date),
      });
    }
  }, [loadingTrips]);

  const DatePickerRef = useRef();

  const handlePicker = () => {
    if (isPickerOpen) return;
    if (!isPickerOpen) setPickerOpen(true);

    const picker = new easepick.create({
      element: DatePickerRef.current,
      css: ["/easepick.css"],
      autoApply: false,
      zIndex: 10,
      format: "",
      AmpPlugin: {
        dropdown: {
          months: true,
          years: true,
          minYear: 2020,
          maxYear: new Date().getFullYear() + 10,
        },
      },
      RangePlugin: {
        startDate: date.start,
        endDate: date.end,
      },
      LockPlugin: {
        // maxDays: 30,
      },
      plugins: [AmpPlugin, RangePlugin, LockPlugin],
    });

    picker.show();
    picker.on("select", async () => {
      const startDate = picker.getStartDate();
      const endDate = picker.getEndDate();

      if (date.start === startDate && date.end === endDate) return;

      const trip = { ...userTrips[selectedTrip] };
      trip.start_date = formatDate(startDate);
      trip.end_date = formatDate(endDate);
      trip.days = calculateDays(startDate, endDate);
      trip.metadata.updated_at = Date.now();

      if (date.start >= startDate && date.end <= endDate) {
        setDate({
          start: startDate,
          end: endDate,
        });

        firebaseUpdateTrip(trip);
        dispatchUserTrips({
          type: UT.UPDATE_TRIP,
          payload: {
            trip,
            selectedTrip,
            regenerate: true,
          },
        });
        return;
      }

      const activeItinerary = userTrips[selectedTrip]?.itinerary;
      if (activeItinerary === undefined) return;
      const startDaysToDelete = date.start >= startDate ? 0 : calculateDays(date.start, startDate) - 1;
      if (startDaysToDelete === undefined) return;
      const endDaysToDelete = date.end <= endDate ? 0 : calculateDays(endDate, date.end) - 1;
      if (endDaysToDelete === undefined) return;
      const numberOfDays = activeItinerary.length - 1;

      let eventsToDelete = [];
      for (let i = 0; i < startDaysToDelete; i++) {
        const events = activeItinerary[i]?.events;
        events?.forEach((event) => {
          eventsToDelete.push(event);
        });
      }
      for (let i = numberOfDays; i > numberOfDays - endDaysToDelete; i--) {
        const events = activeItinerary[i]?.events;
        events?.forEach((event) => {
          eventsToDelete.push(event);
        });
      }

      if (eventsToDelete.length === 0) {
        setDate({
          start: startDate,
          end: endDate,
        });

        firebaseUpdateTrip(trip);
        dispatchUserTrips({
          type: UT.UPDATE_TRIP,
          payload: {
            trip,
            selectedTrip,
            regenerate: true,
          },
        });
        return;
      }

      const handleExcludedDays = () => {
        setDate({
          start: startDate,
          end: endDate,
        });

        firebaseUpdateTrip(trip);
        dispatchUserTrips({
          type: UT.UPDATE_TRIP,
          payload: {
            trip,
            selectedTrip,
            regenerate: true,
          },
        });
        setModalShown(false);
      };

      setModalShown(true);
      setModalChildren(EventsOnExcludedDaysModal(eventsToDelete, handleExcludedDays));
    });
    picker.on("hide", () => {
      setPickerOpen(false);
      picker.destroy();
    });
  };

  return (
    <div className="relative select-none">
      <Icon.rangeCalendar className="absolute h-9 fill-kolumblue-500" />

      <section className="absolute h-9 w-[5.0625rem] text-center text-[10px] font-medium text-white/75">
        <div className="absolute left-[-0.125rem] top-1 w-10">
          {!loadingTrips && date.start.toLocaleString("default", { month: "short" }).toUpperCase()}
        </div>
        <div className="absolute right-[-0.125rem] top-1 w-10">
          {!loadingTrips && date.end.toLocaleString("default", { month: "short" }).toUpperCase()}
        </div>
      </section>

      <section className="absolute h-9 w-[5.0625rem] text-center text-sm font-medium">
        <div className="absolute bottom-0 left-[-0.125rem] w-10">{!loadingTrips && date.start.getDate()}</div>
        <div className="absolute bottom-0 right-[-0.125rem] w-10">{!loadingTrips && date.end.getDate()}</div>
      </section>

      <input
        className="relative z-10 h-9 w-[5.0625rem] cursor-pointer appearance-none border-none bg-transparent text-xs font-thin text-transparent outline-0"
        onClick={handlePicker}
        ref={DatePickerRef}
        readOnly
      />
    </div>
  );
}
