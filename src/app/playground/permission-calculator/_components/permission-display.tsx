import { cn } from "~/lib/utils";
import type { MemberPermissions } from "~/types";

export default function PermissionDisplay(props: {
  permission: keyof MemberPermissions;
  isChecked: boolean;
}) {
  return (
    <div
      key={props.permission}
      className={cn(
        "w-52 rounded-md border px-3 py-2",
        props.isChecked ? "border-green-200 bg-green-100" : "border-red-200 bg-red-100",
      )}
    >
      {props.permission.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
      {": "}
      {props.isChecked ? "Yes" : "No"}
    </div>
  );
}
