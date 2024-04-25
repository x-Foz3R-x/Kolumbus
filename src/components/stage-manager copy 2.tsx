"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASING } from "~/lib/motion";
import { cn } from "~/lib/utils";
import { Button } from "./ui";

type InitialStage = {
  className?: string;
  children: (props: { nextStage: () => void }) => React.ReactNode;
};
type Stage = {
  prevStageHeight: number;
  className?: string;
  children: (props: { nextStage: () => void; prevStage: () => void }) => React.ReactNode;
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
  const [previousStage, setPreviousStage] = useState(0);
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
    }, 700);
    return () => {
      clearTimeout(timer);
    };
  }, [currentStage]);

  // const getRotateAngle = (isActive: boolean, moveDirection: "up" | "down") => {
  //   if (isActive) return "0deg";
  //   return `${moveDirection === "up" ? "-" : ""}90deg`;
  // };
  const getAdjacentPosition = (
    stage: InitialStage | Stage,
    isActive: boolean,
    moveDirection: "up" | "down",
  ) => {
    if (isActive || moveDirection === "down") return "0px";
    if ("prevStageHeight" in stage) return `${stage.prevStageHeight + (gap ?? 16)}px`;
    return "0px";
  };

  return (
    <>
      <div style={style} className={cn("w-full", isTransitioning && "overflow-y-clip", className)}>
        <AnimatePresence>
          {stages.map((stage, index) => {
            if (index !== currentStage) {
              console.log("null it", index);
              return null;
            }

            const isActive = currentStage === index;

            let moveDirection: "up" | "down" = "up";
            // If the stage is active and the previous stage index is greater than
            // the current stage index, it means the stage transition is going downwards.
            if (isActive && previousStage > currentStage) moveDirection = "down";
            // If the stage is not active and the current stage index is greater than
            // the index of this non-active stage, it means the stage transition is going downwards.
            else if (currentStage > index) moveDirection = "down";

            // const rotateAngle = getRotateAngle(isActive, moveDirection);
            const adjustedPosition = getAdjacentPosition(stage, isActive, moveDirection);

            // const initialAnimation = isBecomingActive
            //   ? { opacity: 0, scaleX: 0.85, height: "0", rotateX: rotateAngle, y: adjustedPosition }
            //   : { opacity: 1, scaleX: 1, height: "auto", rotateX: "0deg", y: "0px" };

            return (
              <motion.div
                key={index}
                // initial={initialAnimation}
                // initial={{
                //   opacity: !isActive ? 1 : 0,
                //   scaleX: !isActive ? 1 : 0.85,
                //   height: !isActive ? "auto" : "0",
                //   rotateX: !isActive ? "0deg" : rotateAngle,
                //   y: adjustedPosition,
                // }}
                // initial={{
                //   opacity: isActive ? 1 : 0,
                //   scaleX: isActive ? 1 : 0.85,
                //   height: isActive ? "auto" : "0",
                //   rotateX: isActive ? "0deg" : rotateAngle,
                //   y: adjustedPosition,
                // }}
                initial={{
                  opacity: 0,
                  scaleX: 0.85,
                  height: "0",
                  rotateX: `${moveDirection === "up" ? "-" : ""}90deg`,
                  y: adjustedPosition,
                }}
                animate={{
                  opacity: 1,
                  scaleX: 1,
                  height: "auto",
                  rotateX: "0deg",
                  y: adjustedPosition,
                }}
                exit={{
                  opacity: 0,
                  scaleX: 0.85,
                  height: "0",
                  rotateX: `${moveDirection === "up" ? "-" : ""}90deg`,
                  y: adjustedPosition,
                }}
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
                {stage.children({ nextStage, prevStage })}
              </motion.div>
            );
          })}
        </AnimatePresence>
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
