/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import useUserTrips from "@/hooks/use-user-trips";
import { UT } from "@/config/actions";
import { calculateDays, formatDate } from "@/lib/utils";

import Icon from "../icons";
import { Dropdown, DropdownButton } from "@/components/ui/Dropdown";
import {
  Modal,
  ModalBody,
  ModalButtons,
  ModalGridList,
  ModalText,
  ModalTitle,
} from "../ui/Modal";
import { Event, Events } from "@/types";

interface Props {
  maxTripsDays: number;
}

export default function DaysPicker({ maxTripsDays }: Props) {
  const { userTrips, dispatchUserTrips, loadingTrips, selectedTrip } =
    useUserTrips();

  const [tripDays, setTripDays] = useState(userTrips[selectedTrip]?.days || 1);
  const [selectedTripDays, setSelectedTripDays] = useState(tripDays);
  const [selectedEvents, setSelectedEvents] = useState<Events>([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loadingTrips) setTripDays(userTrips[selectedTrip]?.days || 1);
  }, [userTrips[selectedTrip]?.days, selectedTrip]);

  const handleDaySelect = (day: number) => {
    setSelectedTripDays(day);
    setShowDropdown(false);

    const startDate = new Date(userTrips[selectedTrip]?.start_date);
    const endDate = new Date(userTrips[selectedTrip]?.end_date);

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
          values: [
            userTrips[selectedTrip]?.start_date,
            formatDate(newEndDate),
            day,
          ],
        },
      });
      return;
    }

    const daysToDelete = calculateDays(newEndDate, endDate) - 1;
    const numberOfDays = userTrips[selectedTrip].itinerary.length - 1;

    let eventsToDelete: Events = [];
    for (let i = numberOfDays; i > numberOfDays - daysToDelete; i--) {
      const events = userTrips[selectedTrip].itinerary[i]?.events;
      events.forEach((event: Event) => {
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
          values: [
            userTrips[selectedTrip]?.start_date,
            formatDate(newEndDate),
            day,
          ],
        },
      });
      return;
    }

    setSelectedEvents(eventsToDelete);
    setShowModal(true);
  };

  const handleDayReduce = () => {
    setTripDays(selectedTripDays);

    const startDate = new Date(userTrips[selectedTrip]?.start_date);
    const newEndDate = new Date(startDate);
    newEndDate.setDate(startDate.getDate() + selectedTripDays - 1);

    dispatchUserTrips({
      type: UT.UPDATE_FIELDS,
      payload: {
        regenerate: true,
        selectedTrip: selectedTrip,
        fields: ["start_date", "end_date", "days"],
        values: [
          userTrips[selectedTrip]?.start_date,
          formatDate(newEndDate),
          selectedTripDays,
        ],
      },
    });

    setShowModal(false);
  };

  return (
    <div className="relative h-9 w-9 select-none">
      <button onClick={() => setShowDropdown(true)} className="relative">
        <Icon.calendar className="h-9 fill-kolumblue-500" />

        <div className="absolute top-1 w-9 text-[10px] font-medium uppercase text-white/75">
          days
        </div>

        <div className="absolute bottom-0 m-auto w-9 text-sm font-medium">
          {!loadingTrips && tripDays}
        </div>
      </button>

      <Dropdown
        isModalOpen={showDropdown}
        setIsModalOpen={setShowDropdown}
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

      {createPortal(
        <Modal showModal={showModal}>
          <ModalBody type="exclamation">
            <ModalTitle>Events Scheduled on Reduced Day</ModalTitle>
            <ModalText>
              The following event(s) are scheduled on the day you are about to
              remove:
            </ModalText>

            <ModalGridList
              list={selectedEvents}
              sortBy="date"
              printField="name"
            />

            <ModalText>
              Are you sure you want to proceed and permanently delete the
              mentioned event(s)?
            </ModalText>
          </ModalBody>
          <ModalButtons
            cancel={true}
            actionButton={true}
            actionButtonText="delete events"
            actionButtonOnClick={handleDayReduce}
            setShowModal={setShowModal}
          />
        </Modal>,
        document.body
      )}
    </div>
  );
}
