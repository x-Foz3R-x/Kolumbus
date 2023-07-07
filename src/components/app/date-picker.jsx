/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import {
  easepick,
  AmpPlugin,
  RangePlugin,
  LockPlugin,
  DateTime,
} from "@easepick/bundle";
import useUserTrips from "@/hooks/use-user-trips";
import { calculateDays } from "@/lib/utils";
import { UT } from "@/config/actions";
import Icon from "../icons";

export default function DatePicker() {
  const { userTrips, dispatchUserTrips, loadingTrips, selectedTrip } =
    useUserTrips();

  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState({
    start: new DateTime(),
    end: new DateTime(),
  });

  useEffect(() => {
    if (!loadingTrips) {
      setDate({
        start: new Date(userTrips[selectedTrip]?.start_date),
        end: new Date(userTrips[selectedTrip]?.end_date),
      });
    }
  }, [
    userTrips[selectedTrip]?.start_date,
    userTrips[selectedTrip]?.end_date,
    selectedTrip,
    loadingTrips,
  ]);

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
        startDate: date.start,
        endDate: date.end,
      },
      LockPlugin: {
        // maxDays: 90,
      },
      plugins: [AmpPlugin, RangePlugin, LockPlugin],
    });

    picker.show();
    picker.on("select", async () => {
      setDate({
        start: picker.getStartDate(),
        end: picker.getEndDate(),
      });

      dispatchUserTrips({
        type: UT.UPDATE_FIELDS,
        payload: {
          regenerate: true,
          selectedTrip: selectedTrip,
          fields: ["start_date", "end_date", "days"],
          values: [
            picker.getStartDate().format("YYYY-MM-DD"),
            picker.getEndDate().format("YYYY-MM-DD"),
            calculateDays(picker.getStartDate(), picker.getEndDate()),
          ],
        },
      });
    });
    picker.on("hide", () => {
      setIsOpen(false);
      picker.destroy();
    });
  };

  return (
    <div className="relative select-none">
      <Icon.rangeCalendar className="absolute h-9 fill-kolumblue-500" />

      {!loadingTrips && (
        <>
          <section className="absolute h-9 w-[5.0625rem] text-center text-[10px] font-medium text-white/75">
            <div className="absolute left-[-0.125rem] top-1 w-10">
              {date.start
                .toLocaleString("default", { month: "short" })
                .toUpperCase()}
            </div>
            <div className="absolute right-[-0.125rem] top-1 w-10">
              {date.end
                .toLocaleString("default", { month: "short" })
                .toUpperCase()}
            </div>
          </section>
          <section className="absolute h-9 w-[5.0625rem] text-center text-sm font-medium">
            <div className="absolute bottom-0 left-[-0.125rem] w-10">
              {date.start.getDate()}
            </div>
            <div className="absolute bottom-0 right-[-0.125rem] w-10">
              {date.end.getDate()}
            </div>
          </section>
        </>
      )}

      <input
        className="relative z-10 h-9 w-[5.0625rem] cursor-pointer appearance-none border-none bg-transparent text-xs font-thin text-transparent outline-0"
        onClick={handlePicker}
        ref={DatePickerRef}
        readOnly
      />
    </div>
  );
}
