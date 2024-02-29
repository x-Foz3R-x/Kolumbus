"use client";

import { memo, useEffect, useRef, useState } from "react";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { generateItinerary, cn, formatDate } from "@/lib/utils";
import { UT, Trip, Day, Event } from "@/types";

import { USER_ROLE } from "@/lib/config";
import { deepCloneItinerary } from "@/lib/utils";

import { ButtonProps } from "../ui";
import { Select, SelectOption, useSelectContext } from "../ui/select";
import { ExcludedDaysModal } from "./excluded-days-modal";

// todo: decouple functionality to increase modularity (e.g. handleSelect, updateTripData, handleDeleteEvents)

export default function DaysPicker({ activeTrip, days, buttonProps }: { activeTrip: Trip; days: number; buttonProps: ButtonProps }) {
  const { dispatchUserTrips, setSaving } = useAppdata();
  const updateTrip = api.trip.update.useMutation();
  const deleteEvent = api.event.delete.useMutation();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(days - 1);

  const daysToDeleteRef = useRef<Day[]>([]);
  const eventsToDeleteRef = useRef<Event[]>([]);
  const newEndDateRef = useRef(new Date(activeTrip.endDate));

  const updateTripData = (endDate: string) => {
    const trip = { ...activeTrip };
    const events = trip.itinerary.flatMap((day) => day.events);
    const itinerary = generateItinerary(trip.startDate, endDate, events);
    const cachedItinerary = deepCloneItinerary(trip.itinerary);

    setSaving(true);
    dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: { ...trip, endDate, itinerary } });
    updateTrip.mutate(
      { tripId: trip.id, data: { endDate } },
      {
        onSuccess(updatedTrip) {
          if (!updatedTrip) return;
          dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: { ...trip, endDate, updatedAt: updatedTrip.updatedAt, itinerary } });
        },
        onError(error) {
          console.error(error);
          dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: { ...trip, itinerary: cachedItinerary } });
        },
        onSettled: () => setSaving(false),
      },
    );
  };

  const handleSelect = (selectedDays: number) => {
    if (selectedDays === days) return;

    const startDate = new Date(activeTrip.startDate);
    const endDate = new Date(activeTrip.endDate);
    newEndDateRef.current = new Date(new Date(startDate).setDate(startDate.getDate() + selectedDays - 1));

    // If the new end date is later, update the trip and exit (no conflicts).
    if (newEndDateRef.current.getTime() > endDate.getTime()) {
      updateTripData(formatDate(newEndDateRef.current));
      return;
    }

    // Get the days and events that would be deleted by the date change.
    const sliceIndex = activeTrip.itinerary.length - (days - selectedDays);
    daysToDeleteRef.current = activeTrip.itinerary.slice(sliceIndex);
    eventsToDeleteRef.current = daysToDeleteRef.current.flatMap((day) => day.events);

    // If there are no events to delete, update the trip and exit (no conflicts).
    if (eventsToDeleteRef.current.length === 0) {
      updateTripData(formatDate(newEndDateRef.current));
      return;
    }

    // Show a confirmation modal if events scheduled on days being deleted
    // Are affected by the date change, requiring user input to proceed.
    setIsOpenModal(true);
  };

  const handleDeleteEvents = () => {
    updateTripData(formatDate(newEndDateRef.current));
    setIsOpenModal(false);
    setSaving(true);

    // Delete the events scheduled on the days being deleted.
    eventsToDeleteRef.current.forEach((event) => {
      dispatchUserTrips({ type: UT.DELETE_EVENT, payload: { event, tripId: activeTrip.id } });
      deleteEvent.mutate(
        { eventId: event.id },
        {
          onError(error) {
            console.error(error);
            dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: { ...activeTrip, itinerary: deepCloneItinerary(activeTrip.itinerary) } });
          },
          onSettled: () => setSaving(false),
        },
      );
    });
  };

  // Update the selected index when the days count change
  useEffect(() => setSelectedIndex(days - 1), [days]);

  return (
    <>
      <Select
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        placement="bottom"
        offset={3}
        animation="fadeInScale"
        className="origin-top"
        rootSelector="#action-bar"
        buttonProps={buttonProps}
      >
        {[...Array(USER_ROLE.DAYS_LIMIT)].map((_, index) => (
          <DayOption key={`day-${index}`} index={index} trip={activeTrip} onClick={() => handleSelect(index + 1)} />
        ))}
      </Select>

      <ExcludedDaysModal
        open={isOpenModal}
        setOpen={setIsOpenModal}
        daysToDelete={daysToDeleteRef.current}
        onDeleteEvents={handleDeleteEvents}
      />
    </>
  );
}

const DayOption = memo(function DayOption({ index, trip, onClick: handleClick }: { index: number; trip: Trip; onClick: () => void }) {
  const { selectedIndex } = useSelectContext();

  const currentDate = new Date(new Date(trip.startDate).setDate(new Date(trip.startDate).getDate() + index));

  const day = index + 1;
  const isSelected = selectedIndex === index;

  return (
    <SelectOption onClick={handleClick} label={day.toString()} className="gap-2 pl-1 pr-4">
      <span className={cn("w-7 flex-shrink-0 text-right text-base leading-tight", isSelected && "font-semibold text-kolumblue-500")}>
        {index + 1}
      </span>

      <span className={cn("w-full text-left text-[10px]", isSelected ? "font-medium text-kolumblue-400" : "text-gray-400")}>
        {`${currentDate.getDate()} ${currentDate.toLocaleString("default", { month: "short" }).toUpperCase()}`}
      </span>
    </SelectOption>
  );
});
