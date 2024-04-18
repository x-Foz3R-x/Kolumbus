"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { add } from "date-fns";

import { cn } from "~/lib/utils";

import { Calendar } from "../../components/calendar";
import Event, { type Event as EventType } from "./event";

const HERO_EVENTS: EventType[] = [
  {
    name: "Warsaw",
    image:
      "AWU5eFgaD6KV7jk0Opv1E3hcyFqVq1MstecRDcie0v6oifKWR7ShZgY0AdQTxy5-JnFYzot9HmlLenXcF8oNo6JVDb5fjE2FFvm6MxVz-xV7_PPejY_tH3hxMWnMD4ngBvIGaa1WW64y2pZEOQtjPXIaSX1EE0DWtwdck7_QdOOHmS1iBiNa",
  },
  {
    name: "Helsinki",
    image:
      "ATplDJamwMaLHGiaMZgk3BOlZxrAwlvPNmbqVOUUCmQQowUK5jlcNP5EETn7hz7fJ67oRFlXQIw_6Rb8IVbZKR-sk5oh6KtxNtvKk4RaQKeRyONqYslwPUpT_aWXcC63EE8GxwL_mLx-dJmG0cT9o2__2k6XmahdI4WAES-eNLHWmIKSupEz",
  },
  {
    name: "Berlin",
    image:
      "ATplDJZ4E6FfheiwWrQ67ALBiDv5fRZ9NF5IvI6zWShOPC3dFZjW2_X10l_Vj9QbyKGzLRnfNoYCM3rfgHJo89kpYMXJQWX_VvQ6Fbme3a0xOJU6pomepRgNvTnZupCkqgyZYoGb0ApJ51AWR-vOBd9MABjhftVnJ5h2n_EcwHJabNPFN2VK",
  },
] as const;

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
            body: isWithinArea
              ? "rounded-none duration-500 ease-kolumb-flow"
              : "rounded-b-xl duration-500 ease-kolumb-flow",
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
            header: isWithinArea
              ? "duration-500 ease-kolumb-flow"
              : "rounded-t-xl duration-500 ease-kolumb-flow",
            body: isWithinArea
              ? "duration-500 ease-kolumb-flow"
              : "rounded-b-xl duration-500 ease-kolumb-flow",
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
            header: isWithinArea
              ? "duration-500 ease-kolumb-flow"
              : "rounded-t-xl duration-500 ease-kolumb-flow",
            body: isWithinArea
              ? "duration-500 ease-kolumb-flow"
              : "rounded-b-xl duration-500 ease-kolumb-flow",
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
        <Event event={HERO_EVENTS[0]!} />
      </Spring>
      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 1.1, rotate: -22, x: 15, y: 50 }}
        animate={{ x: 148, y: -178 }}
        bounce={0.6}
        damping={12}
        className="animate-[levitate_10s_ease_infinite]"
      >
        <Event event={HERO_EVENTS[1]!} />
      </Spring>
      <Spring
        isHovered={isWithinArea}
        initial={{ scale: 1.03, rotate: 23, x: 208, y: -176 }}
        animate={{ x: 148, y: 86 }}
        bounce={0.3}
        damping={10}
        className="animate-[levitate_13s_ease_infinite]"
      >
        <Event event={HERO_EVENTS[2]!} />
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
      className={cn("absolute", className, isHovered && "animate-none")}
    >
      {children}
    </motion.div>
  );
}
