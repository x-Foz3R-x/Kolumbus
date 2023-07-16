import UT from "@/config/actions";

import Icon from "@/components/icons";
import { useDndData } from "@/components/dnd-itinerary";
import DayOfWeekIndicator from "./day-of-week-indicator";

interface CalendarProps {
  dayIndex: number;
  dragOverlay?: boolean;
  className?: string;
}

export function Calendar({ dayIndex, dragOverlay, ...props }: CalendarProps) {
  const { activeTrip } = useDndData();
  const date = new Date(activeTrip.start_date);
  date.setDate(date.getDate() + dayIndex);

  return (
    <div className="sticky left-0 z-20 flex-none">
      <CalendarHeader
        dayIndex={dayIndex}
        dragOverlay={dragOverlay}
        {...props}
      />

      <div className="flex h-fit w-32 cursor-default flex-col items-center gap-1 bg-white/80 p-2 shadow-container backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
        <p className="flex h-fit w-14 items-center justify-center text-5xl font-bold leading-9 text-kolumblue-500">
          {date.getDate()}
        </p>

        <p className="mt-1 text-sm text-kolumbGray-600">
          {date.toLocaleString("default", { month: "short" }) +
            " • " +
            date.getFullYear()}
        </p>

        <DayOfWeekIndicator dayOfWeek={date.getDay()} />
      </div>
    </div>
  );
}

interface CalendarHeaderProps {
  dayIndex: number;
  dragOverlay?: boolean;
}

function CalendarHeader({
  dayIndex,
  dragOverlay,
  ...props
}: CalendarHeaderProps) {
  const { dispatchUserTrips, selectedTrip } = useDndData();

  const handleAddEvent = () => {
    dispatchUserTrips({
      type: UT.INSERT_EVENT,
      payload: {
        selectedTrip,
        dayIndex,
        placeAt: "start",
      },
    });
  };

  return (
    <header className="relative z-30 flex h-5 w-32 cursor-default items-center justify-center bg-kolumblue-500 text-xs font-medium text-white/75 shadow-container group-first/calendar:rounded-t-xl">
      <button
        className="group/move peer absolute left-0 h-5 w-7 cursor-grab"
        {...props}
      >
        <Icon.gripLines
          className={`absolute left-1 top-1 w-5 rounded fill-white/75 p-1 duration-500 ease-kolumb-flow ${
            dragOverlay
              ? "scale-x-100 opacity-100"
              : "scale-x-50 opacity-0 group-hover/day:scale-x-100 group-hover/day:opacity-100"
          }`}
        />
        <p
          className={`
            absolute left-0 top-[2px] h-4 w-20 origin-left scale-x-0 select-none capitalize opacity-0 duration-200 ease-kolumb-flow group-hover/move:left-6 group-hover/move:scale-x-100 ${
              !dragOverlay && "group-hover/move:opacity-100"
            }`}
        >
          move
        </p>
      </button>

      <button
        onClick={handleAddEvent}
        className="group/add peer absolute right-0 h-5 w-6"
      >
        <Icon.plus className="absolute right-2 top-[5px] h-[0.625rem] w-[0.625rem] fill-white/75" />
        <p
          className={`absolute right-0 top-[2px] h-4 w-20 origin-right scale-x-0 select-none capitalize opacity-0 duration-200 ease-kolumb-flow group-hover/add:right-6 group-hover/add:scale-x-100 ${
            !dragOverlay && "group-hover/add:opacity-100"
          }`}
        >
          add event
        </p>
      </button>

      <div
        className={`origin-center capitalize duration-200 ease-kolumb-flow ${
          !dragOverlay && "peer-hover:scale-0"
        }`}
      >
        {!dragOverlay ? `day ${dayIndex + 1}` : "moving"}
      </div>
    </header>
  );
}

interface CalendarEndProps {
  totalDays: number;
}

export function CalendarEnd({ totalDays }: CalendarEndProps) {
  return (
    <div className="sticky left-0 z-20 mb-4 flex h-5 w-32 cursor-default items-center justify-center rounded-b-xl bg-kolumblue-500 text-xs font-medium text-white/75 shadow-container">
      Total {totalDays} days
    </div>
  );
}
