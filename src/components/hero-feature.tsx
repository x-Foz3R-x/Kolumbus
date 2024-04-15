"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { add } from "date-fns";

import { EVENT_IMG_FALLBACK } from "@/lib/config";
import { cn } from "@/lib/utils";

import { Calendar } from "./calendar";
import { ScrollIndicator } from "./ui";

type Event = { name: string; photo: string };
const HERO_EVENTS: Event[] = [
  {
    name: "Warsaw",
    photo:
      "AWU5eFgaD6KV7jk0Opv1E3hcyFqVq1MstecRDcie0v6oifKWR7ShZgY0AdQTxy5-JnFYzot9HmlLenXcF8oNo6JVDb5fjE2FFvm6MxVz-xV7_PPejY_tH3hxMWnMD4ngBvIGaa1WW64y2pZEOQtjPXIaSX1EE0DWtwdck7_QdOOHmS1iBiNa",
  },
  {
    name: "Helsinki",
    photo:
      "ATplDJamwMaLHGiaMZgk3BOlZxrAwlvPNmbqVOUUCmQQowUK5jlcNP5EETn7hz7fJ67oRFlXQIw_6Rb8IVbZKR-sk5oh6KtxNtvKk4RaQKeRyONqYslwPUpT_aWXcC63EE8GxwL_mLx-dJmG0cT9o2__2k6XmahdI4WAES-eNLHWmIKSupEz",
  },
  {
    name: "Berlin",
    photo:
      "ATplDJZ4E6FfheiwWrQ67ALBiDv5fRZ9NF5IvI6zWShOPC3dFZjW2_X10l_Vj9QbyKGzLRnfNoYCM3rfgHJo89kpYMXJQWX_VvQ6Fbme3a0xOJU6pomepRgNvTnZupCkqgyZYoGb0ApJ51AWR-vOBd9MABjhftVnJ5h2n_EcwHJabNPFN2VK",
  },
];

export default function HeroFeature({ className }: { className?: string }) {
  const [isWithinArea, setIsWithinArea] = useState(false);

  const handleMouseEnter = useCallback(() => setIsWithinArea(true), []);
  const handleMouseLeave = useCallback(() => setIsWithinArea(false), []);

  return (
    <div className={cn("relative w-[500px] font-inter", className)}>
      <div
        id="activator"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="absolute z-10 h-screen w-full -translate-y-1/2"
      />

      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 0.9, rotate: -6, x: 30, y: -260 }}
        animate={{ x: 0, y: -198 }}
        bounce={0.2}
        damping={10}
        className="animate-[levitate_10s_ease_infinite]"
      >
        <Calendar
          date={add(new Date(), { days: -1 })}
          header="Yesterday"
          className={{
            header: "rounded-t-xl",
            body: isWithinArea ? "rounded-none duration-500 ease-kolumb-flow" : "rounded-b-xl duration-500 ease-kolumb-flow",
          }}
        />
      </Spring>

      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 1.1, rotate: 12, x: 390, y: -90 }}
        animate={{ x: 0, y: -66 }}
        bounce={0.8}
        damping={13}
        className="animate-[levitate_12s_ease_infinite_reverse]"
      >
        <Calendar
          date={new Date()}
          header="Today"
          className={{
            header: isWithinArea ? "duration-500 ease-kolumb-flow" : "rounded-t-xl duration-500 ease-kolumb-flow",
            body: isWithinArea ? "duration-500 ease-kolumb-flow" : "rounded-b-xl duration-500 ease-kolumb-flow",
          }}
        />
      </Spring>

      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 1.05, rotate: 3, x: 130, y: 180 }}
        animate={{ x: 0, y: 66 }}
        bounce={0.5}
        damping={11}
        className="animate-[levitate_13s_ease_infinite]"
      >
        <Calendar
          date={add(new Date(), { days: 1 })}
          header="Tomorrow"
          className={{
            header: isWithinArea ? "duration-500 ease-kolumb-flow" : "rounded-t-xl duration-500 ease-kolumb-flow",
            body: isWithinArea ? "duration-500 ease-kolumb-flow" : "rounded-b-xl duration-500 ease-kolumb-flow",
          }}
        />
      </Spring>

      <Spring
        isHovered={isWithinArea}
        initial={{ rotate: -27, x: 300, y: 240 }}
        animate={{ x: 0, y: 198 }}
        bounce={0.6}
        damping={13}
        className="animate-[levitate_13s_ease_infinite]"
      >
        <div
          className={cn(
            "flex h-5 w-32 items-center justify-center rounded-xl bg-kolumblue-500 text-xs font-medium text-kolumblue-200 shadow-xl duration-500 ease-kolumb-flow",
            isWithinArea && "rounded-t-none",
          )}
        >
          End of Trip
        </div>
      </Spring>

      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 0.94, rotate: 15, x: 280, y: 50 }}
        animate={{ x: 148, y: -46 }}
        bounce={0.6}
        damping={13}
        className="animate-[levitate_12s_ease_infinite_reverse]"
      >
        <Event event={HERO_EVENTS[0]} />
      </Spring>
      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 1.1, rotate: -22, x: 15, y: 50 }}
        animate={{ x: 148, y: -178 }}
        bounce={0.6}
        damping={12}
        className="animate-[levitate_10s_ease_infinite]"
      >
        <Event event={HERO_EVENTS[1]} />
      </Spring>
      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 1.03, rotate: 23, x: 208, y: -176 }}
        animate={{ x: 148, y: 86 }}
        bounce={0.3}
        damping={10}
        className="animate-[levitate_13s_ease_infinite]"
      >
        <Event event={HERO_EVENTS[2]} />
      </Spring>
    </div>
  );
}

function Event({ event, className }: { event: Event; className?: string }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={cn(
        "absolute flex h-28 w-40 flex-col overflow-hidden rounded-lg border-2 border-white bg-white shadow-borderXL",
        className,
      )}
    >
      {/* Image */}
      <div className="relative h-[82px] flex-shrink-0">
        <Image
          src={`${event?.photo ? `/api/get-google-image?photoRef=${event.photo}&width=156&height=82` : EVENT_IMG_FALLBACK}`}
          alt="Event Image"
          className="object-cover object-center"
          sizes="156px"
          priority
          fill
        />
      </div>

      {/* Name */}
      <div className="relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-900">
        <div ref={scrollRef} className="w-full select-none">
          {event.name}
          <ScrollIndicator scrollRef={scrollRef} />
        </div>
      </div>
    </div>
  );
}

type SpringProps = {
  isHovered: boolean;
  initial: { scale?: number; rotate?: number; x: number; y: number };
  animate: { x: number; y: number };
  bounce: number;
  damping: number;
  className?: string;
  children: React.ReactNode;
};
function Spring({ isHovered, initial, animate, bounce, damping, className, children }: SpringProps) {
  return (
    <motion.div
      initial={initial}
      animate={isHovered ? { scale: 1, rotate: 0, ...animate } : initial}
      transition={{ type: "spring", bounce, damping }}
      className={cn("absolute", className, isHovered && "animate-none")}
    >
      {children}
    </motion.div>
  );
}
