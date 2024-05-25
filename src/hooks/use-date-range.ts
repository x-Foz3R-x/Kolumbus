import { useMemo, useState } from "react";
import { add, addDays, isBefore } from "date-fns";
import { differenceInDays } from "~/lib/utils";

export default function useDateRange(props: {
  startDate: string;
  endDate: string;
  maxDays: number;
  focusedRange: [number, number];
}) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(props.startDate),
    endDate: new Date(props.endDate),
    days: differenceInDays(new Date(props.startDate), new Date(props.endDate)),
    key: "selection",
  });

  const minDate = useMemo(
    () =>
      props.focusedRange[1] === 1
        ? addDays(dateRange.startDate, -props.maxDays + 1)
        : new Date("2023-01-01"),
    [props.focusedRange, dateRange.startDate, props.maxDays],
  );
  const maxDate = useMemo(
    () =>
      props.focusedRange[1] === 1
        ? addDays(dateRange.startDate, props.maxDays - 1)
        : addDays(new Date(), 1095),
    [props.focusedRange, dateRange.startDate, props.maxDays],
  );

  const handleChange = (changeProps: { startDate?: Date; endDate?: Date; days?: number }) => {
    let newStartDate = changeProps.startDate ?? dateRange.startDate;
    let newEndDate = changeProps.endDate ?? dateRange.endDate;

    if (isBefore(newEndDate, newStartDate)) {
      [newStartDate, newEndDate] = [newEndDate, newStartDate];
    }

    let calculatedDays = differenceInDays(newEndDate, newStartDate);

    if (calculatedDays > props.maxDays) {
      newEndDate = add(newStartDate, { days: props.maxDays - 1 });
      calculatedDays = props.maxDays;
    }

    setDateRange({
      ...dateRange,
      startDate: newStartDate,
      endDate: newEndDate,
      days: changeProps.days ?? calculatedDays,
    });
  };

  return [dateRange, handleChange, { minDate, maxDate }] as const;
}
