import { cn } from "@/lib/utils";

export function CalendarBody({ date, isToday, className }: { date: Date; isToday: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-28 w-32 cursor-default flex-col items-center justify-between bg-white/80 p-2.5 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter",
        className,
      )}
    >
      {/* Month & Year */}
      <div className={cn("text-sm leading-[14px] text-gray-600", isToday && "text-kolumblue-400")}>
        {date.toLocaleString("default", { month: "short" })} {date.getFullYear()}
      </div>

      {/* Date */}
      <div
        className={cn(
          "relative flex h-fit items-center justify-center text-center text-[48px] font-light leading-none text-gray-600",
          isToday && "text-kolumblue-500",
        )}
      >
        {date.getDate()}
      </div>

      {/* Day of Week */}
      <div className="flex select-none font-inconsolata text-sm">
        {["M", "T", "W", "T", "F", "S", "S"].map((dayOfWeek, i) => {
          const isCurrentDay = (date.getDay() + 6) % 7 === i;
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
  );
}
