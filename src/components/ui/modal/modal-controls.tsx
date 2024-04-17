import { memo } from "react";
import { cn } from "~/lib/utils";

export const ModalControls = memo(function ModalControls({
  className,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex justify-end gap-3 bg-gray-50 px-6 py-3 text-sm font-medium dark:bg-gray-800",
        className,
      )}
      {...props}
    />
  );
});
