import { memo } from "react";
import { SelectOption } from "../ui/select";

const YearOption = memo(function YearOption(props: { year: number; onClick: () => void }) {
  return (
    <SelectOption
      label={props.year.toString()}
      onClick={props.onClick}
      size="sm"
      className={{ base: "h-[30px] px-4", selected: "font-semibold text-kolumblue-500" }}
    >
      {props.year}
    </SelectOption>
  );
});

export default YearOption;
