import { useEffect, useRef, useState } from "react";
import { Arrow, Container, Flip, Offset, Placement, Popover } from "./popover";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { TRANSITION } from "@/lib/framer-motion";
import { parsePlacement } from "./popover/use-popover";

type Props = {
  triggerRef: React.RefObject<HTMLElement>;
  placement: Placement;
  container?: Container;
  offset?: number;
  arrow?: { size: number; className?: { arrow?: string; backdrop?: string } };
  delay?: number;
  className?: string;
  children?: React.ReactNode;
};
export default function Tooltip({
  triggerRef,
  placement,
  container,
  offset = 6,
  arrow = { size: 12 },
  delay = 500,
  className,
  children,
}: Props) {
  const [isOpen, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(timeoutId);
  }, [delay]);

  return (
    <Popover
      popoverRef={popoverRef}
      triggerRef={triggerRef}
      isOpen={isOpen}
      setOpen={setOpen}
      placement={placement}
      container={container}
      extensions={[
        Flip(),
        Offset(offset),
        Arrow(arrow.size, {
          arrow: cn("rounded-[3px] bg-white dark:bg-gray-800", arrow.className?.arrow),
          backdrop: cn("-z-20 rounded-[3px] shadow-borderXL", arrow.className?.backdrop),
        }),
      ]}
    >
      <AnimatePresence>
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={TRANSITION.fadeInOut[parsePlacement(placement)[0]]}
          className={cn("pointer-events-none rounded-md bg-white px-2 py-1 opacity-95 shadow-borderXL dark:bg-gray-800", className)}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Popover>
  );
}
