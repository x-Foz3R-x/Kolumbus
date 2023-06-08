import CalendarHeader from "./CalendarHeader";
import DayOfWeekIndicator from "./DayOfWeekIndicator";
import WeatherIndicator from "./WeatherIndicator";

interface Props {
  tripDay: number;
  date: Date;
  weatherData?: object;
}

export default function CalendarWeather({ tripDay, date, weatherData }: Props) {
  return (
    <div className="group/calendar flex-none uppercase">
      <CalendarHeader tripDay={tripDay} />

      <div className="flex h-fit w-32 flex-col items-center gap-1 bg-white/70 p-2 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
        <div className="flex h-fit w-full items-center justify-center gap-2">
          <div className="text-5xl font-bold leading-9 text-kolumblue-500">
            {date.getDate()}
          </div>

          <div className="flex flex-col text-sm text-kolumbGray-900/75">
            <span>{date.toLocaleString("default", { month: "short" })}</span>
            <span>{date.getFullYear()}</span>
          </div>
        </div>

        <DayOfWeekIndicator dayOfWeek={date.getDay()} />

        <WeatherIndicator />
      </div>
    </div>
  );
}
