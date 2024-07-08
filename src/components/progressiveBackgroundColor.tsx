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
type EdgeUnit = `${number}${SupportedRangeUnit}`;
type NamedEdges = "start" | "end" | "center";
type Edge = NamedEdges | EdgeUnit;
type Intersection = `${Edge} ${Edge}`;
type scrollOffset = Array<Edge | Intersection>;

type ProgressiveBackgroundColorProps = {
  /** Array of RGB color values to transition between */
  colors: [number, number, number][];
  scrollOffset?: scrollOffset;
  style?: MotionStyle;
  className?: string;
  children?: React.ReactNode;
};
export default function ProgressiveBackgroundColor({
  colors,
  scrollOffset = ["start start", "end end"],
  style,
  className,
  children,
}: ProgressiveBackgroundColorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: scrollOffset });

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
    <div ref={ref} className="relative">
      <motion.div style={{ backgroundColor: progress, ...style }} className={className}>
        {children}
      </motion.div>
    </div>
  );
}
