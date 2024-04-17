import { memo } from "react";
import { cn } from "~/lib/utils";

export const ModalText = memo(function ModalText({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <p className={cn("my-2 text-sm font-normal text-gray-500", className)}>{children}</p>;
});
