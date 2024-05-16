"use client";

import "~/styles/react-date-range/styles.css";
import "~/styles/react-date-range/date-display.css";
import "~/styles/react-date-range/navigation.css";

import { memo, useEffect, useRef, useState } from "react";
import { type RangeKeyDict, type RangeFocus, DateRange } from "react-date-range";
import { add, isBefore } from "date-fns";

import { cn, differenceInDays, formatDate } from "~/lib/utils";

import { Button, type ButtonProps } from "./ui";
import { SelectInline, SelectOption, useSelectContext } from "./ui/select";
import { Floating } from "./ui/floating";
import useDateRange from "~/hooks/use-date-range";

type Preview = { startDate: Date; endDate: Date } | undefined;

export default function DatePicker(props: {
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

  const newDatesRef = useRef({
    startDate: new Date(props.startDate),
    endDate: new Date(props.endDate),
  });

  const handleChange = (item: RangeKeyDict) => {
    const startDate = item.selection?.startDate ?? dateRange.startDate;
    const endDate = item.selection?.endDate ?? dateRange.endDate;
    setDateRange({ startDate, endDate });
  };

  const handlePreviewChange = (date: Date | undefined) => {
    if (!date) {
      setPreview(undefined);
      setDateRange({ days: differenceInDays(dateRange.startDate, dateRange.endDate) });
      return;
    }

    let startDate = date;
    let endDate = date;

    if (focusedRange[1] === 1) {
      startDate = isBefore(date, dateRange.startDate) ? date : dateRange.startDate;
      endDate = isBefore(date, dateRange.startDate) ? dateRange.startDate : date;
      setDateRange({ days: differenceInDays(dateRange.startDate, dateRange.endDate) });
    }

    setPreview({ startDate, endDate });
  };

  const handleApply = () => {
    setIsOpen(false);

    const rangeStartDate = new Date(formatDate(dateRange.startDate));
    const rangeEndDate = new Date(formatDate(dateRange.endDate));
    const startDate = new Date(props.startDate);
    const endDate = new Date(props.endDate);
    newDatesRef.current = { startDate: rangeStartDate, endDate: rangeEndDate };

    if (
      formatDate(startDate) === formatDate(rangeStartDate) &&
      formatDate(endDate) === formatDate(rangeEndDate)
    ) {
      return;
    }

    props.onApply(rangeStartDate, rangeEndDate);
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
          />

          {/* Controls */}
          <div className="flex w-full gap-2">
            <Button
              onClick={handleCancel}
              animatePress
              variant="unset"
              className="w-full rounded-md bg-gray-100 text-xs font-medium text-gray-600 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              animatePress
              variant="unset"
              size="lg"
              className="w-full rounded-md bg-kolumblue-100 text-xs font-medium text-kolumblue-600 hover:bg-kolumblue-200"
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

const DayOption = memo(function DayOption(props: {
  index: number;
  startDate: Date;
  onClick: (date: Date) => void;
  onHover: (preview: Preview) => void;
}) {
  const { selectedIndex } = useSelectContext();

  const currentDate = add(props.startDate, { days: props.index });
  const isSelected = selectedIndex === props.index;
  const day = props.index + 1;

  const handleClick = () => {
    props.onClick(currentDate);
  };

  const handleHover = (isHovered: boolean) => {
    if (isHovered) props.onHover({ startDate: props.startDate, endDate: currentDate });
    else props.onHover(undefined);
  };

  return (
    <SelectOption
      onClick={handleClick}
      onHover={handleHover}
      label={day.toString()}
      className="gap-1.5 pl-0 pr-5"
    >
      <div
        className={cn(
          "flex w-9 flex-shrink-0 items-center justify-end text-right font-light",
          isSelected && "font-semibold text-kolumblue-500",
        )}
      >
        {props.index + 1}
      </div>

      <div
        className={cn(
          "w-full text-[11px] font-light text-gray-500",
          isSelected && "font-medium text-kolumblue-400",
        )}
      >
        {day === 1 ? "Day" : "Days"}
      </div>
    </SelectOption>
  );
});
