/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";

import useUserTrips from "@/hooks/api/use-user-trips";
import useSelectedTrip from "@/hooks/use-selected-trip";
import { ACTION } from "@/hooks/use-actions";

import Modal from "@/components/ui/modal/Modal";
import ModalButton from "@/components/ui/modal/ModalButton";

import DaysSVG from "@/assets/svg/Days.svg";

interface Props {
  maxTripsDays: number;
}

export default function DaysPicker({ maxTripsDays }: Props) {
  const { userTrips, dispatchUserTrips, loadingTrips } = useUserTrips();
  const [selectedTrip] = useSelectedTrip();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripDay, setTripDay] = useState(1);

  useEffect(() => {
    if (!loadingTrips) setTripDay(userTrips[selectedTrip]["days"]);
  }, [loadingTrips, userTrips[selectedTrip]["days"]]);

  useEffect(() => {
    dispatchUserTrips({
      type: ACTION.UPDATE,
      trip: selectedTrip,
      field: "days",
      payload: tripDay,
    });
  }, [tripDay]);

  const renderDays = () => {
    let daySelect = [];

    const handleDaySelect = (i: number) => {
      setTripDay(i);
      setIsModalOpen(false);
    };

    for (let i = 1; i <= maxTripsDays; i++) {
      daySelect.push(
        <div key={"day " + i}>
          <ModalButton
            onClick={() => handleDaySelect(i)}
            className="h-6 w-full snap-start justify-center rounded-none text-xs hover:rounded-none"
          >
            {i}
          </ModalButton>
          <div className="border-b border-kolumbGray-200"></div>
        </div>
      );
    }
    return (
      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        className="relative max-h-56 w-9 gap-1 rounded-sm"
      >
        <div className="flex snap-y snap-mandatory flex-col overflow-y-scroll rounded-sm bg-kolumblue-50">
          {daySelect}
        </div>
      </Modal>
    );
  };

  return loadingTrips ? (
    <div></div>
  ) : (
    <div className="relative h-9 w-9 select-none">
      <button onClick={() => setIsModalOpen(true)} className="relative">
        <DaysSVG className="h-9 fill-kolumblue-500" />

        <div className="absolute top-1 w-9 text-[10px] font-medium uppercase text-white/75">
          days
        </div>

        <div className="absolute bottom-0 m-auto w-9 text-sm font-medium">
          {tripDay}
        </div>
      </button>
      {renderDays()}
    </div>
  );
}
