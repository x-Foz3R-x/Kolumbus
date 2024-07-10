"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import { cn } from "~/lib/utils";

type SupportedRangeUnit = "px" | "vw" | "vh" | "%";
type EdgeUnit = `${number}${SupportedRangeUnit}`;
type NamedEdges = "start" | "end" | "center";
type Edge = NamedEdges | EdgeUnit;
type Intersection = `${Edge} ${Edge}`;
type scrollOffset = Array<Edge | Intersection>;

type ScrollAnimationProps = {
  propertyName: keyof MotionStyle;
  target?: React.RefObject<HTMLElement> | "this";
  multiplier?: number;
  offset?: number;
  scrollOffset?: scrollOffset;
  style?: MotionStyle;
  className?: string;
  children?: React.ReactNode;
};
export default function ScrollAnimation({
  propertyName,
  target,
  multiplier = 0,
  offset = 0,
  scrollOffset = ["start start", "end end"],
  style,
  className,
  children,
}: ScrollAnimationProps) {
  const thisRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: target === "this" ? thisRef : target,
    offset: scrollOffset,
  });
  const progress = useTransform(() => scrollYProgress.get() * multiplier + offset);

  return (
    <motion.div
      ref={thisRef}
      style={{ [propertyName]: progress, ...style }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );
}
