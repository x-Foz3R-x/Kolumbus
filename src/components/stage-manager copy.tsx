"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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

export default function StageManager2({ stages, gap, debug, style, className }: Props) {
  const [currentStage, setCurrentStage] = useState(0);

  const nextStage = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage((stage) => stage + 1);
    }
  };
  const prevStage = () => {
    if (currentStage > 0) {
      setCurrentStage((stage) => stage - 1);
    }
  };

  return (
    <>
      <div style={style} className={cn("w-full overflow-y-clip", className)}>
        {stages.map((stage, index) => {
          const isActive = currentStage === index;
          const movementDirection = currentStage < index ? "up" : "down";

          const rotate = isActive ? "0deg" : `${movementDirection === "up" ? "-" : ""}90deg`;
          const translateY =
            isActive || movementDirection === "down"
              ? "0px"
              : "prevStageHeight" in stage && stage.prevStageHeight
                ? `${stage.prevStageHeight + (gap ?? 16)}px`
                : "0px";

          return (
            <motion.div
              key={index}
              initial={{
                opacity: isActive ? 1 : 0,
                scaleX: isActive ? 1 : 0.85,
                height: isActive ? "auto" : "0",
                rotateX: isActive ? "0deg" : rotate,
                y: translateY,
              }}
              animate={{
                opacity: isActive ? 1 : 0,
                scaleX: isActive ? 1 : 0.85,
                height: isActive ? "auto" : "0",
                rotateX: isActive ? "0deg" : rotate,
                y: translateY,
              }}
              transition={{
                ease: EASING.easeInOut,
                duration: 0.7,
                opacity: { ease: EASING.easeInOut, duration: 0.4, delay: isActive ? 0 : 0.3 },
              }}
              className={cn(
                movementDirection === "up" ? "origin-bottom" : "origin-top",
                stage.className,
              )}
            >
              {stage.children({ nextStage, prevStage })}
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
