"use client";

import { format } from "date-fns";

import YearOption from "./year-option";
import MonthOption from "./month-option";
import { Select } from "../ui/select";
import { Button, Icons } from "../ui";

type ChangeShownDate = (
  value: Date | number | string,
  mode?: "set" | "setYear" | "setMonth" | "monthOffset",
) => void;

export function datePickerNavigation(
  shownDate: Date,
  changeShownDate: ChangeShownDate,
  maxDate: Date,
  minDate: Date,
) {
  const currentMonth = format(shownDate, "MMMM");
  const currentYear = format(shownDate, "yyyy");

  const upperYearLimit = maxDate.getFullYear();
  const lowerYearLimit = minDate.getFullYear();

  const arrayOfMonths = Array.from({ length: 12 }, (_, index) =>
    format(new Date(0, index + 1, 0), "MMMM"),
  );
  const arrayOfYears = Array.from(
    { length: upperYearLimit - lowerYearLimit + 1 },
    (_, index) => lowerYearLimit + index,
  );

  return (
    <div className="flex justify-between pt-2">
      <div>
        <Select
          placement="bottom"
          selectedIndex={shownDate.getMonth()}
          buttonProps={{
            variant: "scale",
            className: "h-8 w-24 before:bg-gray-100 text-xs",
            children: currentMonth,
          }}
        >
          {arrayOfMonths.map((month, index) => (
            <MonthOption
              key={month}
              month={month}
              onClick={() => changeShownDate(index, "setMonth")}
            />
          ))}
        </Select>

        <Select
          placement="bottom"
          selectedIndex={shownDate.getFullYear() - minDate.getFullYear()}
          buttonProps={{
            variant: "scale",
            className: "h-8 before:bg-gray-100 text-xs",
            children: currentYear,
          }}
        >
          {arrayOfYears.map((year) => (
            <YearOption key={year} year={year} onClick={() => changeShownDate(year, "setYear")} />
          ))}
        </Select>
      </div>

      <div className="flex">
        <Button
          onClick={() => changeShownDate(-1, "monthOffset")}
          animatePress
          variant="scale"
          size="unset"
          className="flex h-8 w-8 items-center justify-center before:rounded-md before:bg-gray-100"
        >
          <Icons.chevron className="h-2.5 w-2.5 rotate-90 scale-100" />
        </Button>

        <Button
          onClick={() => changeShownDate(1, "monthOffset")}
          animatePress
          variant="scale"
          size="unset"
          className="flex h-8 w-8 items-center justify-center before:rounded-md before:bg-gray-100"
        >
          <Icons.chevron className="h-2.5 w-2.5 -rotate-90 scale-100" />
        </Button>
      </div>
    </div>
  );
}
