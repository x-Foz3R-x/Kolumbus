import { useMemo, useRef, useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  arrow,
  hide,
  useDelayGroup,
  useDelayGroupContext,
  useClientPoint,
} from "@floating-ui/react";
import { FlipOptions, OffsetOptions, Placement, ShiftOptions, UseFocusProps } from "@floating-ui/react";

import { TooltipContext } from "./tooltip-context";
import { TRANSITION } from "@/lib/framer-motion";

export type TooltipProps = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  placement?: Placement;
  offset?: OffsetOptions;
  shift?: ShiftOptions;
  flip?: FlipOptions;
  arrow?: { width?: number; height?: number; tipRadius?: number; className?: string; padding?: number } | true;
  focus?: UseFocusProps;
  animation?: keyof typeof TRANSITION;
  delay?: number | { open?: number; close?: number };
  zIndex?: number;
  className?: string;
  rootSelector?: string;
  followCursor?: boolean;
  mouseOnly?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};
export function Tooltip({
  open: controlledOpen,
  setOpen: setControlledOpen,
  placement = "top",
  offset: offsetOptions = 6,
  shift: shiftOptions = { padding: 6 },
  flip: flipOptions = { crossAxis: placement.includes("-"), fallbackAxisSideDirection: "start", padding: 6 },
  arrow: arrowOptions,
  focus: focusOptions,
  delay,
  followCursor = false,
  mouseOnly = false,
  children,
}: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const arrowRef = useRef(null);
  arrowOptions = arrowOptions === true ? {} : arrowOptions;

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  //#region Floating UI
  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetOptions),
      shift(shiftOptions),
      flip(flipOptions),
      arrow({ element: arrowRef, padding: arrowOptions?.padding ?? 4 }),
      hide(),
    ],
  });

  useDelayGroup(data.context, { id: data.context.floatingId });

  const { delay: groupDelay } = useDelayGroupContext();
  const hover = useHover(data.context, { delay: delay ?? groupDelay, move: false, mouseOnly, enabled: controlledOpen == null });
  const focus = useFocus(data.context, { enabled: controlledOpen == null || focusOptions?.enabled, ...focusOptions });
  const role = useRole(data.context, { role: "tooltip" });
  const dismiss = useDismiss(data.context);
  const clientPoint = useClientPoint(data.context, { enabled: followCursor });

  const interactions = useInteractions([hover, focus, role, dismiss, clientPoint]);
  //#endregion

  const contextValue = useMemo(() => ({ open, setOpen, arrowRef, ...interactions, ...data }), [open, setOpen, interactions, data]);

  return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>;
}
