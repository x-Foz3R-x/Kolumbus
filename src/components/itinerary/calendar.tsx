import Icon from "@/components/icons";
import { useDndData } from "@/components/dnd-itinerary";
import DayOfWeekIndicator from "./day-of-week-indicator";

interface CalendarProps {
  dayPosition: number;
  dragOverlay?: boolean;
  handleAddEvent: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}
export function Calendar({ dayPosition, dragOverlay, handleAddEvent, ...props }: CalendarProps) {
  const { activeTrip } = useDndData();
  const date = new Date(activeTrip.startDate);
  date.setDate(date.getDate() + dayPosition);

  return (
    <div className="sticky left-0 z-20 flex-none">
      <CalendarHeader dayPosition={dayPosition} dragOverlay={dragOverlay} handleAddEvent={handleAddEvent} {...props} />

      <div className="flex h-28 w-32 cursor-default flex-col items-center justify-between gap-1 bg-white/80 p-2 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
        <p className="flex h-fit w-14 items-center justify-center text-5xl font-bold leading-10 text-kolumblue-500">{date.getDate()}</p>

        <p className="text-sm text-gray-600">{date.toLocaleString("default", { month: "short" }) + " • " + date.getFullYear()}</p>

        <DayOfWeekIndicator dayOfWeek={date.getDay()} />
      </div>
    </div>
  );
}

interface CalendarHeaderProps {
  dayPosition: number;
  dragOverlay?: boolean;
  handleAddEvent: React.MouseEventHandler<HTMLButtonElement>;
}
function CalendarHeader({ dayPosition, dragOverlay, handleAddEvent, ...props }: CalendarHeaderProps) {
  return (
    <div className="relative z-30 flex h-5 w-32 cursor-default items-center justify-center bg-kolumblue-500 text-xs font-medium text-white/75 shadow-xl group-first/calendar:rounded-t-xl">
      <button
        className={`group/move absolute left-0 flex h-5 w-7 cursor-grab items-center opacity-0 duration-300 ease-kolumb-leave group-hover/calendar:opacity-100 group-hover/calendar:ease-kolumb-flow ${
          dragOverlay && "opacity-100 group-hover/calendar:opacity-100"
        }`}
        {...props}
      >
        <Icon.gripLines className="absolute left-1 w-5 scale-x-100 fill-white/75 p-1 duration-500 ease-kolumb-leave" />
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
        className="group/add absolute right-0 flex h-5 w-6 items-center opacity-0 duration-300 ease-kolumb-leave group-hover/calendar:opacity-100 group-hover/calendar:ease-kolumb-flow"
      >
        <Icon.plus className="absolute right-2 h-2.5 w-2.5 fill-white/75 duration-500 ease-kolumb-flow" />
        <p
          className={`absolute right-0 top-[2px] h-4 w-20 origin-right scale-x-0 select-none capitalize opacity-0 duration-200 ease-kolumb-flow group-hover/add:right-6 group-hover/add:scale-x-100 ${
            !dragOverlay && "group-hover/add:opacity-100"
          }`}
        >
          add event
        </p>
      </button>

      <div className={`origin-center capitalize duration-200 ease-kolumb-flow ${!dragOverlay && "peer-hover:scale-0"}`}>
        {!dragOverlay ? `day ${dayPosition + 1}` : "moving"}
      </div>
    </div>
  );
}

interface CalendarEndProps {
  totalDays: number;
}
export function CalendarEnd({ totalDays }: CalendarEndProps) {
  return (
    <div className="sticky left-0 z-20 mb-4 flex h-5 w-32 cursor-default items-center justify-center rounded-b-xl bg-kolumblue-500 text-xs font-medium text-white/75 shadow-xl">
      {totalDays} days in total
    </div>
  );
}
