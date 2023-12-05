import { useEffect, useRef, useState } from "react";
import { Arrow, Container, Flip, Motion, Offset, Placement, Popover, Position, Prevent } from "./popover";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";
import Button, { Props as ButtonProps } from "./button";

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
  arrow = { size: 12 },
  className,
  children,
}: Props) {
  const popoverRef = useRef(null);
  const arrowStyles = {
    arrow: cn("rounded-sm bg-gray-800", arrow.className?.arrow),
    backdrop: cn("rounded-sm shadow-borderXLDark", arrow.className?.backdrop),
  };

  return (
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
      <div className={cn("pointer-events-none max-w-xs rounded-md bg-gray-800 px-1.5 py-1 text-gray-200 shadow-borderXLDark", className)}>
        {children}
      </div>
    </Popover>
  );
}

type TooltipTriggerProps = {
  placement?: Placement;
  container?: Container;
  offset?: number;
  arrow?: { size: number; className?: { arrow?: string; backdrop?: string } };
  className?: string;
  buttonProps?: ButtonProps;
  children?: React.ReactNode;
};
/**
 * Tooltip trigger component.
 *
 * @param button - The button props.
 * @param tooltip - The tooltip props.
 * @returns A tooltip trigger component.
 *
 * @example
 * <TooltipTrigger
 *   button={{ children: "Tooltip" }}
 *   tooltip={{ children: "Tooltip content" }}
 * />
 */
export function TooltipTrigger({ buttonProps, ...tooltip }: TooltipTriggerProps) {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (buttonProps?.onClick) buttonProps.onClick(e);
    setOpen(!isOpen);
  };
  const onMouseEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (buttonProps?.onMouseEnter) buttonProps.onMouseEnter(e);
    setOpen(true);
  };
  const onMouseLeave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (buttonProps?.onMouseLeave) buttonProps.onMouseLeave(e);
    setOpen(false);
  };

  return (
    <>
      <Button ref={ref} {...buttonProps} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
      <Tooltip triggerRef={ref} isOpen={isOpen} setOpen={setOpen} {...tooltip} />
    </>
  );
}

/**
 * Custom hook for managing tooltip behavior aligned to mouse position.
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
 * const {isOpen, setOpen, position, handleMouseEnter, handleMouseMove, handleMouseLeave} = useTooltip();
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
