import { cn } from "@/lib/utils";

type DividerProps = {
  orientation?: "horizontal" | "vertical";
  gradient?: boolean;
  className?: string;
};

export default function Divider({ orientation = "horizontal", gradient, className }: DividerProps) {
  return (
    <div
      className={cn(
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        gradient
          ? orientation === "horizontal"
            ? "bg-gradient-to-r from-transparent via-gray-200 to-transparent"
            : "bg-gradient-to-b from-transparent via-gray-200 to-transparent"
          : "bg-gray-200 dark:bg-gray-600",
        className,
      )}
    />
  );
}
