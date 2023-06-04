"use client";

import React, { useState, useEffect, useRef, useReducer } from "react";
import {
  easepick,
  AmpPlugin,
  RangePlugin,
  LockPlugin,
  DateTime,
} from "@easepick/bundle";

import DateSVG from "@/assets/svg/Date.svg";

export default function DatePicker() {
  const [startDate, setStartDate] = useState(new DateTime());
  const [endDate, setEndDate] = useState(new DateTime());
  const [isOpen, setIsOpen] = useState(false);

  const DatePickerRef = useRef();

  const handlePicker = () => {
    if (isOpen) return;
    if (!isOpen) setIsOpen(true);

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
          maxYear: 2030,
        },
      },
      RangePlugin: {
        startDate: startDate,
        endDate: endDate,
      },
      LockPlugin: {
        // maxDays: 90,
      },
      plugins: [AmpPlugin, RangePlugin, LockPlugin],
    });

    picker.show();
    picker.on("select", async () => {
      setStartDate(picker.getStartDate());
      setEndDate(picker.getEndDate());
    });
    picker.on("hide", () => {
      setIsOpen(false);
      picker.destroy();
    });
  };

  return (
    <div className="relative select-none">
      <DateSVG className="absolute h-9 fill-kolumblue-500" />

      <section className="absolute h-9 w-[5.0625rem] text-center text-[10px] font-medium text-white/75">
        <div className="absolute left-[-0.125rem] top-1 w-10">
          {startDate
            .toLocaleString("default", { month: "short" })
            .toUpperCase()}
        </div>
        <div className="absolute right-[-0.125rem] top-1 w-10">
          {endDate.toLocaleString("default", { month: "short" }).toUpperCase()}
        </div>
      </section>

      <section className="absolute h-9 w-[5.0625rem] text-center text-sm font-medium">
        <div className="absolute bottom-0 left-[-0.125rem] w-10">
          {startDate.getDate()}
        </div>
        <div className="absolute bottom-0 right-[-0.125rem] w-10">
          {endDate.getDate()}
        </div>
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
