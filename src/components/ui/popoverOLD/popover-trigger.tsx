import { HTMLMotionProps, motion } from "framer-motion";
import { usePopoverContext } from "./popover-context";

export default function PopoverTrigger({ children, ...props }: { children: React.ReactNode } & HTMLMotionProps<"button">) {
  const { isOpen, triggerRef } = usePopoverContext();
  return (
    <motion.button ref={triggerRef} aria-expanded={isOpen} {...props}>
      {children}
    </motion.button>
  );
}
