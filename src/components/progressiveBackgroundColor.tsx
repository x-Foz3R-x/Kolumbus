"use client";

import { useRef } from "react";
import {
  motion,
  type MotionStyle,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

type SupportedRangeUnit = "px" | "vw" | "vh" | "%";
type RangeUnit = `${number}${SupportedRangeUnit}`;
type NamedRanges = "start" | "end" | "center";
type Range = NamedRanges | RangeUnit;

type ProgressiveBackgroundColorProps = {
  /** Array of RGB color values to transition between */
  colors: [number, number, number][];
  /** Range of scroll values to transition over, defaults to "end" */
  scrollRange?: Range;
  style?: MotionStyle;
  className?: string;
  children?: React.ReactNode;
};
export default function ProgressiveBackgroundColor({
  colors,
  scrollRange = "end",
  style,
  className,
  children,
}: ProgressiveBackgroundColorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: [0, scrollRange] });

  const division = Array.from({ length: colors.length }, (_, i) => (1 / colors.length) * i);

  // Calculate the color based on the progress
  const calculateColor = (colorIndex: number) => {
    const progress = scrollYProgress.get();

    let i = division.findIndex((d, i) => progress >= d && progress < division[i + 1]!);
    i = i === -1 ? colors.length - 1 : i;

    const difference =
      i + 1 < division.length
        ? (colors[i + 1]![colorIndex]! - colors[i]![colorIndex]!) * division.length
        : 0;
    return (progress - division[i]!) * difference + colors[i]![colorIndex]!;
  };

  const r = useTransform(() => calculateColor(0));
  const g = useTransform(() => calculateColor(1));
  const b = useTransform(() => calculateColor(2));

  const progress = useMotionTemplate`rgb(${r}, ${g}, ${b})`;

  return (
    <div ref={ref}>
      <motion.div style={{ backgroundColor: progress, ...style }} className={className}>
        {children}
      </motion.div>
    </div>
  );
}
