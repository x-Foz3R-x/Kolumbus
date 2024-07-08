"use client";

import { useEffect, useMemo, useState } from "react";
import { add } from "date-fns";

import useRandomTrip from "~/hooks/use-random-trip";
import { cn } from "~/lib/utils";
import type { ActivityEventSchema } from "~/lib/types";

import Event from "./event";
import Spring from "./spring";
import { DayCalendar } from "../../components/day-calendar";

export default function HeroFeature({ className }: { className?: string }) {
  const { trip } = useRandomTrip("by-day");
  const todayEvents = useMemo(() => trip.itinerary.map((day) => day.events[0]!), [trip.itinerary]);

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
        <Event event={todayEvents[0] as ActivityEventSchema} />
      </Spring>
      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 1.1, rotate: -22, x: 15, y: 220 }}
        animate={{ x: 148, y: 20 }}
        bounce={0.6}
        damping={12}
        className="animate-[levitate_10s_ease_infinite]"
      >
        <Event event={todayEvents[1] as ActivityEventSchema} />
      </Spring>
      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 1.03, rotate: 23, x: 208, y: 0 }}
        animate={{ x: 148, y: 284 }}
        bounce={0.3}
        damping={10}
        className="animate-[levitate_13s_ease_infinite]"
      >
        <Event event={todayEvents[2] as ActivityEventSchema} />
      </Spring>
    </div>
  );
}
