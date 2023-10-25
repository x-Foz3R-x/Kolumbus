import { useMemo } from "react";
import { motion } from "framer-motion";
import { RemoveScroll } from "react-remove-scroll";

import { usePopoverContext } from "./popover-context";
import usePopover from "./use-popover";

import { useCloseTriggers } from "@/hooks/use-accessibility-features";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

type PopoverContentProps = {
  className?: { content?: string; backdrop?: string };
  children: React.ReactNode;
};
export default function PopoverContent({ className, children }: PopoverContentProps) {
  const { isOpen, setIsOpen, triggerRef, popoverRef, placement, container, arrow, modifiers } = usePopoverContext();

  const handleClose = () => {
    setTimeout(() => setIsOpen(false), 0);
  };
  useCloseTriggers(popoverRef, handleClose);

  const { popoverProps, motionProps, arrowContent, backdropContent } = usePopover({
    triggerRef,
    popoverRef,
    isOpen,
    placement,
    container,
    arrow,
    modifiers,
  });

  return (
    <RemoveScroll
      ref={popoverRef}
      enabled={modifiers.preventScroll && isOpen}
      className="absolute z-[100] min-h-fit min-w-fit appearance-none bg-transparent"
      {...popoverProps}
    >
      {backdropContent}
      <motion.div
        initial="initial"
        animate="enter"
        exit="exit"
        variants={TRANSITION.scaleSpring}
        className={cn(className?.content)}
        {...motionProps}
      >
        {arrowContent}
        {children}
      </motion.div>
    </RemoveScroll>
  );
}
