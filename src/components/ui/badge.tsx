import { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const BadgeVariants = cva("flex animate-popUp place-content-center items-center font-inter", {
  variants: {
    variant: {
      default: "bg-red-500 fill-white text-white",
      primary: "bg-kolumblue-500 fill-white text-white",
      success: "bg-green-500 fill-white text-white",
      warning: "bg-orange-500 fill-white text-white",
      primaryWithBorder:
        "border-[0.5px] border-kolumblue-300 bg-kolumblue-100 fill-kolumblue-500 text-kolumblue-500",
      successWithBorder:
        "border-[0.5px] border-green-300 bg-green-100 fill-green-500 text-green-500",
      warningWithBorder:
        "border-[0.5px] border-orange-300 bg-orange-100 fill-orange-500 text-orange-500",
      dangerWithBorder: "border-[0.5px] border-red-300 bg-red-100 fill-red-500 text-red-500",
      unset: null,
    },
    placement: {
      topRight: "absolute -right-2 -top-2",
      topLeft: "absolute -left-2 -top-2",
      bottomRight: "absolute -bottom-2 -right-2",
      bottomLeft: "absolute -bottom-2 -left-2",
      unset: null,
    },
    outline: {
      true: "border-2 border-white",
      false: null,
    },
  },
  defaultVariants: {
    variant: "default",
    placement: "topRight",
    outline: false,
  },
});
const BadgeDependedVariants = cva(null, {
  variants: {
    size: {
      md: "px-2 py-1 text-xs font-semibold",
      lg: "px-3 py-1 text-sm font-medium",
      mdOneChar: "h-6 min-h-6 w-6 min-w-6 text-xs font-semibold",
      lgOneChar: "h-7 min-h-7 w-7 min-w-7 text-sm font-medium",
      unset: null,
    },
    shape: {
      pill: "rounded-full",
      square: "rounded-md", // handled by compoundVariants
      unset: null,
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
  content?: React.ReactNode | string | number;
  size?: "md" | "lg" | "unset";
  shape?: "pill" | "square" | "unset";
  forceSquare?: boolean;
  className?: string;
  wrapperClassName?: string;
  children?: React.ReactNode;
};
export const Badge = memo(function Badge({
  content,
  placement,
  variant,
  size = "md",
  shape = "pill",
  outline,
  forceSquare,
  className,
  wrapperClassName,
  children,
}: BadgeProps) {
  if (!content) return children ?? null;
  const isOneChar = forceSquare ?? String(content).length === 1;

  const badge = (
    <span
      className={cn(
        BadgeVariants({ variant, placement, outline }),
        BadgeDependedVariants({
          size: size === "unset" ? "unset" : isOneChar ? `${size}OneChar` : size,
          shape,
        }),
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
});
