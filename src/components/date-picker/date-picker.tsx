"use client";

import "~/styles/react-date-range/styles.css";
import "~/styles/react-date-range/date-display.css";
import "~/styles/react-date-range/navigation.css";

import { useEffect, useState } from "react";
import { type RangeKeyDict, type RangeFocus, DateRange } from "react-date-range";
import { isBefore } from "date-fns";

import { differenceInDays, formatDate } from "~/lib/utils";

import { Button, type ButtonProps } from "../ui";
import { SelectInline } from "../ui/select";
import { Floating } from "../ui/floating";
import useDateRange from "~/hooks/use-date-range";
import { DayOption } from "./day-option";
import { datePickerNavigation } from "./date-picker-navigation";

type Preview = { startDate: Date; endDate: Date } | undefined;

export function DatePicker(props: {
  startDate: string;
  endDate: string;
  daysLimit: number;
  onApply: (startDate: Date, endDate: Date) => void;
  includeDays?: boolean;
  buttonProps: ButtonProps;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedRange, setFocusedRange] = useState<RangeFocus>([0, 0]);
  const [preview, setPreview] = useState<Preview>(undefined);

  const [dateRange, setDateRange, { minDate, maxDate }] = useDateRange({
    startDate: props.startDate,
    endDate: props.endDate,
    daysLimit: props.daysLimit,
    focusedRange,
  });

  const handleChange = (item: RangeKeyDict) => {
    setDateRange({ startDate: item.selection?.startDate, endDate: item.selection?.endDate });
  };

  const handlePreviewChange = (date: Date | undefined) => {
    if (!date) {
      setPreview(undefined);
      setDateRange({ days: differenceInDays(dateRange.startDate, dateRange.endDate) });
      return;
    }

    const isDateBefore = isBefore(date, dateRange.startDate);
    const startDate = focusedRange[1] === 1 && isDateBefore ? date : dateRange.startDate;
    const endDate = focusedRange[1] === 1 && isDateBefore ? dateRange.startDate : date;

    if (focusedRange[1] === 1) setDateRange({ days: differenceInDays(startDate, endDate) });
    setPreview({ startDate, endDate });
  };

  const handleApply = () => {
    setIsOpen(false);

    if (
      props.startDate !== formatDate(dateRange.startDate) ||
      props.endDate !== formatDate(dateRange.endDate)
    ) {
      props.onApply(dateRange.startDate, dateRange.endDate);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setDateRange({ startDate: new Date(props.startDate), endDate: new Date(props.endDate) });
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setDateRange({ startDate: new Date(props.startDate), endDate: new Date(props.endDate) });
    }
  };

  // Update date range when the props dates change
  useEffect(() => {
    setDateRange({ startDate: new Date(props.startDate), endDate: new Date(props.endDate) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.startDate, props.endDate]);

  return (
    <div id="date-picker">
      <Floating
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom-end"
        offset={{ mainAxis: 6, crossAxis: 12 }}
        flip={false}
        click={{ enabled: true }}
        animation="fadeInScale"
        className="flex origin-top-right overflow-hidden rounded-xl border bg-white shadow-floating dark:border-gray-700 dark:bg-gray-900"
        rootSelector="#date-picker"
        triggerProps={{
          ...props.buttonProps,
          tooltip: props.buttonProps.tooltip && { ...props.buttonProps.tooltip, disabled: isOpen },
        }}
      >
        <div className="space-y-2 py-2 pl-2">
          <DateRange
            ranges={[dateRange]}
            rangeColors={["hsl(210, 78%, 60%)"]}
            onChange={handleChange}
            focusedRange={focusedRange}
            onRangeFocusChange={(focusRange) => setFocusedRange(focusRange)}
            {...((!!preview || focusedRange[1] === 1) && { preview })}
            {...((!!preview || focusedRange[1] === 1) && { onPreviewChange: handlePreviewChange })}
            dateDisplayFormat="d MMM yyyy"
            weekdayDisplayFormat="EEEEE"
            minDate={minDate}
            maxDate={maxDate}
            weekStartsOn={1}
            preventSnapRefocus
            scroll={{ enabled: true, monthHeight: 212, longMonthHeight: 244, calendarHeight: 228 }}
            navigatorRenderer={(shownDate, changeShownDate) =>
              datePickerNavigation(shownDate, changeShownDate, minDate, maxDate)
            }
          />

          {/* Controls */}
          <div className="relative z-50 flex w-full gap-2">
            <Button
              onClick={handleCancel}
              animatePress
              variant="scale"
              className="w-full rounded-md bg-gray-50 text-xs font-medium text-gray-600 before:rounded-md before:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              animatePress
              variant="scale"
              className="w-full rounded-md bg-gray-50 text-xs font-medium text-gray-600 before:rounded-md before:bg-gray-100"
            >
              Apply
            </Button>
          </div>
        </div>

        {props.includeDays && (
          <div className="relative flex h-[24.5rem] flex-col gap-2 overflow-hidden py-0.5">
            <SelectInline
              selectedIndex={dateRange.days - 1}
              scrollItemIntoView={{ behavior: "smooth", block: "center" }}
              className="px-2"
            >
              {Array.from({ length: props.daysLimit }).map((_, i) => (
                <DayOption
                  key={i}
                  index={i}
                  startDate={dateRange.startDate}
                  onClick={(date) => handleChange({ selection: { endDate: date } })}
                  onHover={(preview) => setPreview(preview)}
                />
              ))}
            </SelectInline>
          </div>
        )}
      </Floating>
    </div>
  );
}
