import { useState } from "react";
import { add, isAfter, isBefore } from "date-fns";
import type { RangeFocus } from "react-date-range";

export default function useDatePicker(props: {
  startDate: string;
  endDate: string;
  maxDays: number;
}) {
  const [focusedRange, setFocusedRange] = useState<RangeFocus>([0, 0]);
  const [dateRange, setDateRange] = useState({
    key: "selection",
    startDate: new Date(props.startDate),
    endDate: new Date(props.endDate),
  });

  const updateDateRange = ({ startDate, endDate }: { startDate?: Date; endDate?: Date }) => {
    let newStartDate = startDate ?? dateRange.startDate;
    let newEndDate = endDate ?? dateRange.endDate;

    if (isBefore(newEndDate, newStartDate)) {
      [newStartDate, newEndDate] = [newEndDate, newStartDate];
    }

    setDateRange({ key: "selection", startDate: newStartDate, endDate: newEndDate });
  };

  const disabledDay = (date: Date) => {
    if (focusedRange[1] === 0) return false;

    return (
      isBefore(date, add(dateRange.startDate, { days: -props.maxDays + 1 })) ||
      isAfter(date, add(dateRange.startDate, { days: props.maxDays - 1 }))
    );
  };

  return {
    dateRange,
    setDateRange: updateDateRange,
    focusedRange,
    setFocusedRange,
    disabledDay,
  } as const;
}
