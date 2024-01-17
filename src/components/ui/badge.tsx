import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { memo } from "react";

const BadgeVariants = cva("animate-popUp flex place-content-center items-center font-inter", {
  variants: {
    variant: {
      default: "bg-red-500 fill-white text-white",
      primary: "bg-kolumblue-500 fill-white text-white",
      success: "bg-green-500 fill-white text-white",
      warning: "bg-orange-500 fill-white text-white",
      primaryWithBorder: "border border-kolumblue-300 bg-kolumblue-100 fill-kolumblue-500 text-kolumblue-500",
      successWithBorder: "border border-green-300 bg-green-100 fill-green-500 text-green-500",
      warningWithBorder: "border border-orange-300 bg-orange-100 fill-orange-500 text-orange-500",
      dangerWithBorder: "border border-red-300 bg-red-100 fill-red-500 text-red-500",
      unset: "",
    },
    placement: {
      topRight: "absolute -right-2 -top-2",
      topLeft: "absolute -left-2 -top-2",
      bottomRight: "absolute -bottom-2 -right-2",
      bottomLeft: "absolute -bottom-2 -left-2",
      inline: "",
    },
    outline: {
      true: "border-2 border-white",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    placement: "topRight",
    outline: false,
  },
});
const BadgeDependedVariants = cva("", {
  variants: {
    size: {
      md: "px-2 py-1 text-xs font-semibold",
      lg: "px-3 py-1 text-sm font-medium",
      mdOneChar: "h-6 min-h-6 w-6 min-w-6 text-xs font-semibold",
      lgOneChar: "h-7 min-h-7 w-7 min-w-7 text-sm font-medium",
      unset: "",
    },
    shape: {
      pill: "rounded-full",
      square: "rounded-md", // handled by compoundVariants
      unset: "",
    },
  },
  compoundVariants: [
    {
      size: ["md", "mdOneChar"],
      shape: "square",
      className: "rounded-md",
    },
    {
      size: ["lg", "lgOneChar"],
      shape: "square",
      className: "rounded-lg",
    },
  ],
  defaultVariants: {
    size: "md",
    shape: "pill",
  },
});

type BadgeProps = VariantProps<typeof BadgeVariants> & {
  content?: string | number | React.ReactNode;
  forceSquare?: true;
  size?: "md" | "lg" | "unset";
  shape?: "pill" | "square" | "unset";
  className?: string;
  wrapperClassName?: string;
  children?: React.ReactNode;
};
export const Badge = memo(
  ({
    content,
    forceSquare,
    variant,
    size = "md",
    shape = "pill",
    placement,
    outline,
    className,
    wrapperClassName,
    children,
  }: BadgeProps) => {
    if (!content) return children || null;
    const isOneChar = forceSquare || String(content).length === 1;

    const badge = (
      <span
        className={cn(
          BadgeVariants({ variant, placement, outline }),
          BadgeDependedVariants({ size: size === "unset" ? "unset" : isOneChar ? `${size}OneChar` : size, shape }),
          className,
        )}
      >
        {content}
      </span>
    );

    return children ? (
      <div className={cn("relative", wrapperClassName)}>
        {children}
        {badge}
      </div>
    ) : (
      badge
    );
  },
);
Badge.displayName = "Badge";
