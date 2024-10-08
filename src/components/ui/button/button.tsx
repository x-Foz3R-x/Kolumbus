"use client";

import { forwardRef, useMemo } from "react";
import { AnimatePresence, HTMLMotionProps, TargetAndTransition, VariantLabels, motion } from "framer-motion";
import { FloatingArrow, FloatingPortal, Side, useMergeRefs } from "@floating-ui/react";
import { VariantProps } from "class-variance-authority";

import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

import { ButtonVariants } from ".";
import { Tooltip, TooltipProps, useTooltipContext } from "../tooltip";

export type ButtonProps = HTMLMotionProps<"button"> &
  VariantProps<typeof ButtonVariants> & {
    tooltip?: TooltipProps;
    whileTap?: VariantLabels | TargetAndTransition | undefined;
    className?: string;
    animatePress?: boolean;
    children?: React.ReactNode;
  };
/**
 * @property variant - Variant of the button.
 * @property size - Size of the button.
 * @property whileTap - On tap animation.
 * @property animatePress - Press animation flag.
 * @property className - Additional CSS classes.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { tooltip, variant, size, whileTap, className, animatePress = false, disabled, ...props },
  ref,
) {
  const buttonProps = {
    className: cn(ButtonVariants({ variant: disabled ? "disabled" : variant, size, className })),
    ...(!animatePress ? { whileTap } : { whileTap: { scale: 0.94 } }),
    ...props,
  };

  return !!tooltip ? (
    <Tooltip {...tooltip}>
      <TooltipButton ref={ref} tooltip={tooltip} buttonProps={buttonProps} />
    </Tooltip>
  ) : (
    <motion.button ref={ref} {...buttonProps} />
  );
});

type TooltipButtonProps = {
  tooltip: TooltipProps;
  buttonProps: ButtonProps;
};
const TooltipButton = forwardRef<HTMLButtonElement, TooltipButtonProps>(function TooltipButton({ tooltip, buttonProps }, propRef) {
  const data = useTooltipContext();
  const ref = useMergeRefs([data.refs.setReference, propRef]);
  tooltip.arrow = tooltip.arrow === true ? {} : tooltip.arrow;

  const variants = useMemo(() => {
    if (tooltip.animation === "fadeToPosition") {
      const placement = tooltip.placement ?? "top";
      return TRANSITION.fadeToPosition[placement.split("-")[0] as Side];
    }
    if (tooltip.animation) return TRANSITION[tooltip.animation];

    return TRANSITION.appear;
  }, [tooltip.animation, tooltip.placement]);

  return (
    <>
      <motion.button ref={ref} {...buttonProps} {...data.getReferenceProps()} />

      <AnimatePresence>
        {data.open && !tooltip?.disabled && (
          <FloatingPortal root={tooltip.rootSelector ? (document.querySelector(tooltip.rootSelector) as HTMLElement | null) : undefined}>
            <div ref={data.refs.setFloating} {...data.getFloatingProps({ style: { ...data.floatingStyles, zIndex: tooltip.zIndex } })}>
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                className={cn("rounded-md bg-gray-800 px-2 py-0.5 text-sm tracking-tight text-white", tooltip.className)}
              >
                {tooltip.children}

                {!!tooltip.arrow && (
                  <FloatingArrow
                    ref={data.arrowRef}
                    context={data.context}
                    width={tooltip.arrow.width ?? 12}
                    height={tooltip.arrow.height ?? 6}
                    tipRadius={tooltip.arrow.tipRadius ?? 3}
                    className={cn("fill-gray-800", tooltip.arrow.className)}
                  />
                )}
              </motion.div>
            </div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
});
