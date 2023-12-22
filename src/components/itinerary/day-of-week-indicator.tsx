import { cn } from "@/lib/utils";

export default function DayOfWeekIndicator({ dayOfWeek }: { dayOfWeek: number }) {
  const day = (dayOfWeek + 6) % 7;

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const daysOfWeekElements = daysOfWeek.map((currentDayOfWeek, i) => {
    const isWeekend = i === 5 || i === 6;

    return (
      <p
        key={i}
        className={cn(
          "flex w-[15px] flex-shrink-0 items-center justify-center duration-500 ease-kolumb-flow",
          isWeekend ? "text-red-400" : "text-gray-500",
          day === i ? "font-black" : "font-normal",
          day === i && (isWeekend ? "text-red-500" : "text-gray-500"),
        )}
      >
        {currentDayOfWeek}
      </p>
    );
  });

  return (
    <div className="relative flex h-5 w-28 cursor-default select-none items-center justify-center rounded border-gray-100 text-center text-sm">
      <section className="z-10 flex w-fit items-center justify-between font-inconsolata text-sm">{daysOfWeekElements}</section>

      <span style={{ translate: day * 15 }} className={`absolute left-[3px] h-5 w-4 rounded  shadow-inset duration-500 ease-kolumb-flow`} />
    </div>
  );
}
