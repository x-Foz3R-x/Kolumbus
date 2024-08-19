"use client";

import { memo, useEffect, useState } from "react";
import type { Placement } from "@floating-ui/react";
import { format } from "date-fns";

import useDatePicker from "~/hooks/use-date-picker";
import { differenceInDays, formatDate } from "~/lib/utils";

import DatePicker from "./date-picker";
import { Floating } from "../ui/floating";
import { Icons, type ButtonProps } from "../ui";

const Calendar = memo(function Calendar(props: {
  startDate: string;
  endDate: string;
  maxDays: number;
  onApply: (startDate: Date, endDate: Date) => void;
  placement?: Placement;
  inline?: boolean;
  triggerProps?: ButtonProps;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { dateRange, setDateRange, focusedRange, setFocusedRange, disabledDay } = useDatePicker({
    startDate: props.startDate,
    endDate: props.endDate,
    maxDays: props.maxDays,
  });

  const updateCalendar = (isOpen: boolean) => {
    setIsOpen(isOpen);

    const { startDate, endDate } = dateRange;
    const hasDateRangeChanged =
      formatDate(startDate) !== props.startDate || formatDate(endDate) !== props.endDate;

    if (!isOpen && hasDateRangeChanged) props.onApply(dateRange.startDate, dateRange.endDate);
  };

  // const cancelDateSelection = () => {
  //   setIsOpen(false);
  //   setDateRange({ startDate: new Date(props.startDate), endDate: new Date(props.endDate) });
  // };

  // Update date range when the props dates change
  useEffect(() => {
    setDateRange({ startDate: new Date(props.startDate), endDate: new Date(props.endDate) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.startDate, props.endDate]);

  if (props.inline) {
    return (
      <div id="calendar" className="flex">
        <DatePicker
          dateRange={dateRange}
          setDateRange={(dateRange) => {
            setDateRange(dateRange);

            const startDate = dateRange.startDate ?? new Date(props.startDate);
            const endDate = dateRange.endDate ?? new Date(props.endDate);
            const hasDateRangeChanged =
              formatDate(startDate) !== props.startDate || formatDate(endDate) !== props.endDate;

            if (!isOpen && hasDateRangeChanged) props.onApply(startDate, endDate);
          }}
          focusedRange={focusedRange}
          setFocusedRange={setFocusedRange}
          disabledDay={disabledDay}
        />
      </div>
    );
  }

  return (
    <div id="calendar" className="flex">
      <Floating
        isOpen={isOpen}
        onOpenChange={updateCalendar}
        placement={props.placement ?? "bottom-end"}
        offset={{ mainAxis: 6, crossAxis: 12 }}
        click={{ enabled: true }}
        className="flex overflow-scroll rounded-xl border bg-white shadow-floating dark:border-gray-700 dark:bg-gray-900"
        rootSelector="#calendar"
        triggerProps={
          !!props.triggerProps
            ? {
                ...props.triggerProps,
                tooltip: props.triggerProps.tooltip && {
                  ...props.triggerProps.tooltip,
                  disabled: isOpen,
                },
              }
            : {
                variant: "unset",
                size: "unset",
                className: "relative h-10 fill-kolumblue-500 flex hover:brightness-110",
                children: (
                  <>
                    <Icons.rangeCalendar className="h-full" />
                    <div className="absolute inset-0 flex gap-[2px] px-1 pb-[4.5px] pt-[5px]">
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

                      <div className="flex w-[35px] flex-col items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase leading-[14.5px] tracking-tight text-white">
                          DAYS
                        </span>
                        <span className="text-sm leading-[15px]">
                          {differenceInDays(props.startDate, props.endDate, true)}
                        </span>
                      </div>
                    </div>
                  </>
                ),
              }
        }
      >
        <DatePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          focusedRange={focusedRange}
          setFocusedRange={setFocusedRange}
          disabledDay={disabledDay}
        />
      </Floating>
    </div>
  );
});

export default Calendar;
