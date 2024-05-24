import { isValidElement, memo, useMemo } from "react";
import { format, getDay, isToday } from "date-fns";
import { cn } from "~/lib/utils";

type Props = {
  date: string | Date;
  header: string | React.ReactNode;
  className?: string | { container?: string; header?: string; body?: string };
};
export const ItineraryCalendar = memo(function ItineraryCalendar({
  date,
  header,
  className,
}: Props) {
  const d = useMemo(() => new Date(date), [date]);
  const isDateToday = useMemo(() => isToday(d), [d]);

  const containerClassName = typeof className === "string" ? className : className?.container;
  const headerClassName = typeof className === "string" ? undefined : className?.header;
  const bodyClassName = typeof className === "string" ? undefined : className?.body;

  return (
    <div className={cn("font-inter", containerClassName)}>
      {/* Header */}
      {isValidElement(header) ? (
        header
      ) : (
        <div
          className={cn(
            "calendar-header",
            "relative z-30 flex h-5 w-32 items-center justify-center bg-kolumblue-500 text-xs font-medium text-kolumblue-200 shadow-xl duration-300 ease-kolumb-flow focus-visible:shadow-focus group-first/day:rounded-t-xl",
            headerClassName,
          )}
        >
          {header}
        </div>
      )}

      {/* Body */}
      <div
        className={cn(
          "flex h-28 w-32 cursor-default flex-col items-center justify-between bg-white/80 p-2.5 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter",
          bodyClassName,
        )}
      >
        {/* Month & Year */}
        <div className="text-sm leading-[14px] text-gray-600">{format(d, "MMM yyyy")}</div>

        {/* Date */}
        <div
          className={cn(
            "relative flex h-fit items-center justify-center text-center text-[48px] font-light leading-none text-gray-600",
            isDateToday && "text-kolumblue-500",
          )}
        >
          {format(d, "d")}
        </div>

        {/* Day of Week Indicator */}
        <div className="flex select-none font-inconsolata text-sm">
          {["M", "T", "W", "T", "F", "S", "S"].map((dayOfWeek, i) => {
            const isCurrentDay = (getDay(d) + 6) % 7 === i;
            const isWeekend = i === 5 || i === 6;

            return (
              <span
                key={i}
                className={cn(
                  "flex h-[14px] w-[15px] items-center justify-center duration-500 ease-kolumb-flow",
                  isCurrentDay ? "font-black" : "font-light",
                  isWeekend ? "text-red-400" : "text-gray-500",
                  isCurrentDay && (isWeekend ? "text-red-500" : "text-gray-600"),
                )}
              >
                {dayOfWeek}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
});
