import React from "react";

interface Props {
  dayOfWeek: number;
}

/**
 * @param {number} dayOfWeek number 0-6 starting at monday
 */
export default function DayOfWeekIndicator({ dayOfWeek }: Props) {
  let dayOfWeekName = [];

  for (let i = 0; i < 7; i++) {
    let currentDayOfWeekName;

    switch (i) {
      case 0:
        currentDayOfWeekName = "M";
        break;
      case 1:
        currentDayOfWeekName = "T";
        break;
      case 2:
        currentDayOfWeekName = "W";
        break;
      case 3:
        currentDayOfWeekName = "T";
        break;
      case 4:
        currentDayOfWeekName = "F";
        break;
      case 5:
        currentDayOfWeekName = "S";
        break;
      case 6:
        currentDayOfWeekName = "S";
        break;
      default:
        currentDayOfWeekName = "M";
        break;
    }

    dayOfWeekName.push(
      <div
        className={
          "h-fit w-[0.875rem] rounded " +
          (dayOfWeek == i ? "font-extrabold " : "font-medium ") +
          (i == 5 || i == 6 ? "text-red-500 " : "text-kolumbGray-900/40 ")
        }
      >
        {currentDayOfWeekName}
      </div>
    );
  }

  return (
    <div className="flex w-full cursor-default select-none flex-col text-center text-sm">
      <div className="flex justify-between px-1 text-center font-inconsolata text-xs ">
        {dayOfWeekName}
      </div>

      <div className="relative flex h-2 rounded-md bg-kolumblue-500/10 px-1 shadow-kolumblueInset">
        <span
          className={
            "absolute -top-px h-[0.625rem] w-[0.875rem] rounded-[3px] border border-kolumblue-500 bg-kolumblue-500/25 " +
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
