"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  autoUpdate,
  flip,
  useFloating,
  useInteractions,
  useListNavigation,
  useTypeahead,
  useClick,
  useDismiss,
  useRole,
  FloatingFocusManager,
  FloatingList,
  Placement,
  OffsetOptions,
  ShiftOptions,
  FlipOptions,
  SizeOptions,
  offset,
  shift,
  size,
  useTransitionStyles,
  FloatingPortal,
  Side,
} from "@floating-ui/react";

import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

import { SelectContext } from "./select-context";
import { Button, ButtonProps } from "../button";
import { ScrollIndicator } from "../scroll-indicator";

type SelectProps = {
  defaultSelectedIndex?: number | null;
  selectedIndex?: number | null;
  setSelectedIndex?: (index: number | null) => void;
  placement?: Placement;
  offset?: OffsetOptions | false;
  shift?: ShiftOptions | false;
  flip?: FlipOptions | false;
  size?: SizeOptions | false;
  animation?: Exclude<keyof typeof TRANSITION, "fadeToPosition"> | null;
  exitDuration?: number;
  className?: string;
  zIndex?: number;
  rootSelector?: string;
  buttonProps?: ButtonProps;
  children?: React.ReactNode;
};
export function Select({
  defaultSelectedIndex = null,
  selectedIndex: controlledSelectedIndex,
  setSelectedIndex: controlledSetSelectedIndex,
  placement = "bottom-start",
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
  animation,
  exitDuration,
  className,
  zIndex,
  rootSelector,
  buttonProps,
  children,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [uncontrolledSelectedIndex, uncontrolledSetSelectedIndex] = useState<number | null>(defaultSelectedIndex);

  const selectedIndex = controlledSelectedIndex ?? uncontrolledSelectedIndex;
  const setSelectedIndex = controlledSetSelectedIndex ?? uncontrolledSetSelectedIndex;

  const scrollRef = useRef<HTMLUListElement | null>(null);

  //#region Floating UI
  const elementsRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);

  const handleSelect = useCallback(
    (index: number | null) => {
      setSelectedIndex(index);
      setOpen(false);
    },
    [setSelectedIndex],
  );

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      ...(offsetOptions ? [offset(offsetOptions)] : []),
      ...(shiftOptions ? [shift(shiftOptions)] : []),
      ...(flipOptions ? [flip(flipOptions)] : []),
      ...(sizeOptions ? [size(sizeOptions)] : []),
    ],
  });
  const transition = useTransitionStyles(context, {
    duration: exitDuration,
    close: { opacity: 1 },
    initial: { opacity: 1 },
  });

  const click = useClick(context);
  const role = useRole(context, { role: "listbox" });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: (index) => (open ? setActiveIndex(index) : handleSelect(index)),
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([click, role, dismiss, listNav, typeahead]);
  //#endregion

  const variants = useMemo(() => {
    if (animation === null) return undefined;
    if (animation) return TRANSITION[animation];

    return TRANSITION.fadeToPosition[placement.split("-")[0] as Side];
  }, [animation, placement]);
  const tooltipProps = useMemo(() => {
    return open ? undefined : rootSelector && buttonProps?.tooltip ? { ...buttonProps.tooltip, rootSelector } : buttonProps?.tooltip;
  }, [open, rootSelector, buttonProps]);
  const ButtonComponent = useMemo(
    () => <Button ref={refs.setReference} tabIndex={0} {...getReferenceProps()} {...buttonProps} tooltip={tooltipProps} />,
    [refs, getReferenceProps, buttonProps, tooltipProps],
  );

  const selectContext = useMemo(
    () => ({
      activeIndex,
      selectedIndex,
      getItemProps,
      handleSelect,
    }),
    [activeIndex, selectedIndex, getItemProps, handleSelect],
  );

  return (
    <SelectContext.Provider value={selectContext}>
      {ButtonComponent}

      {transition.isMounted && (
        <FloatingPortal root={rootSelector ? (document.querySelector(rootSelector) as HTMLElement | null) : undefined}>
          <FloatingFocusManager context={context} modal={false}>
            <div ref={refs.setFloating} style={{ ...floatingStyles, ...transition.styles, zIndex }} {...getFloatingProps()}>
              <AnimatePresence>
                {open && (
                  <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
                    <motion.ul
                      ref={scrollRef}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={variants}
                      className={cn(
                        "flex flex-col overflow-y-auto overflow-x-hidden rounded-xl border bg-white p-1.5 font-inter shadow-floating dark:border-gray-700 dark:bg-gray-900 dark:text-white",
                        className,
                      )}
                    >
                      {children}
                    </motion.ul>

                    <ScrollIndicator
                      scrollRef={scrollRef}
                      top={1}
                      bottom={1}
                      zIndex={10}
                      className={{ start: "rounded-t-xl", end: "rounded-b-xl" }}
                      vertical
                      animate
                    />
                  </FloatingList>
                )}
              </AnimatePresence>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </SelectContext.Provider>
  );
}
