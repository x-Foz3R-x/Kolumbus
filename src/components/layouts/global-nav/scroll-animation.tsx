"use client";

import { motion, useScroll, useTransform, HTMLMotionProps } from "framer-motion";

type ScrollAnimationProps = HTMLMotionProps<"div"> & {
  propertyName: string;
  multiplier?: number;
  children?: React.ReactNode;
};
export function ScrollAnimation({ propertyName, multiplier = 0, style, children, ...props }: ScrollAnimationProps) {
  const { scrollYProgress } = useScroll({ offset: [0, "150px"] });
  const progress = useTransform(() => scrollYProgress.get() * (-1 - multiplier) + 2);

  return (
    <motion.div style={{ [propertyName]: progress, ...style }} {...props}>
      {children}
    </motion.div>
  );
}
