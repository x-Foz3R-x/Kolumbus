import { useRef, useState } from "react";

import type { Arrow, Offset, Prevent, Flip, Position, Motion, Backdrop, BackdropType } from "./types";
import { Variants } from "framer-motion";

export { Popover } from "./popover";
export type { Placement, Container } from "./types";

/**
 * Custom Hook for handling popovers.
 *
 * @returns An array of references and state values for managing popovers.
 *
 * @example
 * // Use the hook to get references and state values.
 * const [triggerRef, popoverRef, isOpen, setOpen, inputType, setInputType] = usePopover();
 */
export function usePopover() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [inputType, setInputType] = useState<"mouse" | "keyboard">("mouse");

  return [triggerRef, popoverRef, isOpen, setOpen, inputType, setInputType] as const;
}

// Extensions
export function Position(x: string | number, y: string | number, transformOrigin: string): Position {
  return { name: "position", x, y, transformOrigin };
}

export function Flip(): Flip {
  return { name: "flip" };
}
export function Offset(value: number): Offset {
  return { name: "offset", value };
}
export function Arrow(value: number, className?: { arrow?: string; backdrop?: string }): Arrow {
  return { name: "arrow", size: value, className };
}

export function Backdrop(type: BackdropType, className?: string): Backdrop {
  return { name: "backdrop", type, className };
}
export function Motion(transition: Variants | { top: Variants; bottom: Variants; left: Variants; right: Variants }): Motion {
  return { name: "motion", transition };
}
export function Prevent({ autofocus, closeTriggers, hide, scroll }: Omit<Prevent, "name">): Prevent {
  return { name: "prevent", autofocus, closeTriggers, hide, scroll };
}
