import React from "react";

import CalendarHeader from "./CalendarHeader";
import DayOfWeekIndicator from "./DayOfWeekIndicator";

interface Props {
  tripDay: number;
  calendarYear?: number;
  month?: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
}

export default function Calendar({
  tripDay,
  calendarYear = 2023,
  month = "JUN",
  dayOfMonth = 22,
  dayOfWeek = 5,
}: Props) {
  return (
    <div className="group/calendar flex-none">
      <CalendarHeader tripDay={tripDay} />

      <div className="flex h-fit w-32 flex-col items-center gap-1 bg-white/70 p-2 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
        <div className="flex h-fit w-14 items-center justify-center text-5xl font-bold leading-9 text-kolumblue-500">
          {dayOfMonth}
        </div>

        <div className="mt-1 text-sm uppercase text-kolumbGray-900/75">
          {month + " • " + calendarYear}
        </div>

        <DayOfWeekIndicator dayOfWeek={dayOfWeek} />
      </div>
    </div>
  );
}
