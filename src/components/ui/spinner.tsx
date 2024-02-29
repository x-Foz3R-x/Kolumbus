import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { memo } from "react";

const SpinnerVariants = cva("animate-spin text-gray-300", {
  variants: {
    size: {
      xs: "h-4 w-4",
      sm: "h-5 w-5",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-10 w-10",
      unset: null,
    },
  },
  defaultVariants: { size: "md" },
});

type SpinnerProps = VariantProps<typeof SpinnerVariants> & { className?: { spinnerBar?: string; spinnerValue?: string } };
export const Spinner = memo(function Spinner({ size, className }: SpinnerProps) {
  return (
    <svg className={SpinnerVariants({ size, className: className?.spinnerBar })} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" />
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="180"
        strokeDashoffset="135"
        className={cn("text-gray-900", className?.spinnerValue)}
      />
    </svg>
  );
});
