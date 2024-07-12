"use client";

import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

export default function Carousel(props: {
  duration?: number;
  reverse?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const initialX = props.reverse ? "-100%" : "0";
  const animateX = props.reverse ? "0" : "-100%";

  return (
    <div className={cn("pointer-events-none flex select-none", props.className)}>
      <motion.div
        initial={{ x: initialX }}
        animate={{ x: animateX }}
        transition={{ duration: props.duration, repeat: Infinity, ease: "linear" }}
        className="px-d3"
      >
        {props.children}
      </motion.div>

      <motion.div
        initial={{ x: initialX }}
        animate={{ x: animateX }}
        transition={{ duration: props.duration, repeat: Infinity, ease: "linear" }}
        className="px-d3"
      >
        {props.children}
      </motion.div>

      <motion.div
        initial={{ x: initialX }}
        animate={{ x: animateX }}
        transition={{ duration: props.duration, repeat: Infinity, ease: "linear" }}
        className="px-d3"
      >
        {props.children}
      </motion.div>

      <motion.div
        initial={{ x: initialX }}
        animate={{ x: animateX }}
        transition={{ duration: props.duration, repeat: Infinity, ease: "linear" }}
        className="px-d3"
      >
        {props.children}
      </motion.div>
    </div>
  );
}
