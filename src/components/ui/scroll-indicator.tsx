"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";

import { useOverflowObserver } from "~/hooks/use-overflow-observer";
import { EASING } from "~/lib/motion";
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
  vertical?: boolean;
  disable?: boolean;
};
/**
 * ScrollIndicator provides a visual indication of overflow.
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
  vertical,
  disable,
}: ScrollIndicatorProps) {
  const overflow = useOverflowObserver(scrollRef, disable);

  const customStyles = useMemo(
    () =>
      typeof className === "object"
        ? { start: cn(className.both, className.start), end: cn(className.both, className.end) }
        : { start: className, end: className },
    [className],
  );
  const startStyle = useMemo(
    () =>
      vertical
        ? { top, insetInline: insetX, height: size, zIndex }
        : { left, insetBlock: insetY, width: size, zIndex },
    [vertical, top, insetX, insetY, size, zIndex, left],
  );
  const endStyle = useMemo(
    () =>
      vertical
        ? { bottom, insetInline: insetX, height: size, zIndex }
        : { right, insetBlock: insetY, width: size, zIndex },
    [vertical, bottom, insetX, insetY, size, zIndex, right],
  );

  if (vertical ? !overflow.top && !overflow.bottom : !overflow.left && !overflow.right) return null;

  return (
    <>
      <motion.span
        aria-hidden
        style={startStyle}
        className={cn(
          "pointer-events-none absolute select-none from-white to-transparent dark:from-gray-800",
          vertical ? "bg-gradient-to-b" : "bg-gradient-to-r",
          customStyles.start,
        )}
        animate={{ opacity: (vertical ? overflow.top : overflow.left) ? 1 : 0 }}
        transition={{ duration: 0.15, ease: EASING.easeIn }}
      />
      <motion.span
        aria-hidden
        style={endStyle}
        className={cn(
          "pointer-events-none absolute select-none from-white to-transparent dark:from-gray-800",
          vertical ? "bg-gradient-to-t" : "bg-gradient-to-l",
          customStyles.end,
        )}
        animate={{ opacity: (vertical ? overflow.bottom : overflow.right) ? 1 : 0 }}
        transition={{ duration: 0.15, ease: EASING.easeIn }}
      />
    </>
  );
});
