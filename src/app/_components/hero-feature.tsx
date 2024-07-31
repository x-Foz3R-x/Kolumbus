"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import useRandomTrip from "~/hooks/use-random-trip";
import { cn } from "~/lib/utils";

import Event from "./event";
import { DayCalendar } from "~/components/day-calendar";

const PRESETS = [
  {
    day: {
      displacement: { x: 20, y: -30, scale: 0.9, rotate: -6 },
      transitionValues: [0.2, 10] as [number, number],
      className: "animate-[levitate_10s_ease_infinite]",
    },
    event: {
      displacement: { x: -133, y: 200, scale: 1.1, rotate: -22 },
      transitionValues: [0.6, 12] as [number, number],
      className: "animate-[levitate_10s_ease_infinite]",
    },
  },
  {
    day: {
      displacement: { x: 395, y: -52, scale: 1.1, rotate: 12 },
      transitionValues: [0.8, 13] as [number, number],
      className: "animate-[levitate_12s_ease_infinite_reverse]",
    },
    event: {
      displacement: { x: 132, y: 75, scale: 0.94, rotate: 15 },
      transitionValues: [0.6, 13] as [number, number],
      className: "animate-[levitate_12s_ease_infinite_reverse]",
    },
  },
  {
    day: {
      displacement: { x: 130, y: 86, scale: 1.05, rotate: 3 },
      transitionValues: [0.5, 11] as [number, number],
      className: "animate-[levitate_13s_ease_infinite]",
    },
    event: {
      displacement: { x: 60, y: -284, scale: 1.03, rotate: 23 },
      transitionValues: [0.3, 10] as [number, number],
      className: "animate-[levitate_13s_ease_infinite]",
    },
  },
] as const;

export default function HeroFeature(props: { disableAnimation?: boolean }) {
  const { trip } = useRandomTrip("by-day");

  const [isWithinArea, setIsWithinArea] = useState(false);
  const [scale, setScale] = useState(1);

  // Calculate scale based on window width
  useEffect(() => {
    const handleResize = () => {
      setScale(Math.min(Math.max(1, window.innerWidth / 1600), 1.25));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      onMouseEnter={() => setIsWithinArea(true)}
      onMouseLeave={() => setIsWithinArea(false)}
      className="group hidden font-inter md:block"
    >
      <ul
        style={{ width: 530 * scale, height: 416 * scale, scale }}
        className="flex origin-top-left flex-col"
      >
        {trip.itinerary.map((day, index) => (
          <motion.li key={day.id} className="flex gap-5">
            {/* Day Calendar */}
            <Displacement
              isHovered={isWithinArea}
              displacement={PRESETS[index]!.day.displacement}
              transitionValues={PRESETS[index]!.day.transitionValues}
              className={cn(
                PRESETS[index]!.day.className,
                props.disableAnimation && "animate-none",
              )}
            >
              <DayCalendar
                date={day.date}
                className={{
                  header: cn(
                    "rounded-t-xl",
                    index > 0 && "group-hover:rounded-none",
                    !props.disableAnimation && "duration-1000 ease-kolumb-flow",
                  ),
                  body: cn(
                    "overflow-clip rounded-b-xl group-hover:rounded-none",
                    !props.disableAnimation && "duration-1000 ease-kolumb-flow",
                  ),
                }}
                header={`Day ${index + 1}`}
              />
            </Displacement>

            {/* Event */}
            <Displacement
              isHovered={isWithinArea}
              displacement={PRESETS[index]!.event.displacement}
              transitionValues={PRESETS[index]!.event.transitionValues}
              className={cn(
                "z-10 mt-5 w-40",
                PRESETS[index]!.event.className,
                props.disableAnimation && "animate-none",
              )}
            >
              <Event event={day.places[0]} />
            </Displacement>
          </motion.li>
        ))}

        {/* End of Trip */}
        <Displacement
          isHovered={isWithinArea}
          displacement={{ x: 350, y: 24, rotate: -27 }}
          transitionValues={[0.6, 13]}
          className={cn(
            "w-32 animate-[levitate_13s_ease_infinite]",
            props.disableAnimation && "animate-none",
          )}
        >
          <div
            className={cn(
              "flex h-5 w-32 items-center justify-center rounded-xl bg-kolumblue-500 text-xs font-medium text-kolumblue-200 shadow-xl group-hover:rounded-t-none",
              !props.disableAnimation && "duration-1000 ease-kolumb-flow",
            )}
          >
            End of Trip
          </div>
        </Displacement>
      </ul>
    </div>
  );
}

function Displacement(props: {
  isHovered: boolean;
  displacement: { scale?: number; rotate?: number; x: number; y: number };
  transitionValues: [number, number];
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={props.displacement}
      animate={props.isHovered ? { x: 0, y: 0, scale: 1, rotate: 0 } : props.displacement}
      transition={{
        type: "spring",
        bounce: props.transitionValues[0],
        damping: props.transitionValues[1],
      }}
      style={props.style}
      className={cn(
        "pointer-events-none origin-top-left",
        props.className,
        props.isHovered && "animate-none",
      )}
    >
      {props.children}
    </motion.div>
  );
}
