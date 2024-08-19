import { DateRange, type RangeKeyDict, type RangeFocus } from "react-date-range";
import Navigation from "./navigation";
import { useMemo } from "react";
import { add } from "date-fns";

export default function DatePicker(props: {
  dateRange: { startDate: Date; endDate: Date };
  setDateRange: (dateRange: { startDate?: Date; endDate?: Date }) => void;
  focusedRange: RangeFocus;
  setFocusedRange: (range: RangeFocus) => void;
  disabledDay: (date: Date) => boolean;
}) {
  const handleChange = (item: RangeKeyDict) => {
    props.setDateRange({ startDate: item.selection?.startDate, endDate: item.selection?.endDate });
  };

  const minDate = useMemo(() => new Date("2023-01-01"), []);
  const maxDate = useMemo(() => add(new Date(), { days: 1095 }), []);

  return (
    <div className="space-y-2 p-2">
      <DateRange
        ranges={[props.dateRange]}
        rangeColors={["hsl(210, 78%, 60%)"]}
        onChange={handleChange}
        focusedRange={props.focusedRange}
        onRangeFocusChange={(focusRange) => props.setFocusedRange(focusRange)}
        disabledDay={props.disabledDay}
        dateDisplayFormat="d MMM yyyy"
        weekdayDisplayFormat="EEEEE"
        minDate={minDate}
        maxDate={maxDate}
        weekStartsOn={1}
        scroll={{ enabled: true, monthHeight: 212, longMonthHeight: 244, calendarHeight: 228 }}
        navigatorRenderer={(shownDate, changeShownDate) => (
          <Navigation
            shownDate={shownDate}
            changeShownDate={changeShownDate}
            maxDate={maxDate}
            minDate={minDate}
          />
        )}
      />
    </div>
  );
}
