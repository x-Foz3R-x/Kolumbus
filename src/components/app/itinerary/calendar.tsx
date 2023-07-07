import DayOfWeekIndicator from "./day-of-week-indicator";
import Icon from "@/components/icons";

interface CalendarHeaderProps {
  tripDay: number;
  overlay?: boolean;
  handleAddEvent?: Function;
}

function CalendarHeader({
  tripDay,
  overlay,
  handleAddEvent,
  ...props
}: CalendarHeaderProps) {
  return (
    <header className="relative z-30 flex h-5 w-32 items-center justify-center bg-kolumblue-500 text-xs font-medium text-white/75 shadow-kolumblue group-first/calendar:rounded-t-xl">
      <button
        className="group/move peer absolute left-0 h-5 w-6 cursor-grab"
        {...props}
      >
        <Icon.gripDots className="absolute left-2 top-[5px] h-[0.625rem] w-[0.625rem] fill-white/75" />
        <p
          className={
            "absolute left-0 top-[2px] h-4 w-20 origin-left scale-x-0 select-none capitalize opacity-0 duration-200 ease-kolumb-flow group-hover/move:left-6 group-hover/move:scale-x-100 " +
            (!overlay && "group-hover/move:opacity-100")
          }
        >
          move
        </p>
      </button>

      <button
        onClick={() => {
          if (handleAddEvent) handleAddEvent("at_start", null, tripDay - 1);
        }}
        className="group/add peer absolute right-0 h-5 w-6"
      >
        <Icon.plus className="absolute right-2 top-[5px] h-[0.625rem] w-[0.625rem] fill-white/75" />
        <p
          className={
            "absolute right-0 top-[2px] h-4 w-20 origin-right scale-x-0 select-none capitalize opacity-0 duration-200 ease-kolumb-flow group-hover/add:right-6 group-hover/add:scale-x-100 " +
            (!overlay && "group-hover/add:opacity-100")
          }
        >
          add event
        </p>
      </button>

      <div
        className={
          "origin-center capitalize duration-200 ease-kolumb-flow " +
          (!overlay && "peer-hover:scale-0 ")
        }
      >
        {!overlay ? "day " + tripDay : "moving"}
      </div>
    </header>
  );
}

interface CalendarProps {
  index: number;
  startDate: string;
  overlay?: boolean;
  handleAddEvent?: Function;
  className?: string;
}

export function Calendar({
  index,
  startDate,
  overlay,
  handleAddEvent,
  className,
  ...props
}: CalendarProps) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + index);

  return (
    <div className={"sticky left-0 z-20 flex-none " + className}>
      <CalendarHeader
        tripDay={index + 1}
        overlay={overlay}
        handleAddEvent={handleAddEvent}
        {...props}
      />

      <div className="flex h-fit w-32 flex-col items-center gap-1 bg-white/80 p-2 shadow-kolumblue backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
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

interface CalendarWeatherProps {
  tripDay: number;
  date: Date;
  weatherData?: object;
}

export function CalendarWeather({
  tripDay,
  date,
  weatherData,
}: CalendarWeatherProps) {
  return (
    <div className="group/calendar flex-none uppercase">
      <CalendarHeader tripDay={tripDay} />

      <div className="flex h-fit w-32 flex-col items-center gap-1 bg-white/70 p-2 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
        <div className="flex h-fit w-full items-center justify-center gap-2">
          <div className="text-5xl font-bold leading-9 text-kolumblue-500">
            {date.getDate()}
          </div>

          <div className="flex flex-col text-sm text-kolumbGray-900/75">
            <p>{date.toLocaleString("default", { month: "short" })}</p>
            <p>{date.getFullYear()}</p>
          </div>
        </div>

        <DayOfWeekIndicator dayOfWeek={date.getDay()} />

        {/* <WeatherIndicator /> */}
      </div>
    </div>
  );
}

interface CalendarEndProps {
  totalDays: number;
}

export function CalendarEnd({ totalDays }: CalendarEndProps) {
  return (
    <div className="sticky left-0 z-20 flex h-5 w-32 items-center justify-center rounded-b-xl bg-kolumblue-500 text-xs font-medium text-white/75 shadow-kolumblue">
      Total {totalDays} days
    </div>
  );
}
