import { motion } from "framer-motion";
import { EASING } from "~/lib/motion";
import { cn } from "~/lib/utils";

type InitialStage = { className?: string; children: React.ReactNode };
type Stage = { prevStageHeight: number; className?: string; children: React.ReactNode };

export default function StageManager(props: {
  stage: number;
  stages: [InitialStage, ...Stage[]];
  gap?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div style={props.style} className={cn("w-full overflow-y-clip", props.className)}>
      {props.stages.map((stage, index) => {
        const isActive = props.stage === index;
        const movementDirection = props.stage < index ? "up" : "down";

        const rotate = isActive ? "0deg" : `${movementDirection === "up" ? "-" : ""}90deg`;
        const translateY =
          isActive || movementDirection === "down"
            ? "0px"
            : "prevStageHeight" in stage && stage.prevStageHeight
              ? `${stage.prevStageHeight + (props?.gap ?? 16)}px`
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
            {stage.children}
          </motion.div>
        );
      })}
    </div>
  );
}
