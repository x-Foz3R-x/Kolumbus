import { cn } from "@/lib/utils";

type DividerProps = {
  orientation?: "horizontal" | "vertical";
  gradient?: boolean;
  className?: string;
};
export function Divider({ orientation = "horizontal", gradient, className }: DividerProps) {
  return (
    <div
      className={cn(
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        gradient
          ? orientation === "horizontal"
            ? "bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700"
            : "bg-gradient-to-b from-transparent via-gray-200 to-transparent dark:via-gray-700"
          : "bg-gray-200 dark:bg-gray-700",
        className,
      )}
    />
  );
}
