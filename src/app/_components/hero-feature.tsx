"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { add } from "date-fns";

import { cn } from "~/lib/utils";

import { DayCalendar } from "../../components/day-calendar";
import Event from "./event";
import useRandomTrip from "~/hooks/use-random-trip";
import type { ActivityEventSchema, EventSchema } from "~/lib/types";

export default function HeroFeature({ className }: { className?: string }) {
  const { trip } = useRandomTrip();
  const [heroEvents, setHeroEvents] = useState<EventSchema[]>([]);

  const [isWithinArea, setIsWithinArea] = useState(false);
  const [scale, setScale] = useState(1);

  // Calculate scale based on window width
  useEffect(() => {
    const handleResize = () => {
      setScale(Math.max(1, window.innerWidth / 1800));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update hero events when random trip is complete
  useEffect(() => {
    if (trip.itinerary[0]?.events.length === 0) return;
    setHeroEvents(trip.itinerary.map((day) => day.events[0]!));
  }, [trip.itinerary]);

  return (
    <div
      onMouseEnter={() => setIsWithinArea(true)}
      onMouseLeave={() => setIsWithinArea(false)}
      style={{ scale }}
      className={cn(
        "group relative size-[38rem] origin-left pt-12 font-inter duration-250 ease-kolumb-flow",
        className,
      )}
    >
      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 0.9, rotate: -6, x: 30, y: -62 }}
        animate={{ x: 0, y: 0 }}
        bounce={0.2}
        damping={10}
        className="animate-[levitate_10s_ease_infinite]"
      >
        <DayCalendar
          header="Day 1"
          date={add(new Date(), { days: 1 })}
          className={{
            header: "rounded-t-xl",
            body: "overflow-clip rounded-b-xl duration-1000 ease-kolumb-flow group-hover:rounded-none",
          }}
        />
      </Spring>

      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 1.1, rotate: 12, x: 395, y: 80 }}
        animate={{ x: 0, y: 132 }}
        bounce={0.8}
        damping={13}
        className="animate-[levitate_12s_ease_infinite_reverse]"
      >
        <DayCalendar
          header="Day 2"
          date={add(new Date(), { days: 2 })}
          className={{
            header: "rounded-t-xl duration-1000 ease-kolumb-flow group-hover:rounded-none",
            body: "overflow-clip rounded-b-xl duration-1000 ease-kolumb-flow group-hover:rounded-none",
          }}
        />
      </Spring>

      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 1.05, rotate: 3, x: 130, y: 350 }}
        animate={{ x: 0, y: 264 }}
        bounce={0.5}
        damping={11}
        className="animate-[levitate_13s_ease_infinite]"
      >
        <DayCalendar
          header="Day 3"
          date={add(new Date(), { days: 3 })}
          className={{
            container: "rounded-xl",
            header: "rounded-t-xl duration-1000 ease-kolumb-flow group-hover:rounded-none",
            body: "overflow-clip rounded-b-xl duration-1000 ease-kolumb-flow group-hover:rounded-none",
          }}
        />
      </Spring>

      <Spring
        isHovered={isWithinArea}
        initial={{ rotate: -27, x: 350, y: 420 }}
        animate={{ x: 0, y: 396 }}
        bounce={0.6}
        damping={13}
        className="animate-[levitate_13s_ease_infinite]"
      >
        <div className="flex h-5 w-32 items-center justify-center rounded-xl bg-kolumblue-500 text-xs font-medium text-kolumblue-200 shadow-xl duration-1000 ease-kolumb-flow group-hover:rounded-t-none">
          End of Trip
        </div>
      </Spring>

      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 0.94, rotate: 15, x: 280, y: 210 }}
        animate={{ x: 148, y: 152 }}
        bounce={0.6}
        damping={13}
        className="animate-[levitate_12s_ease_infinite_reverse]"
      >
        <Event event={heroEvents[0] as ActivityEventSchema} />
      </Spring>
      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 1.1, rotate: -22, x: 15, y: 220 }}
        animate={{ x: 148, y: 20 }}
        bounce={0.6}
        damping={12}
        className="animate-[levitate_10s_ease_infinite]"
      >
        <Event event={heroEvents[1] as ActivityEventSchema} />
      </Spring>
      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 1.03, rotate: 23, x: 208, y: 0 }}
        animate={{ x: 148, y: 284 }}
        bounce={0.3}
        damping={10}
        className="animate-[levitate_13s_ease_infinite]"
      >
        <Event event={heroEvents[2] as ActivityEventSchema} />
      </Spring>
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
function Spring({
  isHovered,
  initial,
  animate,
  bounce,
  damping,
  className,
  children,
}: SpringProps) {
  return (
    <motion.div
      initial={initial}
      animate={isHovered ? { scale: 1, rotate: 0, ...animate } : initial}
      transition={{ type: "spring", bounce, damping }}
      className={cn("pointer-events-none absolute", className, isHovered && "animate-none")}
    >
      {children}
    </motion.div>
  );
}
