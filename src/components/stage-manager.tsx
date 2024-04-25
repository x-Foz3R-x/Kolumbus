"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASING } from "~/lib/motion";
import { cn } from "~/lib/utils";
import { Button } from "./ui";

type InitialStage = {
  className?: string;
  children: (props: { nextStage: () => void; disabled: boolean }) => React.ReactNode;
};
type Stage = {
  prevStageHeight: number;
  className?: string;
  children: (props: {
    nextStage: () => void;
    prevStage: () => void;
    disabled: boolean;
  }) => React.ReactNode;
};

type Props = {
  stages: [InitialStage, ...Stage[]];
  gap?: number;
  debug?: boolean;
  style?: React.CSSProperties;
  className?: string;
};
export default function StageManager({ stages, gap, debug, style, className }: Props) {
  const [currentStage, setCurrentStage] = useState(0);
  const [previousStage, setPreviousStage] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextStage = () => {
    if (currentStage < stages.length - 1) {
      setPreviousStage(currentStage);
      setIsTransitioning(true);
      setCurrentStage((stage) => stage + 1);
    }
  };
  const prevStage = () => {
    if (currentStage > 0) {
      setPreviousStage(currentStage);
      setIsTransitioning(true);
      setCurrentStage((stage) => stage - 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousStage(null);
    }, 700);
    return () => clearTimeout(timer);
  }, [currentStage]);

  return (
    <>
      <div style={style} className={cn("w-full", isTransitioning && "overflow-y-clip", className)}>
        {stages.map((stage, index) => {
          const isActive = currentStage === index;
          const moveDirection = currentStage < index ? "up" : "down";

          const rotate = isActive ? "0deg" : moveDirection === "up" ? "-90deg" : "90deg";
          let adjustedPosition = "0px";
          if (!isActive && moveDirection === "up" && "prevStageHeight" in stage) {
            // Adjust the position of non-initial, inactive stages moving upwards to prevent overlap with the previous stage.
            adjustedPosition = `${stage.prevStageHeight + (gap ?? 16)}px`;
          }

          const animation = {
            opacity: isActive ? 1 : 0,
            scaleX: isActive ? 1 : 0.85,
            height: isActive ? "auto" : "0",
            rotateX: isActive ? "0deg" : rotate,
            y: adjustedPosition,
          };

          return (
            <motion.div
              key={index}
              initial={animation}
              animate={animation}
              transition={{
                ease: EASING.easeInOut,
                duration: 0.7,
                opacity: { ease: EASING.easeInOut, duration: 0.4, delay: isActive ? 0 : 0.3 },
              }}
              className={cn(
                moveDirection === "up" ? "origin-bottom" : "origin-top",
                stage.className,
              )}
            >
              {index === currentStage && stage.children({ nextStage, prevStage, disabled: false })}
              {index === previousStage && stage.children({ nextStage, prevStage, disabled: true })}
            </motion.div>
          );
        })}
      </div>

      {debug && (
        <span className="flex w-full items-center justify-center gap-2 *:w-full">
          <Button onClick={prevStage}>{"<--"}</Button>
          <Button onClick={nextStage}>{"-->"}</Button>
        </span>
      )}
    </>
  );
}
