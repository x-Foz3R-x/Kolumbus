"use client";

import { useState } from "react";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { useActionBarContext } from "../itinerary/action-bar";
import { CalculateDays, GenerateItinerary, cn } from "@/lib/utils";
import { UT, Event } from "@/types";

import Icon from "../icons";
import { Button } from "./button";
import { Dropdown, DropdownOption } from "./dropdown";
import { EventsOnExcludedDaysModal } from "./modalOld";

export default function DaysPicker({ maxTripsDays }: { maxTripsDays: number }) {
  const { dispatchUserTrips, setSaving, setModalShown, setModalChildren } = useAppdata();
  const { activeTrip } = useActionBarContext();

  const updateTrip = api.trip.update.useMutation();

  const [isOpen, setOpen] = useState(false);

  const handleDaySelect = (selectedDays: number) => {
    setOpen(false);
    const days = CalculateDays(activeTrip.startDate, activeTrip.endDate);

    if (selectedDays === days) return;

    const trip = { ...activeTrip };
    const events = trip.itinerary.flatMap((day) => day.events) ?? [];

    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const newEndDate = new Date(startDate);
    newEndDate.setDate(startDate.getDate() + selectedDays - 1);

    trip.endDate = newEndDate.toISOString();
    trip.itinerary = GenerateItinerary(trip.id, trip.startDate, trip.endDate, events);

    // Apply changes when there are no conflicting dates.
    if (newEndDate > endDate) {
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

    const eventsToDelete: Event[] = [];
    const daysToDelete = CalculateDays(newEndDate, endDate) - 1;

    // Collect events from end of the itinerary that are about to be deleted.
    for (let i = activeTrip.itinerary.length; i > activeTrip.itinerary.length - daysToDelete; i--) {
      // Subtract 1 from 'i' to access the correct day's events since array indices are 0-based.
      const events = activeTrip.itinerary[i - 1]?.events;
      events?.forEach((event) => eventsToDelete.push(event));
    }

    // Apply changes when there are no events to delete.
    if (eventsToDelete.length === 0) {
      setSaving(true);
      dispatchUserTrips({ type: UT.UPDATE_TRIP, trip });
      updateTrip.mutate(
        { tripId: trip.id, data: { endDate: trip.endDate } },
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
        { tripId: trip.id, data: { endDate: trip.endDate } },
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
    // setModalShown(true);
    // setModalChildren(EventsOnExcludedDaysModal(eventsToDelete, handleExcludedDays));
  };

  return (
    <Dropdown
      isOpen={isOpen}
      setOpen={setOpen}
      listLength={maxTripsDays}
      placement="bottom-start"
      container={{ selector: "main > section" }}
      preventFlip
      className="relative max-h-80 w-24 overflow-x-hidden overflow-y-scroll"
      offset={{ mainAxis: 5, crossAxis: -10 }}
      buttonProps={{
        variant: "unstyled",
        size: "unstyled",
        className: "relative h-10",
        children: (
          <>
            <Icon.calendar className="h-full fill-kolumblue-500" />

            <div className="absolute inset-0 flex flex-col items-center justify-between pb-[3.5px] pt-[7px] leading-none">
              <span className="text-[10px] font-semibold uppercase text-kolumblue-100">days</span>

              <span>{CalculateDays(activeTrip.startDate, activeTrip.endDate)}</span>
            </div>
          </>
        ),
      }}
    >
      {[...Array(maxTripsDays)].map((_, index) => {
        const currentDate = new Date(new Date(activeTrip.startDate).setDate(new Date(activeTrip.startDate).getDate() + index));
        const isCurrentDate = index + 1 === CalculateDays(activeTrip.startDate, activeTrip.endDate);

        return (
          <DropdownOption
            key={`day-${index + 1}`}
            index={index}
            onClick={() => handleDaySelect(index + 1)}
            className="block gap-1 px-1.5"
            wrapperClassName={cn("hover:z-20", isCurrentDate && "before:bg-kolumblue-100")}
          >
            <div className={isCurrentDate ? "rounded-full bg-kolumblue-100" : ""}>
              <span className="mr-1 inline-block w-6 text-right text-base leading-tight">{index + 1}</span>

              <span className={cn("w-full text-[10px]", isCurrentDate ? "text-gray-500" : "text-gray-400")}>
                {`${currentDate.getDate()} ${currentDate.toLocaleString("default", { month: "short" }).toUpperCase()}`}
              </span>
            </div>
          </DropdownOption>
        );
      })}

      {/* <div className="pointer-events-none fixed inset-x-3.5 bottom-0 z-10 h-10 bg-gradient-to-t from-white" /> */}
    </Dropdown>
  );
}
