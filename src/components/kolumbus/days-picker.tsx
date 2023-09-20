"use client";

import { useEffect, useState } from "react";

import useAppdata from "@/context/appdata";
import { CalculateDays, FormatDate } from "@/lib/utils";
import { UT, Event } from "@/types";

import Icon from "../icons";
import { EventsOnExcludedDaysModal } from "../ui/modal";
import { Dropdown, DropdownButton } from "@/components/ui/dropdown";

interface Props {
  maxTripsDays: number;
}

export default function DaysPicker({ maxTripsDays }: Props) {
  const { userTrips, dispatchUserTrips, selectedTrip, isLoading, setModalShown, setModalChildren } =
    useAppdata();

  const [isDisplayed, setDisplay] = useState(false);
  const [tripDays, setTripDays] = useState(1);

  useEffect(() => {
    if (isLoading || selectedTrip === -1 || !userTrips) return;

    setTripDays(userTrips[selectedTrip]?.days);
  }, [userTrips, selectedTrip, isLoading]);

  const handleDaySelect = (days: number) => {
    setDisplay(false);

    if (days === tripDays) return;

    const currentTrip = userTrips[selectedTrip];
    if (!currentTrip || !currentTrip.startDate || !currentTrip.endDate) return;

    const startDate = new Date(currentTrip.startDate);
    const endDate = new Date(currentTrip.endDate);

    const pickedEndDate = new Date(startDate);
    pickedEndDate.setDate(startDate.getDate() + days - 1);

    currentTrip.endDate = FormatDate(pickedEndDate);
    currentTrip.days = days;

    if (pickedEndDate > endDate) {
      setTripDays(days);
      dispatchUserTrips({ type: UT.REPLACE, userTrips });
      return;
    }

    const daysToDelete = CalculateDays(pickedEndDate, endDate) - 1;

    const currentItinerary = userTrips[selectedTrip]?.itinerary;
    if (currentItinerary === undefined) return;
    const numberOfDays = currentItinerary.length - 1;

    let eventsToDelete: Event[] = [];
    for (let i = numberOfDays; i > numberOfDays - daysToDelete; i--) {
      const events = currentItinerary[i]?.events;
      events?.forEach((event: Event) => {
        eventsToDelete.push(event);
      });
    }

    if (eventsToDelete.length === 0) {
      setTripDays(days);
      dispatchUserTrips({ type: UT.REPLACE, userTrips });
      return;
    }

    const handleExcludedDays = () => {
      setTripDays(days);
      dispatchUserTrips({ type: UT.REPLACE, userTrips });
      setModalShown(false);
    };

    // setModalShown(true);
    // setModalChildren(EventsOnExcludedDaysModal(eventsToDelete, handleExcludedDays));
  };

  return (
    <div className="relative h-9 w-9 select-none">
      <button onClick={() => setDisplay(true)} className="relative">
        <Icon.calendar className="h-9 fill-kolumblue-500" />

        <div className="absolute top-1 w-9 text-[10px] font-medium uppercase text-white/75">days</div>
        <div className="absolute bottom-0 m-auto w-9 text-sm font-medium">{!isLoading && tripDays}</div>
      </button>

      <Dropdown
        isModalOpen={isDisplayed}
        setIsModalOpen={setDisplay}
        className="relative max-h-56 w-9 gap-1 rounded-sm"
      >
        <div className="flex snap-y snap-mandatory flex-col overflow-y-scroll rounded-sm bg-kolumblue-50">
          {!isLoading &&
            [...Array(maxTripsDays)].map((el, index) => (
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
