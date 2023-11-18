"use client";

import { forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { HTMLMotionProps, TargetAndTransition, VariantLabels, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ButtonVariants = cva("group peer relative flex select-none items-center outline-0", {
  variants: {
    variant: {
      default: "bg-gray-100 shadow-button focus-visible:shadow-focus",
      appear: "bg-transparent duration-300 ease-kolumb-flow focus-visible:shadow-focus",
      scale:
        "bg-transparent before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:opacity-0 before:shadow-button before:duration-300 before:ease-kolumb-flow before:hover:scale-100 before:hover:opacity-100 before:focus-visible:scale-100 before:focus-visible:opacity-100",
      button:
        "rounded-xl border-b-[3px] border-gray-200 bg-gray-100 shadow-button duration-200 ease-kolumb-flow focus-visible:shadow-focus active:border-b",
      disabled: "pointer-events-none opacity-40 focus-visible:shadow-focus",
      unstyled: "",
    },
    size: {
      default: "rounded-lg px-3 py-1.5 text-sm before:rounded-lg",
      sm: "rounded-md px-2.5 py-1 text-xs before:rounded-md",
      lg: "rounded-xl px-4 py-2 text-base before:rounded-xl",
      icon: "rounded-lg p-1.5 text-base before:rounded-lg",
      unstyled: "",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
type ButtonProps = HTMLMotionProps<"button"> &
  VariantProps<typeof ButtonVariants> & {
    whileTap?: VariantLabels | TargetAndTransition | undefined;
    className?: string;
    animatePress?: boolean;
    children?: React.ReactNode;
  };
/**
 * @property variant - Variant of the button: "default", "appear", "scale", "button", "disabled", "unstyled".
 * @property size - Size of the button: "default", "sm", "lg", "icon", "unstyled".
 * @property whileTap - On tap animation.
 * @property shift - Shift to right animation flag.
 * @property animatePress - Press animation flag.
 * @property className - Additional CSS classes.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, whileTap, className, animatePress = false, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(ButtonVariants({ variant, size, className }))}
        {...(!animatePress ? { whileTap } : { whileTap: { scale: 0.94 } })}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";

export default Button;
