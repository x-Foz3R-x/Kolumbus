"use client";

import { useState } from "react";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { useActionBarContext } from "../itinerary/action-bar";
import { CalculateDays, GenerateItinerary } from "@/lib/utils";
import { UT, Event } from "@/types";

import Icon from "../icons";
import { EventsOnExcludedDaysModal } from "./modal";
import { Dropdown, DropdownButton } from "@/components/ui/dropdown";

interface Props {
  maxTripsDays: number;
}

export default function DaysPicker({ maxTripsDays }: Props) {
  const updateTrip = api.trip.update.useMutation();
  const { dispatchUserTrips, setModalShown, setModalChildren } = useAppdata();
  const { activeTrip } = useActionBarContext();

  const [isDisplayed, setDisplay] = useState(false);

  const handleDaySelect = (selectedDays: number) => {
    setDisplay(false);
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
      dispatchUserTrips({ type: UT.UPDATE_TRIP, payload: { trip } });
      updateTrip.mutate({ tripId: trip.id, data: { endDate: trip.endDate } });
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
      dispatchUserTrips({ type: UT.UPDATE_TRIP, payload: { trip } });
      updateTrip.mutate({ tripId: trip.id, data: { endDate: trip.endDate } });
      return;
    }

    // Apply changes when there are events to delete.
    const handleExcludedDays = () => {
      dispatchUserTrips({ type: UT.UPDATE_TRIP, payload: { trip } });
      updateTrip.mutate({ tripId: trip.id, data: { endDate: trip.endDate } });
      setModalShown(false);
    };

    // Show modal to confirm deletion of events on excluded days.
    // setModalShown(true);
    // setModalChildren(EventsOnExcludedDaysModal(eventsToDelete, handleExcludedDays));
  };

  return (
    <div className="relative h-9 w-9 select-none">
      <button onClick={() => setDisplay(true)} className="relative">
        <Icon.calendar className="h-9 fill-kolumblue-500" />

        <div className="absolute top-1 w-9 text-[10px] font-medium uppercase text-white/75">days</div>
        <div className="absolute bottom-0 m-auto w-9 text-sm font-medium">{CalculateDays(activeTrip.startDate, activeTrip.endDate)}</div>
      </button>

      <Dropdown isModalOpen={isDisplayed} setIsModalOpen={setDisplay} className="relative max-h-56 w-9 gap-1 rounded-sm">
        <div className="flex snap-y snap-mandatory flex-col overflow-y-scroll rounded-sm bg-kolumblue-50">
          {[...Array(maxTripsDays)].map((el, index) => (
            <div key={`day-${index + 1}`}>
              <DropdownButton
                onClick={() => handleDaySelect(index + 1)}
                className="h-6 w-full snap-start justify-center rounded-none text-xs hover:rounded-none"
              >
                {index + 1}
              </DropdownButton>
              <div className="border-b border-gray-200"></div>
            </div>
          ))}
        </div>
      </Dropdown>
    </div>
  );
}
