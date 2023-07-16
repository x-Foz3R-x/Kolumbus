/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";

import useAppData from "@/context/app-data";
import useUserTrips from "@/hooks/use-user-trips";
import { calculateDays, formatDate } from "@/lib/utils";
import UT from "@/config/actions";
import { Event, Events } from "@/types";

import Icon from "../icons";
import { EventsOnExcludedDaysModal } from "../ui/modal";
import { Dropdown, DropdownButton } from "@/components/ui/dropdown";

interface Props {
  maxTripsDays: number;
}

export default function DaysPicker({ maxTripsDays }: Props) {
  const { selectedTrip, setModalShown, setModalChildren } = useAppData();
  const { userTrips, dispatchUserTrips, loadingTrips } = useUserTrips();

  const [tripDays, setTripDays] = useState(userTrips[selectedTrip]?.days || 1);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!loadingTrips) setTripDays(userTrips[selectedTrip]?.days || 1);
  }, [userTrips[selectedTrip]?.days, selectedTrip]);

  const handleDaySelect = (day: number) => {
    setDropdownOpen(false);
    if (day === tripDays) return;

    const activeTrip = userTrips[selectedTrip];
    if (!activeTrip || !activeTrip.start_date || !activeTrip.end_date) return;

    const startDate = new Date(activeTrip.start_date);
    const endDate = new Date(activeTrip.end_date);
    const newEndDate = new Date(startDate);
    newEndDate.setDate(startDate.getDate() + day - 1);

    if (newEndDate > endDate) {
      setTripDays(day);
      dispatchUserTrips({
        type: UT.UPDATE_FIELDS,
        payload: {
          regenerate: true,
          selectedTrip: selectedTrip,
          fields: ["start_date", "end_date", "days"],
          values: [startDate, formatDate(newEndDate), day],
        },
      });
      return;
    }

    const daysToDelete = calculateDays(newEndDate, endDate) - 1;
    const numberOfDays = activeTrip.itinerary.length - 1;

    let eventsToDelete: Events = [];
    for (let i = numberOfDays; i > numberOfDays - daysToDelete; i--) {
      const events = activeTrip.itinerary[i]?.events;
      events?.forEach((event: Event) => {
        eventsToDelete.push(event);
      });
    }

    if (eventsToDelete.length === 0) {
      setTripDays(day);
      dispatchUserTrips({
        type: UT.UPDATE_FIELDS,
        payload: {
          regenerate: true,
          selectedTrip: selectedTrip,
          fields: ["start_date", "end_date", "days"],
          values: [startDate, formatDate(newEndDate), day],
        },
      });
      return;
    }

    const handleExcludedDays = () => {
      setTripDays(day);
      dispatchUserTrips({
        type: UT.UPDATE_FIELDS,
        payload: {
          regenerate: true,
          selectedTrip: selectedTrip,
          fields: ["start_date", "end_date", "days"],
          values: [startDate, formatDate(newEndDate), day],
        },
      });
      setModalShown(false);
    };

    setModalShown(true);
    setModalChildren(
      EventsOnExcludedDaysModal(eventsToDelete, handleExcludedDays)
    );
  };

  return (
    <div className="relative h-9 w-9 select-none">
      <button onClick={() => setDropdownOpen(true)} className="relative">
        <Icon.calendar className="h-9 fill-kolumblue-500" />

        <div className="absolute top-1 w-9 text-[10px] font-medium uppercase text-white/75">
          days
        </div>

        <div className="absolute bottom-0 m-auto w-9 text-sm font-medium">
          {!loadingTrips && tripDays}
        </div>
      </button>

      <Dropdown
        isModalOpen={isDropdownOpen}
        setIsModalOpen={setDropdownOpen}
        className="relative max-h-56 w-9 gap-1 rounded-sm"
      >
        <div className="flex snap-y snap-mandatory flex-col overflow-y-scroll rounded-sm bg-kolumblue-50">
          {!loadingTrips &&
            [...Array(maxTripsDays)].map((el, index) => (
              <div key={"day " + (index + 1)}>
                <DropdownButton
                  onClick={() => handleDaySelect(index + 1)}
                  className="h-6 w-full snap-start justify-center rounded-none text-xs hover:rounded-none"
                >
                  {index + 1}
                </DropdownButton>
                <div className="border-b border-kolumbGray-200"></div>
              </div>
            ))}
        </div>
      </Dropdown>
    </div>
  );
}
