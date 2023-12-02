"use client";

import { motion } from "framer-motion";

const marqueeVariants = {
  animate: {
    x: [0, 1600],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 20,
      },
    },
  },
};

export default function Marquee({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative h-48 w-screen max-w-full overflow-x-hidden">
      <motion.div className="absolute whitespace-nowrap" variants={marqueeVariants} animate="animate">
        <h1 className="mx-5 text-lg">{children}</h1>
      </motion.div>
    </div>
  );
}
