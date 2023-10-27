import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { RemoveScroll } from "react-remove-scroll";
import { Arrow, Backdrop, Container, Extensions, Flip, Motion, Offset, Placement, Position, Prevent } from "./types";
import usePopover, { parsePlacement } from "./use-popover";

import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";
import Portal from "@/components/portal";
import { useCloseTriggers } from "@/hooks/use-accessibility-features";

type PopoverContentProps = {
  popoverRef: React.RefObject<HTMLElement>;
  targetRef: React.RefObject<HTMLElement>;

  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placement?: Placement;
  container?: Container;
  extensions?: Extensions;

  className?: string;
  children: React.ReactNode;
};
export function Popover({
  popoverRef,
  targetRef,
  isOpen,
  setIsOpen,
  placement: initialPlacement = "bottom",
  container = { selector: "body", margin: 0, padding: 0 },
  extensions = [],
  className,
  children,
  ...divProps
}: PopoverContentProps & React.HTMLAttributes<HTMLDivElement>) {
  const mountedExtensions: {
    offset?: Offset;
    position?: Position;
    flip?: Flip;
    arrow?: Arrow;
    backdrop?: Backdrop;
    motion?: Motion;
    prevent?: Prevent;
  } = {
    offset: undefined,
    position: undefined,
    flip: undefined,
    arrow: undefined,
    backdrop: undefined,
    motion: undefined,
    prevent: undefined,
  };
  extensions.forEach((extension) => {
    switch (extension.name) {
      case "offset":
        mountedExtensions.offset = extension as Offset;
        break;
      case "position":
        mountedExtensions.position = extension as Position;
        break;
      case "flip":
        mountedExtensions.flip = extension as Flip;
        break;
      case "arrow":
        mountedExtensions.arrow = extension as Arrow;
        break;
      case "backdrop":
        mountedExtensions.backdrop = extension as Backdrop;
        break;
      case "motion":
        mountedExtensions.motion = extension as Motion;
        break;
      case "prevent":
        mountedExtensions.prevent = extension as Prevent;
        break;
    }
  });

  const { props, placement } = usePopover(popoverRef, targetRef, isOpen, initialPlacement, container, mountedExtensions);

  const handleClose = useCallback(() => {
    setIsOpen(false), [setIsOpen];
    targetRef.current?.focus();
  }, [targetRef, setIsOpen]);
  useCloseTriggers([targetRef, popoverRef], handleClose);
  const arrowContent = useMemo(() => {
    if (!mountedExtensions.arrow) return null;

    return (
      <>
        <span
          role="presentation"
          aria-hidden={true}
          className={cn("absolute rotate-45", mountedExtensions.arrow.className?.arrow)}
          {...props.arrow}
        ></span>
        {mountedExtensions.arrow.className?.backdrop ? (
          <span
            role="presentation"
            aria-hidden={true}
            className={cn("absolute -z-10 rotate-45", mountedExtensions.arrow.className.backdrop)}
            {...props.arrow}
          ></span>
        ) : null}
      </>
    );
  }, [mountedExtensions.arrow, props.arrow]);
  const backdropContent = useMemo(() => {
    if (!mountedExtensions.backdrop) return null;

    let backdropStyles;
    if (mountedExtensions.backdrop.type === "opaque") backdropStyles = "bg-black/25";
    if (mountedExtensions.backdrop.type === "opaque-white") backdropStyles = "bg-white/25";
    if (mountedExtensions.backdrop.type === "blur") backdropStyles = "bg-black/25 backdrop-blur-sm backdrop-saturate-150";
    if (mountedExtensions.backdrop.type === "blur-white") backdropStyles = "bg-white/25 backdrop-blur-sm backdrop-saturate-150";

    return (
      <motion.div
        role="presentation"
        aria-hidden={true}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={TRANSITION.fade}
        onClick={handleClose}
        className={cn("fixed inset-0 -z-20", backdropStyles, mountedExtensions.backdrop?.className)}
      />
    );
  }, [mountedExtensions.backdrop, handleClose]);

  const variants: Variants = mountedExtensions.motion?.transition
    ? typeof mountedExtensions.motion.transition.top === "undefined"
      ? (mountedExtensions.motion.transition as Variants)
      : (mountedExtensions.motion.transition[parsePlacement(placement)[0]] as Variants)
    : TRANSITION.fadeInOut[parsePlacement(placement)[0]];

  // Focus first element in popover
  if (popoverRef.current && isOpen) {
    const elements = popoverRef.current.querySelectorAll<HTMLElement>("input, select, textarea, button, object, a, area, [tabindex]");
    Array.from(elements)[0].focus({ preventScroll: true });
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <Portal containerSelector={container.selector}>
          <RemoveScroll
            ref={popoverRef}
            enabled={mountedExtensions.prevent?.scroll === true && isOpen}
            className="absolute z-[100] min-h-fit min-w-fit appearance-none bg-transparent"
            {...props.popover}
            {...divProps}
          >
            {backdropContent}
            <motion.div
              initial="initial"
              animate="enter"
              exit="exit"
              variants={variants}
              className={cn("relative", className)}
              {...props.motion}
            >
              {arrowContent}
              {children}
            </motion.div>
          </RemoveScroll>
        </Portal>
      ) : null}
    </AnimatePresence>
  );
}
