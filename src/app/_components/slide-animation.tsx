"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EASING } from "~/lib/motion";

export default function SlideAnimation(props: {
  direction: "in" | "out";
  threshold: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const [display, setDisplay] = useState(props.direction === "in" ? false : true);
  const [mounted, setMounted] = useState(false);

  // Toggle animation state based on scroll position and direction
  useEffect(() => {
    const handleScroll = () => {
      const isBeyondThreshold = window.scrollY > props.threshold;
      setDisplay(props.direction === "in" ? isBeyondThreshold : !isBeyondThreshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [props.direction, props.threshold]);

  useEffect(() => setMounted(true), []);

  return (
    <AnimatePresence>
      {display && (
        <motion.div
          initial={mounted ? "hidden" : "initial"}
          animate={{ translateY: 0 }}
          exit="hidden"
          variants={{
            initial: { translateY: props.direction === "in" ? 64 : 0 },
            hidden: { translateY: props.direction === "in" ? 64 : -64 },
          }}
          transition={{ ease: EASING.kolumbFlow, duration: 0.4 }}
          className={props.className}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
