"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EASING } from "~/lib/motion";

export default function SlideAnimation(props: {
  direction: "in" | "out";
  threshold: number;
  showOnMobile?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const [display, setDisplay] = useState(props.direction === "in" ? false : true);
  const [mounted, setMounted] = useState(false);

  // Toggle animation state based on scroll position and direction
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)");
    const updateDisplay = () => {
      const isBeyondThreshold = window.scrollY > props.threshold;
      const shouldDisplay = props.direction === "in" ? isBeyondThreshold : !isBeyondThreshold;
      setDisplay(shouldDisplay || (props.showOnMobile === true && mobile.matches));
    };
    updateDisplay();
    window.addEventListener("scroll", updateDisplay);
    mobile.addEventListener("change", updateDisplay);
    return () => {
      window.removeEventListener("scroll", updateDisplay);
      mobile.removeEventListener("change", updateDisplay);
    };
  }, [props.direction, props.threshold, props.showOnMobile]);

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
