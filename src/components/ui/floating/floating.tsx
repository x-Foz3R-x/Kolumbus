import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import {
  type FlipOptions,
  type OffsetOptions,
  type Placement,
  type ShiftOptions,
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
  type Side,
  type UseClickProps,
  type SizeOptions,
  size,
} from "@floating-ui/react";
import { TRANSITION } from "~/lib/motion";
import { cn } from "~/lib/utils";

import { FloatingContext } from "./floating-context";
import { FloatingTrigger, type FloatingTriggerProps } from "./floating-trigger";

export type FloatingProps = {
  floatingRef?: React.RefObject<HTMLDivElement>;
  triggerRef?: React.RefObject<HTMLElement>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  offset?: OffsetOptions | false;
  shift?: ShiftOptions | false;
  flip?: FlipOptions | false;
  size?: SizeOptions | false;
  click?: UseClickProps;
  animation?: Exclude<keyof typeof TRANSITION, "fadeToPosition"> | null;
  customAnimation?: Variants;
  trapFocus?: boolean;
  scrollIntoView?: boolean;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  initialFocus?: number | React.MutableRefObject<HTMLElement | null>;
  zIndex?: number;
  style?: React.CSSProperties;
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
  placement = "bottom",
  offset: offsetOptions = 6,
  shift: shiftOptions = { padding: 6 },
  flip: flipOptions = { crossAxis: placement.includes("-"), padding: 6 },
  size: sizeOptions = {
    padding: 6,
    apply({ elements, availableHeight, availableWidth }) {
      Object.assign(elements.floating.style, {
        maxWidth: `${availableWidth}px`,
        maxHeight: `${availableHeight}px`,
      });
      if (elements.floating.firstElementChild instanceof HTMLElement) {
        Object.assign(elements.floating.firstElementChild.style, {
          maxWidth: `${availableWidth}px`,
          maxHeight: `${availableHeight}px`,
        });
      }
    },
  },
  click: clickOptions,
  animation,
  customAnimation,
  trapFocus = false,
  scrollIntoView = false,
  ariaLabelledby,
  ariaDescribedby,
  initialFocus,
  zIndex,
  style,
  className,
  rootSelector,
  triggerProps,
  children,
}: FloatingProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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

  const click = useClick(data.context, { enabled: controlledOpen == null, ...clickOptions });
  const role = useRole(data.context);
  const dismiss = useDismiss(data.context);

  const ref = useMergeRefs([data.refs.setFloating, floatingRef]);
  const interactions = useInteractions([click, role, dismiss]);
  //#endregion

  const variants = useMemo(() => {
    if (customAnimation) return customAnimation;
    if (animation === null) return undefined;
    if (animation) return TRANSITION[animation];

    return TRANSITION.fadeToPosition[placement.split("-")[0] as Side];
  }, [animation, customAnimation, placement]);

  const contextValue = useMemo(
    () => ({ open, setOpen, ...interactions, ...data }),
    [open, setOpen, interactions, data],
  );

  // Scroll into view when open
  useEffect(() => {
    if (!scrollIntoView) return;

    const scroll = () => {
      const element = data.elements.floating;
      if (element) element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const timeoutId = setTimeout(scroll, 0);

    return () => clearTimeout(timeoutId);
  }, [data.elements.floating, scrollIntoView]);

  // Set isMounted to true when open becomes true
  useEffect(() => {
    open && setIsMounted(true);
  }, [open]);

  return (
    <FloatingContext.Provider value={contextValue}>
      <FloatingTrigger triggerRef={triggerRef} {...triggerProps} />

      {isMounted && (
        <FloatingPortal
          root={
            rootSelector
              ? (document.querySelector(rootSelector) as HTMLElement | undefined)
              : undefined
          }
        >
          <FloatingFocusManager
            initialFocus={initialFocus}
            context={data.context}
            modal={trapFocus}
            visuallyHiddenDismiss={trapFocus}
          >
            <div
              ref={ref}
              aria-labelledby={ariaLabelledby}
              aria-describedby={ariaDescribedby}
              {...interactions.getFloatingProps({
                style: { ...data.floatingStyles, ...style, zIndex },
              })}
            >
              <AnimatePresence onExitComplete={() => setIsMounted(false)}>
                {open && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={variants}
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
