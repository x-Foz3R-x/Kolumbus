import { useEffect, useRef, useState } from "react";
import { Arrow, Container, Flip, Motion, Offset, Placement, Popover, Position, Prevent } from "./popover";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  triggerRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placement?: Placement;
  container?: Container;
  position?: { x: string | number; y: string | number; transformOrigin?: string };
  offset?: number;
  arrow?: { size: number; className?: { arrow?: string; backdrop?: string } };
  className?: string;
  children?: React.ReactNode;
};
export default function Tooltip({
  triggerRef,
  isOpen,
  setOpen,
  placement,
  container,
  position,
  offset = 6,
  arrow = { size: 10 },
  className,
  children,
}: Props) {
  const popoverRef = useRef(null);
  const arrowStyles = {
    arrow: cn("rounded-sm bg-gray-800", arrow.className?.arrow),
    backdrop: cn("rounded-sm shadow-borderXLDark", arrow.className?.backdrop),
  };

  return (
    isOpen && (
      <Popover
        popoverRef={popoverRef}
        triggerRef={triggerRef}
        isOpen={isOpen}
        setOpen={setOpen}
        placement={placement}
        strategy="fixed"
        container={container}
        extensions={
          position
            ? [Position(position.x, position.y, position.transformOrigin), Motion(TRANSITION.fade), Prevent({ pointer: true })]
            : [Flip(), Offset(offset), Arrow(arrow.size, arrowStyles), Prevent({ pointer: true })]
        }
      >
        <div className={cn("pointer-events-none max-w-xs rounded bg-gray-700 px-1 py-0.5 text-gray-200 shadow-borderXLDark", className)}>
          {children}
        </div>
      </Popover>
    )
  );
}

/**
 * Custom hook for managing tooltip behavior.
 *
 * @param delay - The delay in milliseconds before the tooltip is shown.
 * @returns An array containing the following values:
 *   - isOpen: A boolean indicating whether the tooltip is open or not.
 *   - setOpen: A function to set the tooltip open state.
 *   - position: An object representing the position of the tooltip.
 *   - handleMouseEnter: A function to handle mouse enter event.
 *   - handleMouseMove: A function to handle mouse move event.
 *   - handleMouseLeave: A function to handle mouse leave event.
 *
 * @example
 * const [isOpen, setOpen, position, handleMouseEnter, handleMouseMove, handleMouseLeave] = useTooltip();
 */
export function useTooltip(delay: number = 1000) {
  const [isOpen, setOpen] = useState(false);
  const [position, setTooltipPosition] = useState({ x: 0, y: 0 });

  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => setOpen(true), delay);
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    moveTimeoutRef.current = setTimeout(() => setTooltipPosition({ x: event.clientX, y: event.clientY + 18 }), 200);
  };
  const handleMouseLeave = () => {
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    setOpen(false);
  };

  // Clear the timeouts on component unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { isOpen, setOpen, position, handleMouseEnter, handleMouseMove, handleMouseLeave };
}
