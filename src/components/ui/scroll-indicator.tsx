"use client";

import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useOverflowObserver } from "~/hooks/use-overflow-observer";
import { TRANSITION } from "~/lib/framer-motion";
import { cn } from "~/lib/utils";

type ScrollIndicatorProps = {
  scrollRef: React.MutableRefObject<HTMLElement | null>;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  insetX?: number;
  insetY?: number;
  size?: number;
  zIndex?: number;
  className?: { both?: string; start?: string; end?: string } | string;
  animate?: boolean;
  vertical?: boolean;
  disable?: boolean;
};
/**
 * ScrollIndicator is a React component that provides a visual indication of overflow.
 * It displays a fading effect at the start and/or end of a scrollable container when there's more content off-screen.
 */
export const ScrollIndicator = memo(function ScrollIndicator({
  scrollRef,
  top = 0,
  bottom = 0,
  left = 0,
  right = 0,
  insetX = 0,
  insetY = 0,
  size = 40,
  zIndex = 0,
  className,
  animate,
  vertical,
  disable,
}: ScrollIndicatorProps) {
  const overflow = useOverflowObserver(scrollRef, disable);

  const StartComponent = memo(function StartComponent() {
    const style = vertical
      ? { top, insetInline: insetX, height: size, zIndex }
      : { left, insetBlock: insetY, width: size, zIndex };
    const customStyles =
      typeof className === "object" ? cn(className.both, className.start) : className;

    return (
      <motion.span
        aria-hidden
        style={style}
        className={cn(
          "pointer-events-none absolute select-none from-white to-transparent dark:from-gray-900",
          vertical ? "bg-gradient-to-b" : "bg-gradient-to-r",
          customStyles,
        )}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={animate ? TRANSITION.fade : undefined}
      />
    );
  });

  const EndComponent = memo(function EndComponent() {
    const style = vertical
      ? { bottom, insetInline: insetX, height: size, zIndex }
      : { right, insetBlock: insetY, width: size, zIndex };
    const customStyles =
      typeof className === "object" ? cn(className.both, className.end) : className;

    return (
      <motion.span
        aria-hidden
        style={style}
        className={cn(
          "pointer-events-none absolute select-none from-white to-transparent dark:from-gray-900",
          vertical ? "bg-gradient-to-t" : "bg-gradient-to-l",
          customStyles,
        )}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={animate ? TRANSITION.fade : undefined}
      />
    );
  });

  if (vertical ? !overflow.top && !overflow.bottom : !overflow.left && !overflow.right) return null;

  return (
    <AnimatePresence>
      {(vertical ? overflow.top : overflow.left) && <StartComponent key={Math.random()} />}
      {(vertical ? overflow.bottom : overflow.right) && <EndComponent key={Math.random()} />}
    </AnimatePresence>
  );
});
