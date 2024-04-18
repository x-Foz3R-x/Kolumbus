import "~/styles/spinners.css";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const SpinnerVariants = cva("fill-gray-900 pointer-events-none select-none", {
  variants: {
    size: {
      xs: "h-4 w-4",
      sm: "h-5 w-5",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
      unset: null,
    },
  },
  defaultVariants: { size: "md" },
});

type SpinnerProps = VariantProps<typeof SpinnerVariants> & { className?: string };
export const Spinner = {
  /** To change color use fill property */
  default: ({ size, className }: SpinnerProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={cn(SpinnerVariants({ size, className }))}
      >
        <path
          d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
          className="spinner-animation"
        />
      </svg>
    );
  },
  /** To change color use fill property */
  background: ({ size, className }: SpinnerProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={cn(SpinnerVariants({ size, className }))}
      >
        <path
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
          opacity=".25"
        />
        <path
          d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
          className="spinner-animation"
        />
      </svg>
    );
  },
  /** To change color use stroke property */
  resize: ({ size, className }: SpinnerProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="#000"
        className={cn(SpinnerVariants({ size, className }), "spinner-resize-animation")}
      >
        <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" />
      </svg>
    );
  },
};
