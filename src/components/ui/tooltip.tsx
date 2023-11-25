import { useEffect, useRef, useState } from "react";
import { Arrow, Container, Flip, Offset, Placement, Popover } from "./popover";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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
  arrow = { size: 10 },
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
          arrow: cn("rounded-sm bg-white dark:bg-gray-800", arrow.className?.arrow),
          backdrop: cn("rounded-sm shadow-borderXL", arrow.className?.backdrop),
        }),
      ]}
    >
      <AnimatePresence>
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn("pointer-events-none rounded bg-white p-0.5 px-2 shadow-borderXL dark:bg-gray-800", className)}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Popover>
  );
}
