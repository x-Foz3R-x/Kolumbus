"use client";

import { useState, useRef } from "react";
import { easepick, AmpPlugin, RangePlugin, LockPlugin } from "@easepick/bundle";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { useActionBarContext } from "../itinerary/action-bar";
import { CalculateDays, GenerateItinerary } from "@/lib/utils";
import { UT } from "@/types";

import Icon from "../icons";
import { EventsOnExcludedDaysModal } from "./modalOld";

export default function DatePicker() {
  const { dispatchUserTrips, setSaving, setModalShown, setModalChildren } = useAppdata();
  const { activeTrip } = useActionBarContext();
  const updateTrip = api.trip.update.useMutation();

  const [isDisplayed, setDisplay] = useState(false);

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
      AmpPlugin: { dropdown: { months: true, years: true } },
      RangePlugin: { startDate: new Date(activeTrip.startDate), endDate: new Date(activeTrip.endDate) },
      LockPlugin: { maxDays: 30 },
    });

    const formatPickerDate = (date) => {
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };

    picker.show();
    picker.on("select", async () => {
      const pickedStartDate = formatPickerDate(picker.getStartDate());
      const pickedEndDate = formatPickerDate(picker.getEndDate());
      const startDate = new Date(activeTrip.startDate);
      const endDate = new Date(activeTrip.endDate);

      if (startDate === pickedStartDate && endDate === pickedEndDate) return;

      const trip = { ...activeTrip };
      const events = trip.itinerary.flatMap((day) => day.events) ?? [];

      trip.startDate = pickedStartDate.toISOString();
      trip.endDate = pickedEndDate.toISOString();
      trip.itinerary = GenerateItinerary(trip.id, trip.startDate, trip.endDate, events);

      // Apply changes when there are no conflicting dates.
      if (startDate >= pickedStartDate && endDate <= pickedEndDate) {
        setSaving(true);
        dispatchUserTrips({ type: UT.UPDATE_TRIP, trip });
        updateTrip.mutate(
          { tripId: trip.id, data: { startDate: trip.startDate, endDate: trip.endDate } },
          {
            onSuccess(updatedTrip) {
              if (!updatedTrip) return;
              dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: { ...trip, updatedAt: updatedTrip.updatedAt } });
            },
            onError(error) {
              console.error(error);
              dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: activeTrip });
            },
            onSettled() {
              setSaving(false);
            },
          },
        );
        return;
      }

      const eventsToDelete = [];
      const daysToDeleteFromStart = startDate < pickedStartDate ? CalculateDays(startDate, pickedStartDate, false) : 0;
      const daysToDeleteFromEnd = endDate > pickedEndDate ? CalculateDays(pickedEndDate, endDate, false) : 0;

      // Collect events from both the start and end of the itinerary that are about to be deleted.
      for (let i = 0; i < daysToDeleteFromStart; i++) {
        const events = activeTrip.itinerary[i]?.events;
        events?.forEach((event) => eventsToDelete.push(event));
      }
      for (let i = activeTrip.itinerary.length; i > activeTrip.itinerary.length - daysToDeleteFromEnd; i--) {
        // Subtract 1 from 'i' to access the correct day's events since array indices are 0-based.
        const events = activeTrip.itinerary[i - 1]?.events;
        events?.forEach((event) => eventsToDelete.push(event));
      }

      // Apply changes when there are no events to delete.
      if (eventsToDelete.length === 0) {
        setSaving(true);
        dispatchUserTrips({ type: UT.UPDATE_TRIP, trip });
        updateTrip.mutate(
          { tripId: trip.id, data: { startDate: trip.startDate, endDate: trip.endDate } },
          {
            onSuccess(updatedTrip) {
              if (!updatedTrip) return;
              dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: { ...trip, updatedAt: updatedTrip.updatedAt } });
            },
            onError(error) {
              console.error(error);
              dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: activeTrip });
            },
            onSettled() {
              setSaving(false);
            },
          },
        );
        return;
      }

      // Apply changes when there are events to delete.
      const handleExcludedDays = () => {
        setSaving(true);
        dispatchUserTrips({ type: UT.UPDATE_TRIP, trip });
        updateTrip.mutate(
          { tripId: trip.id, data: { startDate: trip.startDate, endDate: trip.endDate } },
          {
            onSuccess(updatedTrip) {
              if (!updatedTrip) return;
              dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: { ...trip, updatedAt: updatedTrip.updatedAt } });
            },
            onError(error) {
              console.error(error);
              dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: activeTrip });
            },
            onSettled() {
              setSaving(false);
            },
          },
        );
        setModalShown(false);
      };

      // Show modal to confirm deletion of events on excluded days.
      setModalShown(true);
      setModalChildren(EventsOnExcludedDaysModal(eventsToDelete, handleExcludedDays));
    });
    picker.on("hide", () => {
      setDisplay(false);
      picker.destroy();
    });
  };

  return (
    <div className="relative h-10 select-none">
      <Icon.rangeCalendar className="absolute h-full fill-kolumblue-500" />

      <div className="absolute inset-y-0 left-0 flex w-[37px] flex-col items-center justify-between pb-[3.5px] pt-[7px] leading-none">
        <span className="text-[10px] font-semibold uppercase text-kolumblue-100">
          {new Date(activeTrip.startDate).toLocaleString("default", { month: "short" }).toUpperCase()}
        </span>
        <span>{new Date(activeTrip.startDate).getDate()}</span>
      </div>

      <div className="absolute inset-y-0 right-0 flex w-[37px] flex-col items-center justify-between pb-[3.5px] pt-[7px] leading-none">
        <span className="text-[10px] font-semibold uppercase text-kolumblue-100">
          {new Date(activeTrip.endDate).toLocaleString("default", { month: "short" }).toUpperCase()}
        </span>
        <span>{new Date(activeTrip.endDate).getDate()}</span>
      </div>

      <input
        id="datepicker"
        className="relative z-10 h-full w-[85.8px] cursor-pointer appearance-none border-none bg-transparent text-xs font-thin text-transparent outline-0"
        onClick={handlePicker}
        ref={DatePickerRef}
        readOnly
      />
    </div>
  );
}
