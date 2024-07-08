import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

type Props = {
  isHovered: boolean;
  initial: { scale?: number; rotate?: number; x: number; y: number };
  animate: { x: number; y: number };
  bounce: number;
  damping: number;
  className?: string;
  children: React.ReactNode;
};
export default function Spring({
  isHovered,
  initial,
  animate,
  bounce,
  damping,
  className,
  children,
}: Props) {
  return (
    <motion.div
      initial={initial}
      animate={isHovered ? { scale: 1, rotate: 0, ...animate } : initial}
      transition={{ type: "spring", bounce, damping }}
      className={cn("pointer-events-none absolute", className, isHovered && "animate-none")}
    >
      {children}
    </motion.div>
  );
}
