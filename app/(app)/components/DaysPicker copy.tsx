"use client";

import React, { useState, useRef, useLayoutEffect } from "react";

import Modal from "@/components/ui/modal/Modal";
import ModalButton from "@/components/ui/modal/ModalButton";

import DaysSVG from "@/assets/svg/Days.svg";

interface Props {
  maxTripsDays: number;
}

export default function DaysPicker({ maxTripsDays }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripDays, setTripDays] = useState(1);
  console.log(tripDays);

  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const handleScroll = () => {
      console.log(ref.current?.scrollTop);
      // ref.current?.scrollTo(30);
    };

    ref.current.addEventListener("scroll", handleScroll);

    return () => {
      ref.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const renderDays = () => {
    let days = [];

    for (let i = 1; i <= maxTripsDays; i++) {
      days.push(
        <ModalButton
          key={"trip day " + i}
          onClick={() => setTripDays(i)}
          className="h-4 w-full snap-start justify-center rounded-none bg-transparent text-sm font-medium hover:bg-opacity-0"
        >
          {i}
        </ModalButton>
      );
    }
    return (
      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        className="relative -top-[1.625rem] left-0 h-20 w-9 rounded-sm border-2 border-kolumblue-500 bg-opacity-0 shadow-none"
      >
        <div
          ref={ref}
          className="flex snap-y snap-mandatory snap-always flex-col overflow-y-scroll rounded-none bg-transparent last:pb-8"
        >
          {days}
        </div>
      </Modal>
    );
  };

  return (
    <div className="relative h-9 w-9 select-none">
      <button onClick={() => setIsModalOpen(true)} className="relative">
        <DaysSVG className="h-9 fill-kolumblue-500" />

        <div className="absolute top-1 w-9 text-[10px] font-semibold uppercase text-kolumblue-200">
          days
        </div>

        <div
          className={
            "absolute bottom-0 m-auto w-9 text-sm font-medium " +
            (isModalOpen ? "text-transparent" : "")
          }
        >
          {tripDays}
        </div>
      </button>
      {renderDays()}
    </div>
  );
}
