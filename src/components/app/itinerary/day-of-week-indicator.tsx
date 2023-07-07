import { formatDayOfWeek } from "@/lib/utils";

interface Props {
  dayOfWeek: number;
}

/**
 * @param {number} dayOfWeek number 0-6 starting at monday
 */
export default function DayOfWeekIndicator({ dayOfWeek }: Props) {
  dayOfWeek = formatDayOfWeek(dayOfWeek);

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
      <div
        key={currentDayOfWeek + i}
        className={
          "h-fit w-[0.875rem] rounded text-center " +
          (dayOfWeek === i ? "font-extrabold " : "font-medium ") +
          (i === 5 || i === 6 ? "text-red-400 " : "text-kolumbGray-500 ")
        }
      >
        {currentDayOfWeek}
      </div>
    );
  }

  return (
    <div className="flex w-28 cursor-default select-none flex-col text-center text-sm">
      <div className="flex justify-between px-1 text-center font-inconsolata text-xs ">
        {daysOfWeek}
      </div>

      <div className="relative flex h-2 rounded-md bg-kolumblue-500/20 px-1 shadow-kolumblueInset">
        <span
          className={
            "absolute -top-px z-10 h-[0.625rem] w-4 rounded-[3px] border-x-2 border-y border-kolumblue-500 bg-white/30 shadow-kolumblue duration-500 ease-kolumb-flow " +
            (dayOfWeek == 0
              ? "left-[3px] "
              : dayOfWeek == 1
              ? "left-[18px] "
              : dayOfWeek == 2
              ? "left-[33px] "
              : dayOfWeek == 3
              ? "left-[48px] "
              : dayOfWeek == 4
              ? "left-[63px] "
              : dayOfWeek == 5
              ? "left-[78px] "
              : dayOfWeek == 6
              ? "left-[93px] "
              : " ")
          }
        ></span>
      </div>
    </div>
  );
}
