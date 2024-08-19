import { memo } from "react";
import { SelectOption } from "../ui/select";

const MonthOption = memo(function MonthOption(props: { month: string; onClick: () => void }) {
  return (
    <SelectOption
      label={props.month}
      onClick={props.onClick}
      size="sm"
      className={{ base: "h-[30px] px-4", selected: "font-semibold text-kolumblue-500" }}
    >
      {props.month}
    </SelectOption>
  );
});

export default MonthOption;
