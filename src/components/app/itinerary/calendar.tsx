import { Trip } from "@/types";

import CalendarHeader from "./calendar-header";
import DayOfWeekIndicator from "./day-of-week-indicator";

interface Props {
  trip: Trip;
  index: number;
}

export default function Calendar({ trip, index, ...props }: Props) {
  const date = new Date(trip["start_date"]);
  date.setDate(date.getDate() + index);

  return (
    <div className="flex-none">
      <CalendarHeader tripDay={index + 1} {...props} />

      <div className="flex h-fit w-32 flex-col items-center gap-1 bg-white/70 p-2 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
        <div className="flex h-fit w-14 items-center justify-center text-5xl font-bold leading-9 text-kolumblue-500">
          {date.getDate()}
        </div>

        <div className="mt-1 text-sm text-kolumbGray-700">
          {date.toLocaleString("default", { month: "short" }) +
            " • " +
            date.getFullYear()}
        </div>

        <DayOfWeekIndicator dayOfWeek={date.getDay()} />
      </div>
    </div>
  );
}
