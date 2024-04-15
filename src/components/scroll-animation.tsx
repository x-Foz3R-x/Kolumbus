"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionStyle } from "framer-motion";

type SupportedRangeUnit = "px" | "vw" | "vh" | "%";
type RangeUnit = `${number}${SupportedRangeUnit}`;
type NamedRanges = "start" | "end" | "center";
type Range = NamedRanges | RangeUnit;

type ScrollAnimationProps = {
  propertyName: keyof MotionStyle;
  target?: React.RefObject<HTMLElement> | "this";
  multiplier?: number;
  offset?: number;
  scrollRange?: Range;
  style?: MotionStyle;
  className?: string;
  children?: React.ReactNode;
};
export default function ScrollAnimation({
  propertyName,
  target,
  multiplier = 0,
  offset = 0,
  scrollRange = "end",
  style,
  className,
  children,
}: ScrollAnimationProps) {
  const thisRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: target === "this" ? thisRef : target, offset: [0, scrollRange] });
  const progress = useTransform(() => scrollYProgress.get() * multiplier + offset);

  return (
    <motion.div ref={thisRef} style={{ [propertyName]: progress, ...style }} className={className}>
      {children}
    </motion.div>
  );
}
