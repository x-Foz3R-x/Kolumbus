"use client";

import { forwardRef } from "react";
import { HTMLMotionProps, TargetAndTransition, VariantLabels, motion } from "framer-motion";
import { VariantProps } from "class-variance-authority";
import { ButtonVariants } from ".";
import { cn } from "@/lib/utils";

export type ButtonProps = HTMLMotionProps<"button"> &
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
 * @property animatePress - Press animation flag.
 * @property className - Additional CSS classes.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, whileTap, className, animatePress = false, disabled, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(ButtonVariants({ variant: disabled ? "disabled" : variant, size, className }))}
        {...(!animatePress ? { whileTap } : { whileTap: { scale: 0.94 } })}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";
