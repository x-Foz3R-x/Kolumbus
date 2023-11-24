import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { RemoveScroll } from "react-remove-scroll";

import usePopover, { parsePlacement } from "./use-popover";
import { Arrow, Backdrop, Container, Extensions, Flip, Motion, Offset, Placement, Position, Prevent } from "./types";
import { useCloseTriggers } from "@/hooks/use-accessibility-features";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

import Portal from "@/components/portal";

type PopoverContentProps = {
  popoverRef: React.RefObject<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placement?: Placement;
  container?: Container;
  extensions?: Extensions;
  className?: string;
  children: React.ReactNode;
};
export function Popover({
  popoverRef,
  triggerRef,
  isOpen,
  setOpen,
  placement: initialPlacement = "bottom",
  container = { selector: "body", margin: 0, padding: 0 },
  extensions = [],
  className,
  children,
}: PopoverContentProps) {
  const useTransition = useRef("");
  const mountedExtensions: {
    offset?: Offset;
    position?: Position;
    flip?: Flip;
    arrow?: Arrow;
    backdrop?: Backdrop;
    motion?: Motion;
    prevent?: Prevent;
  } = extensions.reduce((acc, extension) => ({ ...acc, [extension.name]: extension }), {});

  const handleClose = useCallback(() => {
    if (!isOpen) return;

    setOpen(false);
    triggerRef.current?.focus();
  }, [triggerRef, isOpen, setOpen]);

  const { props, placement } = usePopover(triggerRef, popoverRef, isOpen, initialPlacement, container, mountedExtensions);

  const variants = useMemo(() => {
    if (!mountedExtensions.motion?.transition) return TRANSITION.fadeInOut[parsePlacement(placement)[0]] as Variants;
    if (typeof mountedExtensions.motion.transition.top === "undefined") return mountedExtensions.motion.transition as Variants;
    return mountedExtensions.motion.transition[parsePlacement(placement)[0]] as Variants;
  }, [placement, mountedExtensions.motion]);
  const arrowContent = useMemo(() => {
    if (!mountedExtensions.arrow) return null;

    return (
      <>
        <span
          role="presentation"
          aria-hidden={true}
          className={cn("absolute z-10 rotate-45", mountedExtensions.arrow.className?.arrow, useTransition.current)}
          {...props.arrow}
        ></span>
        {mountedExtensions.arrow.className?.backdrop ? (
          <span
            role="presentation"
            aria-hidden={true}
            className={cn("absolute -z-10 rotate-45", mountedExtensions.arrow.className.backdrop, useTransition.current)}
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
    else if (mountedExtensions.backdrop.type === "opaque-white") backdropStyles = "bg-white/25";
    else if (mountedExtensions.backdrop.type === "blur") backdropStyles = "bg-black/25 backdrop-blur-sm backdrop-saturate-150";
    else if (mountedExtensions.backdrop.type === "blur-white") backdropStyles = "bg-white/25 backdrop-blur-sm backdrop-saturate-150";

    return (
      <motion.div
        role="presentation"
        aria-hidden={true}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={TRANSITION.fade}
        onClick={!mountedExtensions.prevent?.closeTriggers ? handleClose : () => {}}
        className={cn("fixed inset-0 -z-20", backdropStyles, mountedExtensions.backdrop?.className)}
      />
    );
  }, [mountedExtensions.backdrop, mountedExtensions.prevent, handleClose]);

  // Apply transition when to opened popover
  useEffect(() => {
    if (isOpen) setTimeout(() => (useTransition.current = "duration-300 ease-kolumb-leave"), 0);
    else useTransition.current = "";
  }, [isOpen]);

  // Focus first element in popover when opened
  useEffect(() => {
    if (isOpen && !mountedExtensions.prevent?.autofocus && popoverRef.current) {
      const focusableElements = popoverRef.current.querySelectorAll<HTMLElement>(
        "a, area, button, input, object, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      Array.from(focusableElements)[0]?.focus({ preventScroll: true });
    }
  }, [isOpen, mountedExtensions.prevent?.autofocus, popoverRef]);

  // Observe triggerRef's visibility to close the popover when out of view.
  useEffect(() => {
    if (mountedExtensions.prevent?.hide) return;

    const triggerElement = triggerRef.current;
    const observer = new IntersectionObserver(([entry]) => !entry.isIntersecting && setOpen(false), { threshold: 0.1 });

    if (triggerElement) observer.observe(triggerElement);

    return () => {
      triggerElement && observer.unobserve(triggerElement);
    };
  }, [triggerRef, setOpen, container.selector, mountedExtensions.prevent?.hide]);

  useCloseTriggers([triggerRef, popoverRef], handleClose, mountedExtensions.prevent?.closeTriggers);

  return (
    <AnimatePresence>
      {isOpen ? (
        <Portal containerSelector={container.selector}>
          <div
            ref={popoverRef}
            className={cn("absolute z-[100] min-h-fit min-w-fit appearance-none bg-transparent", useTransition.current)}
            data-placement={placement}
            {...props.popover}
          >
            {backdropContent}
            <motion.div initial="initial" animate="animate" exit="exit" variants={variants} {...props.motion}>
              <RemoveScroll
                enabled={mountedExtensions.prevent?.scroll === true && isOpen}
                allowPinchZoom={mountedExtensions.prevent?.scroll === true && isOpen}
                className={cn("relative", className)}
              >
                {arrowContent}
                {children}
              </RemoveScroll>
            </motion.div>
          </div>
        </Portal>
      ) : null}
    </AnimatePresence>
  );
}
