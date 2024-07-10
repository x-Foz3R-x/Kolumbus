"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { EASING } from "~/lib/motion";

import { Icons } from "~/components/ui";

export default function Logo() {
  const [isExpanded, setExpanded] = useState(true);
  const [isHovered, setHovered] = useState(false);

  // Toggle animation state based on scroll position and direction
  useEffect(() => {
    const handleScroll = () => {
      const isBeyondThreshold = window.scrollY > 100;
      setExpanded(!isBeyondThreshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Link
      href="/"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="absolute left-8 top-1.5 z-10 flex flex-shrink-0 items-center rounded-3xl border-2 border-double border-kolumblue-500 fill-kolumblue-500 p-0.5 text-2xl font-bold text-kolumblue-500 backdrop-blur-lg backdrop-saturate-[180%] duration-400 ease-kolumb-flow hover:rounded focus:rounded"
    >
      <Icons.logo className="h-[44px] flex-shrink-0" />
      <motion.div
        initial={{ width: "148px" }}
        animate={{ width: isExpanded || isHovered ? "148px" : "0px" }}
        transition={{ ease: EASING.kolumbFlow, duration: 0.4 }}
        className="mt-1 overflow-hidden"
      >
        <span className="px-2">KOLUMBUS</span>
      </motion.div>
    </Link>
  );
}
