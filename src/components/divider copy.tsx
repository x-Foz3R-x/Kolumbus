import { cn } from "@/lib/utils";

export const dotDivider = (className?: string) => {
  return cn("after:pointer-events-none after:inline after:select-none after:px-2 after:content-['·']", className);
};

type DividerProps =
  | {
      label: string;
      gradient?: boolean;
      className?: { divider?: string; label?: string };
    }
  | {
      orientation?: "horizontal" | "vertical";
      gradient?: boolean;
      className?: string;
    };

export function Divider(props: DividerProps) {
  if ("label" in props) {
    return (
      <div className="relative flex w-full items-center justify-center text-xs">
        <div
          id="divider"
          className={cn(
            "pointer-events-none absolute inset-x-0 h-px w-full select-none",
            props.gradient
              ? "bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700"
              : "bg-gray-200 dark:bg-gray-700",
            props?.className?.divider,
          )}
        />
        <span className={cn("relative bg-white px-2", props?.className?.label)}>{props.label}</span>
      </div>
    );
  }

  const orientation = props.orientation ?? "horizontal";

  return (
    <div
      id="divider"
      className={cn(
        "pointer-events-none select-none",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        props.gradient ? "bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700" : "bg-gray-200 dark:bg-gray-700",
        props.className,
      )}
    />
  );
}
