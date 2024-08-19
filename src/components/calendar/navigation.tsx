"use client";

import "~/styles/react-date-range/styles.css";
import "~/styles/react-date-range/date-display.css";
import "~/styles/react-date-range/navigation.css";

import { format } from "date-fns";

import { Select, SelectOption } from "../ui/select";
import { Button, Icons } from "../ui";

type ChangeShownDate = (
  value: Date | number | string,
  mode?: "set" | "setYear" | "setMonth" | "monthOffset",
) => void;

export default function Navigation(props: {
  shownDate: Date;
  changeShownDate: ChangeShownDate;
  maxDate: Date;
  minDate: Date;
}) {
  const currentMonth = format(props.shownDate, "MMMM");
  const currentYear = format(props.shownDate, "yyyy");

  const upperYearLimit = props.maxDate.getFullYear();
  const lowerYearLimit = props.minDate.getFullYear();

  const arrayOfMonths = Array.from({ length: 12 }, (_, index) =>
    format(new Date(0, index + 1, 0), "MMMM"),
  );
  const arrayOfYears = Array.from(
    { length: upperYearLimit - lowerYearLimit + 1 },
    (_, index) => lowerYearLimit + index,
  );

  return (
    <div className="flex pt-2">
      <Select
        placement="bottom"
        selectedIndex={props.shownDate.getMonth()}
        zIndex={50}
        buttonProps={{
          variant: "appear",
          className: "h-8 rounded-lg hover:bg-gray-100 text-xs hover:shadow-sm",
          children: currentMonth,
        }}
      >
        {arrayOfMonths.map((month, index) => (
          <SelectOption
            key={month}
            label={month}
            onClick={() => props.changeShownDate(index, "setMonth")}
            size="sm"
            className={{ base: "h-[30px] px-4", selected: "font-semibold text-kolumblue-500" }}
          >
            {month}
          </SelectOption>
        ))}
      </Select>

      <Select
        placement="bottom"
        selectedIndex={props.shownDate.getFullYear() - props.minDate.getFullYear()}
        zIndex={50}
        buttonProps={{
          variant: "appear",
          className: "h-8 rounded-lg hover:bg-gray-100 text-xs hover:shadow-sm",
          children: currentYear,
        }}
      >
        {arrayOfYears.map((year) => (
          <SelectOption
            key={year}
            label={year.toString()}
            onClick={() => props.changeShownDate(year, "setYear")}
            size="sm"
            className={{ base: "h-[30px] px-4", selected: "font-semibold text-kolumblue-500" }}
          >
            {year}
          </SelectOption>
        ))}
      </Select>

      <div className="ml-auto flex">
        <Button
          onClick={() => props.changeShownDate(-1, "monthOffset")}
          animatePress
          variant="appear"
          size="unset"
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 hover:shadow-sm"
        >
          <Icons.chevron className="h-2.5 w-2.5 rotate-90 scale-100" />
        </Button>

        <Button
          onClick={() => props.changeShownDate(1, "monthOffset")}
          animatePress
          variant="appear"
          size="unset"
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 hover:shadow-sm"
        >
          <Icons.chevron className="h-2.5 w-2.5 -rotate-90 scale-100" />
        </Button>
      </div>
    </div>
  );
}
