"use client";

import "~/styles/react-date-range/styles.css";
import "~/styles/react-date-range/date-display.css";
import "~/styles/react-date-range/navigation.css";

import { useEffect, useState } from "react";
import type { Placement } from "@floating-ui/react";
import { type RangeKeyDict, type RangeFocus, DateRange } from "react-date-range";
import { add, format, isBefore } from "date-fns";

import useDateRange from "~/hooks/use-date-range";
import { cn, differenceInDays, formatDate } from "~/lib/utils";

import { DayOption } from "./day-option";
import { datePickerNavigation } from "./date-picker-navigation";
import { Floating } from "../ui/floating";
import { SelectInline } from "../ui/select";
import { Button, Icons, type ButtonProps } from "../ui";

type Preview = { startDate: Date; endDate: Date } | undefined;

export function DatePicker(props: {
  startDate: string;
  endDate: string;
  maxDays: number;
  onApply: (startDate: Date, endDate: Date) => void;
  placement?: Placement;
  includeDays?: boolean;
  includeTooltip?: boolean;
  className?: string;
  buttonProps?: ButtonProps;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedRange, setFocusedRange] = useState<RangeFocus>([0, 0]);
  const [preview, setPreview] = useState<Preview>(undefined);

  const [dateRange, setDateRange, { minDate, maxDate }] = useDateRange({
    startDate: props.startDate,
    endDate: props.endDate,
    daysLimit: props.maxDays,
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
    <div id="date-picker" className="flex">
      <Floating
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement={props.placement ?? "bottom-end"}
        offset={{ mainAxis: 6, crossAxis: 12 }}
        click={{ enabled: true }}
        className="flex overflow-scroll rounded-xl border bg-white shadow-floating dark:border-gray-700 dark:bg-gray-900"
        rootSelector="#date-picker"
        triggerProps={
          !!props.buttonProps
            ? {
                ...props.buttonProps,
                tooltip: props.buttonProps.tooltip && {
                  ...props.buttonProps.tooltip,
                  disabled: isOpen,
                },
              }
            : {
                variant: "unset",
                size: "unset",
                className: "relative h-10 fill-kolumblue-500 flex hover:brightness-110",
                tooltip: props.includeTooltip
                  ? {
                      placement: "bottom",
                      offset: 8,
                      arrow: true,
                      focus: { enabled: false },
                      zIndex: 50,
                      children: "Date Picker",
                    }
                  : undefined,
                children: (
                  <>
                    <Icons.rangeCalendar className="h-full" />
                    <div className="absolute inset-0 flex gap-[2px] px-1 pb-[4.5px] pt-[6px]">
                      <div className="flex gap-[8.5px]">
                        <div className="flex w-[30px] flex-col items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase leading-[14.5px] tracking-tight text-white">
                            {format(new Date(props.startDate), "MMM").toUpperCase()}
                          </span>
                          <span className="text-sm leading-[15px]">
                            {format(new Date(props.startDate), "d")}
                          </span>
                        </div>

                        <div className="flex w-[30px] flex-col items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase leading-[14.5px] tracking-tight text-white">
                            {format(new Date(props.endDate), "MMM").toUpperCase()}
                          </span>
                          <span className="text-sm leading-[15px]">
                            {format(new Date(props.endDate), "d")}
                          </span>
                        </div>
                      </div>

                      <div className="flex w-[30px] flex-col items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase leading-[14.5px] tracking-tight text-white">
                          DAYS
                        </span>
                        <span className="text-sm leading-[15px]">
                          {differenceInDays(props.startDate, props.endDate)}
                        </span>
                      </div>
                    </div>
                  </>
                ),
              }
        }
      >
        <div className={cn("space-y-2", props.includeDays ? "py-2 pl-2" : "p-2")}>
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
              selectedIndex={dateRange.days}
              setSelectedIndex={(index) => {
                if (index === null) return;
                setDateRange({
                  endDate: add(dateRange.startDate, { days: index }),
                  days: index + 1,
                });
              }}
              scrollItemIntoView={{ behavior: "smooth", block: "center" }}
              className="px-2"
            >
              {Array.from({ length: props.maxDays }).map((_, i) => (
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
