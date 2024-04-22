import { cn } from "~/lib/utils";
import type { MemberPermissions } from "~/types";

export default function PermissionCheckbox(props: {
  permission: keyof MemberPermissions;
  onChange: (permission: keyof MemberPermissions, checked: boolean) => void;
  isChecked: boolean;
}) {
  return (
    <label
      htmlFor={props.permission}
      className={cn(
        "flex w-52 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2",
        props.isChecked && "border-kolumblue-200 bg-kolumblue-100",
      )}
    >
      <input
        id={props.permission}
        type="checkbox"
        checked={props.isChecked}
        onChange={(e) => props.onChange(props.permission, e.target.checked)}
        className="hidden"
      />
      {props.permission.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
    </label>
  );
}
