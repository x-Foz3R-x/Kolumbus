"use client";
import { forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { HTMLMotionProps, TargetAndTransition, VariantLabels, motion } from "framer-motion";

const buttonVariants = cva("group/button relative flex select-none items-center outline-0", {
  variants: {
    variant: {
      default: "bg-gray-100 shadow-btn",
      appear: "bg-transparent duration-300 ease-kolumb-flow",
      scaleInOut:
        "bg-transparent before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:opacity-0 before:shadow-btn before:duration-300 before:ease-kolumb-flow",
      button: "rounded-xl border-b-[3px] border-gray-200 bg-gray-100 shadow-btn duration-200 ease-kolumb-flow active:border-b",
      disabled: "pointer-events-none opacity-40",
      unstyled: "",
    },
    size: {
      sm: "rounded-md px-2.5 py-1 text-xs before:rounded-md",
      default: "rounded-lg px-3 py-1.5 text-sm before:rounded-lg",
      lg: "rounded-xl px-4 py-2 text-base before:rounded-xl",
      icon: "rounded-lg p-1.5 text-base before:rounded-lg",
      unstyled: "",
    },
    hover: {
      none: "",
      scaleInOut: "hover:before:scale-100 hover:before:opacity-100",
      button: "hover:border-gray-300 hover:bg-gray-200",
    },
    focus: {
      none: "",
      transparent: "focus:before:scale-100 focus:before:opacity-100",
    },
    focusVisible: {
      default: "focus-visible:shadow-focus",
      scaleInOut: "focus-visible:before:scale-100 focus-visible:before:opacity-100",
      unstyled: "",
    },
  },
  defaultVariants: { variant: "default", size: "default", hover: "none", focus: "none", focusVisible: "default" },
});

type ButtonProps = HTMLMotionProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    whileHover?: VariantLabels | TargetAndTransition | undefined;
    whileTap?: VariantLabels | TargetAndTransition | undefined;
    shift?: boolean;
    animatePress?: boolean;
    className?: string;
    children?: React.ReactNode;
  };
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant, size, hover, focus, focusVisible, whileHover, whileTap, shift, animatePress = false, className, children, ...props },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={whileHover}
        className={cn(buttonVariants({ variant, size, hover, focus, focusVisible, className }))}
        {...(!animatePress ? { whileTap } : { whileTap: { scale: 0.94 } })}
        {...props}
      >
        {shift ? (
          <span
            className={cn(
              "duration-300 ease-kolumb-overflow",
              size === "sm" || size === "default"
                ? "group-hover/button:translate-x-1"
                : size === "lg" && "group-hover/button:translate-x-2",
            )}
          >
            {children}
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  },
);
Button.displayName = "Button";

export default Button;
