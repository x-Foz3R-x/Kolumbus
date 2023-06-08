import CalendarHeader from "./CalendarHeader";
import DayOfWeekIndicator from "./DayOfWeekIndicator";

interface Props {
  tripDay: number;
  date: Date;
}

export default function Calendar({ tripDay, date }: Props) {
  return (
    <div className="group/calendar flex-none">
      <CalendarHeader tripDay={tripDay} />

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
