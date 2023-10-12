import { FormatDayOfWeek } from "@/lib/utils";

interface Props {
  dayOfWeek: number;
}
/**
 * @param {number} dayOfWeek number 0-6 starting at monday
 */
export default function DayOfWeekIndicator({ dayOfWeek }: Props) {
  const day = FormatDayOfWeek(dayOfWeek);

  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    let currentDayOfWeek;
    switch (i) {
      case 0:
        currentDayOfWeek = "M";
        break;
      case 1:
        currentDayOfWeek = "T";
        break;
      case 2:
        currentDayOfWeek = "W";
        break;
      case 3:
        currentDayOfWeek = "T";
        break;
      case 4:
        currentDayOfWeek = "F";
        break;
      case 5:
        currentDayOfWeek = "S";
        break;
      case 6:
        currentDayOfWeek = "S";
        break;
      default:
        currentDayOfWeek = "Err";
        break;
    }

    daysOfWeek.push(
      <p
        key={currentDayOfWeek + i}
        className={`flex w-[15px] flex-shrink-0 items-center justify-center duration-500 ease-kolumb-flow ${
          day === i ? "font-extrabold" : "font-medium"
        } ${i === 5 || i === 6 ? "text-red-500" : "text-gray-500"}`}
      >
        {currentDayOfWeek}
      </p>
    );
  }

  return (
    <div className="relative flex h-5 w-28 cursor-default select-none items-center justify-center rounded border-gray-100 text-center text-sm">
      <section className="z-10 flex w-fit items-center justify-between font-inconsolata text-xs">
        {daysOfWeek}
      </section>

      <span
        className={`absolute h-5 w-4 rounded bg-gray-100/30 shadow-inset duration-500 ease-kolumb-flow ${
          day == 0
            ? "left-[3px]"
            : day == 1
            ? "left-[18px]"
            : day == 2
            ? "left-[33px]"
            : day == 3
            ? "left-[48px]"
            : day == 4
            ? "left-[63px]"
            : day == 5
            ? "left-[78px]"
            : day == 6
            ? "left-[93px]"
            : "left-[3px]"
        }`}
      ></span>
    </div>
  );
}
