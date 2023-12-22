import Icon from "@/components/icons";
import { useDndData } from "@/components/dnd-itinerary";
import DayOfWeekIndicator from "./day-of-week-indicator";
import { cn } from "@/lib/utils";

interface CalendarProps {
  index: number;
  dragging?: boolean;
  handleAddEvent: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}
export function Calendar({ index, dragging, handleAddEvent, ...props }: CalendarProps) {
  const { activeTrip } = useDndData();
  const date = new Date(activeTrip.startDate);
  date.setDate(date.getDate() + index);

  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <div className="sticky left-0 z-20 flex-none">
      <CalendarHeader index={index} dragging={dragging} handleAddEvent={handleAddEvent} {...props} />

      <div className="flex h-28 w-32 cursor-default flex-col items-center justify-between bg-white/80 p-2 text-sm font-medium shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
        <p className={cn("leading-none text-gray-500", isToday && "text-red-400")}>
          {date.toLocaleString("default", { month: "short" })} {date.getFullYear()}
        </p>

        <p
          className={cn(
            "relative flex h-fit items-center justify-center text-center text-5xl font-normal leading-10 text-gray-600",
            isToday && "text-red-500",
          )}
        >
          {date.getDate()}
        </p>

        <DayOfWeekIndicator dayOfWeek={date.getDay()} />
      </div>
    </div>
  );
}

interface CalendarHeaderProps {
  index: number;
  dragging?: boolean;
  handleAddEvent: React.MouseEventHandler<HTMLButtonElement>;
}
function CalendarHeader({ index, dragging, handleAddEvent, ...props }: CalendarHeaderProps) {
  return (
    <div className="relative z-30 flex h-5 w-32 cursor-default items-center justify-center bg-kolumblue-500 text-xs font-medium text-kolumblue-200 shadow-xl group-first/calendar:rounded-t-xl">
      <button
        className={`group/move absolute left-0 flex h-5 w-7 cursor-grab items-center opacity-0 duration-300 ease-kolumb-leave group-hover/calendar:opacity-100 group-hover/calendar:ease-kolumb-flow ${
          dragging && "opacity-100 group-hover/calendar:opacity-100"
        }`}
        {...props}
      >
        <Icon.gripLines className="absolute left-1 w-5 scale-x-100 fill-kolumblue-200 p-1 duration-500 ease-kolumb-leave" />
        <p
          className={`
            absolute left-0 top-[2px] h-4 w-20 origin-left scale-x-0 select-none capitalize opacity-0 duration-200 ease-kolumb-flow group-hover/move:left-6 group-hover/move:scale-x-100 ${
              !dragging && "group-hover/move:opacity-100"
            }`}
        >
          move
        </p>
      </button>

      <button
        onClick={handleAddEvent}
        className="group/add absolute right-0 flex h-5 w-6 items-center opacity-0 duration-300 ease-kolumb-leave group-hover/calendar:opacity-100 group-hover/calendar:ease-kolumb-flow"
      >
        <Icon.plus className="absolute right-2 h-2.5 w-2.5 fill-kolumblue-200 duration-500 ease-kolumb-flow" />
        <p
          className={`absolute right-0 top-[2px] h-4 w-20 origin-right scale-x-0 select-none capitalize opacity-0 duration-200 ease-kolumb-flow group-hover/add:right-6 group-hover/add:scale-x-100 ${
            !dragging && "group-hover/add:opacity-100"
          }`}
        >
          add event
        </p>
      </button>

      <div className={`origin-center capitalize duration-200 ease-kolumb-flow ${!dragging && "peer-hover:scale-0"}`}>
        {!dragging ? `day ${index + 1}` : "moving"}
      </div>
    </div>
  );
}

export function CalendarEnd() {
  return (
    <div className="sticky left-0 z-20 mb-4 flex h-5 w-32 cursor-default items-center justify-center rounded-b-xl bg-kolumblue-500 text-xs font-medium text-kolumblue-200 shadow-xl">
      End of Trip
    </div>
  );
}
