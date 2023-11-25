import { useEffect, useRef, useState } from "react";
import { Arrow, Container, Flip, Motion, Offset, Placement, Popover, Position } from "./popover";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  triggerRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placement?: Placement;
  container?: Container;
  position?: { x: number; y: number };
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
  const popoverRef = useRef<HTMLDivElement>(null);

  const arrowStyles = {
    arrow: cn("rounded-sm bg-gray-800", arrow.className?.arrow),
    backdrop: cn("shadow-borderXLDark rounded-sm", arrow.className?.backdrop),
  };

  const extensions = position
    ? [Position(position.x, position.y), Motion(TRANSITION.fade)]
    : [Flip(), Offset(offset), Arrow(arrow.size, arrowStyles)];

  return (
    <Popover
      popoverRef={popoverRef}
      triggerRef={triggerRef}
      isOpen={isOpen}
      setOpen={setOpen}
      placement={placement}
      container={container}
      extensions={extensions}
      className="pointer-events-none"
    >
      <div className={cn("shadow-borderXLDark pointer-events-none max-w-xs rounded bg-gray-700 px-1 py-0.5 text-gray-200", className)}>
        {children}
      </div>
    </Popover>
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
 *   - handleMouseLeave: A function to handle mouse leave event.
 *   - handleMouseMove: A function to handle mouse move event.
 *
 * @example
 * const [isOpen, setOpen, position, handleMouseEnter, handleMouseLeave, handleMouseMove] = useTooltip(500);
 */
export function useTooltip(delay: number) {
  const [isOpen, setOpen] = useState(false);
  const [position, setTooltipPosition] = useState({ x: 0, y: 0 });

  let showTimeout: NodeJS.Timeout | null = null;
  let moveTimeout: NodeJS.Timeout | null = null;

  const handleMouseEnter = () => {
    if (showTimeout) clearTimeout(showTimeout);

    showTimeout = setTimeout(() => setOpen(true), delay);
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (moveTimeout) clearTimeout(moveTimeout);

    moveTimeout = setTimeout(() => setTooltipPosition({ x: event.clientY + 18, y: event.clientX }), 350);
  };
  const handleMouseLeave = () => {
    if (showTimeout) clearTimeout(showTimeout);
    if (moveTimeout) clearTimeout(moveTimeout);

    setOpen(false);
  };

  // Clear the timeouts on component unmount
  useEffect(() => {
    return () => {
      if (showTimeout) clearTimeout(showTimeout);
      if (moveTimeout) clearTimeout(moveTimeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { isOpen, setOpen, position, handleMouseEnter, handleMouseLeave, handleMouseMove };
}
