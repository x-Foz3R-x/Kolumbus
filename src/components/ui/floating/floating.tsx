import { useMemo, useState } from "react";
import { AnimatePresence, Variants, motion } from "framer-motion";
import {
  FlipOptions,
  OffsetOptions,
  Placement,
  ShiftOptions,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  FloatingPortal,
  FloatingFocusManager,
  useMergeRefs,
  Side,
  useTransitionStyles,
  UseClickProps,
  SizeOptions,
  size,
} from "@floating-ui/react";

import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

import { FloatingContext } from "./floating-context";
import { FloatingTrigger, FloatingTriggerProps } from "./floating-trigger";

export type FloatingProps = {
  floatingRef?: React.RefObject<HTMLDivElement>;
  triggerRef?: React.RefObject<HTMLElement>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialFocus?: number | React.MutableRefObject<HTMLElement | null>;
  placement?: Placement;
  offset?: OffsetOptions | false;
  shift?: ShiftOptions | false;
  flip?: FlipOptions | false;
  size?: SizeOptions | false;
  click?: UseClickProps;
  animation?: Exclude<keyof typeof TRANSITION, "fadeToPosition"> | null;
  customAnimation?: Variants;
  exitDuration?: number;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  zIndex?: number;
  className?: string;
  rootSelector?: string;
  triggerProps?: Omit<FloatingTriggerProps, "triggerRef">;
  children: React.ReactNode;
};
export function Floating({
  floatingRef,
  triggerRef,
  isOpen: controlledOpen,
  onOpenChange: setControlledOpen,
  initialFocus,
  placement = "bottom",
  offset: offsetOptions = 6,
  shift: shiftOptions = { padding: 6 },
  flip: flipOptions = { crossAxis: placement.includes("-"), padding: 6 },
  size: sizeOptions = {
    padding: 6,
    apply({ elements, availableHeight, availableWidth }) {
      Object.assign(elements.floating.style, { maxWidth: `${availableWidth}px`, maxHeight: `${availableHeight}px` });
      if (elements.floating.firstElementChild instanceof HTMLElement) {
        Object.assign(elements.floating.firstElementChild.style, { maxWidth: `${availableWidth}px`, maxHeight: `${availableHeight}px` });
      }
    },
  },
  click: clickOptions,
  ariaLabelledby,
  ariaDescribedby,
  animation,
  customAnimation,
  exitDuration,
  zIndex,
  className,
  rootSelector,
  triggerProps,
  children,
}: FloatingProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  //#region Floating UI
  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      ...(offsetOptions ? [offset(offsetOptions)] : []),
      ...(shiftOptions ? [shift(shiftOptions)] : []),
      ...(flipOptions ? [flip(flipOptions)] : []),
      ...(sizeOptions ? [size(sizeOptions)] : []),
    ],
  });
  const { isMounted, styles } = useTransitionStyles(data.context, {
    duration: exitDuration,
    close: { opacity: 1 },
    initial: { opacity: 1 },
  });

  const click = useClick(data.context, { enabled: controlledOpen == null, ...clickOptions });
  const role = useRole(data.context);
  const dismiss = useDismiss(data.context);

  const ref = useMergeRefs([data.refs.setFloating, floatingRef]);
  const interactions = useInteractions([click, role, dismiss]);
  //#endregion

  const getVariants = () => {
    if (customAnimation) return customAnimation;
    if (animation === null) return undefined;
    if (animation) return TRANSITION[animation];

    return TRANSITION.fadeToPosition[placement.split("-")[0] as Side];
  };

  const contextValue = useMemo(() => ({ open, setOpen, ...interactions, ...data }), [open, setOpen, interactions, data]);

  return (
    <FloatingContext.Provider value={contextValue}>
      <FloatingTrigger triggerRef={triggerRef} {...triggerProps} />

      {isMounted && (
        <FloatingPortal root={rootSelector ? (document.querySelector(rootSelector) as HTMLElement | null) : undefined}>
          <FloatingFocusManager initialFocus={initialFocus} context={data.context} modal={false}>
            <div
              ref={ref}
              aria-labelledby={ariaLabelledby}
              aria-describedby={ariaDescribedby}
              {...interactions.getFloatingProps({ style: { ...data.floatingStyles, ...styles, zIndex } })}
            >
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={getVariants()}
                    className={cn("relative font-inter", className)}
                  >
                    {children}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </FloatingContext.Provider>
  );
}
