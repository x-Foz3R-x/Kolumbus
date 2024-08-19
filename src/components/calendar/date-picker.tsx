import { DateRange, type RangeKeyDict, type RangeFocus } from "react-date-range";
import Navigation from "./navigation";

// type Preview = { startDate: Date; endDate: Date } | undefined;

export default function DatePicker(props: {
  dateRange: { startDate: Date; endDate: Date };
  setDateRange: (changeProps: { startDate?: Date; endDate?: Date; days?: number }) => void;
  focusedRange: RangeFocus;
  setFocusedRange: (range: RangeFocus) => void;
  minDate: Date;
  maxDate: Date;
}) {
  // const [preview, setPreview] = useState<Preview>(undefined);

  const handleChange = (item: RangeKeyDict) => {
    props.setDateRange({ startDate: item.selection?.startDate, endDate: item.selection?.endDate });
  };

  // const handlePreviewChange = (date: Date | undefined) => {
  //   if (!date) {
  //     setPreview(undefined);
  //     setDateRange({ days: differenceInDays(dateRange.startDate, dateRange.endDate) });
  //     return;
  //   }

  //   const isDateBefore = isBefore(date, dateRange.startDate);
  //   const startDate = focusedRange[1] === 1 && isDateBefore ? date : dateRange.startDate;
  //   const endDate = focusedRange[1] === 1 && isDateBefore ? dateRange.startDate : date;

  //   if (focusedRange[1] === 1) setDateRange({ days: differenceInDays(startDate, endDate) });
  //   setPreview({ startDate, endDate });
  // };

  return (
    <div className="space-y-2 p-2">
      <DateRange
        ranges={[props.dateRange]}
        rangeColors={["hsl(210, 78%, 60%)"]}
        onChange={handleChange}
        focusedRange={props.focusedRange}
        onRangeFocusChange={(focusRange) => props.setFocusedRange(focusRange)}
        // {...((!!preview || focusedRange[1] === 1) && { preview: preview })}
        // {...((!!preview || focusedRange[1] === 1) && {
        //   onPreviewChange: handlePreviewChange,
        // })}
        dateDisplayFormat="d MMM yyyy"
        weekdayDisplayFormat="EEEEE"
        minDate={props.minDate}
        maxDate={props.maxDate}
        weekStartsOn={1}
        scroll={{ enabled: true, monthHeight: 212, longMonthHeight: 244, calendarHeight: 228 }}
        navigatorRenderer={(shownDate, changeShownDate) => (
          <Navigation
            shownDate={shownDate}
            changeShownDate={changeShownDate}
            maxDate={props.maxDate}
            minDate={props.minDate}
          />
        )}
      />
    </div>
  );
}
