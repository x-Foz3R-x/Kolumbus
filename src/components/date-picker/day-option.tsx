import { memo } from "react";
import { SelectOption, useSelectContext } from "../ui/select";
import { add } from "date-fns";
import { cn } from "~/lib/utils";

type Preview = { startDate: Date; endDate: Date } | undefined;

export const DayOption = memo(function DayOption(props: {
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
      className={{ base: "gap-1.5 pl-0 pr-5" }}
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
