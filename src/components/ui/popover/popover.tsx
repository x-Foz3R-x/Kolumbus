"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { RemoveScroll } from "react-remove-scroll";

import usePopover, { parsePlacement } from "./use-popover";
import { Container, Extensions, MountedExtensions, Placement, Strategy } from "./types";

import useCloseTriggers from "@/hooks/use-close-triggers";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

import Portal from "@/components/portal";

type Props = {
  popoverRef: React.RefObject<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placement?: Placement;
  strategy?: Strategy;
  container?: Container;
  extensions?: Extensions;
  className?: string;
  zIndex?: number;
  children?: React.ReactNode;
};
export function Popover({
  popoverRef,
  triggerRef,
  isOpen,
  setOpen,
  placement: initialPlacement = "bottom",
  strategy = "absolute",
  container = { selector: "body", padding: 0 },
  extensions = [],
  className,
  zIndex = 100,
  children,
}: Props) {
  const mountedExtensions: MountedExtensions = useMemo(
    () => extensions.reduce((acc, extension) => ({ ...acc, [extension.name]: extension }), {}),
    [extensions],
  );
  const { placement, styles, isPositioned } = usePopover(
    triggerRef,
    popoverRef,
    isOpen,
    initialPlacement,
    strategy,
    container,
    mountedExtensions,
  );

  const transition = useRef("");
  const handleClose = useCallback(() => {
    if (!isOpen) return;

    setOpen(false);
    triggerRef.current?.focus();
  }, [triggerRef, isOpen, setOpen]);
  const variants = useMemo(() => {
    const transition = mountedExtensions.motion?.transition;
    const placementKey = parsePlacement(placement)[0];

    let variant: Variants = TRANSITION.fadeToPosition[placementKey] as Variants;

    if (transition) {
      variant = typeof transition.top === "undefined" ? (transition as Variants) : (transition[placementKey] as Variants);
    }

    variant.initial = { ...variant.initial, zIndex: zIndex + 1 };
    variant.animate = { ...variant.animate, zIndex: zIndex + 1 };
    variant.exit = { ...variant.exit, zIndex: zIndex - 1 };

    return variant;
  }, [placement, zIndex, mountedExtensions.motion]);
  const arrowContent = useMemo(() => {
    if (!mountedExtensions.arrow) return null;

    return (
      <>
        <span
          role="presentation"
          aria-hidden={true}
          style={styles.arrow}
          className={cn("absolute rotate-45", mountedExtensions.arrow.className?.arrow, transition.current)}
        ></span>
        {mountedExtensions.arrow.className?.backdrop ? (
          <span
            role="presentation"
            aria-hidden={true}
            style={styles.arrow}
            className={cn("absolute -z-10 rotate-45", mountedExtensions.arrow.className.backdrop, transition.current)}
          ></span>
        ) : null}
      </>
    );
  }, [mountedExtensions.arrow, styles.arrow]);
  const backdropContent = useMemo(() => {
    if (!mountedExtensions.backdrop) return null;

    let backdropStyles;
    if (mountedExtensions.backdrop.type === "opaque") backdropStyles = "bg-black/25";
    else if (mountedExtensions.backdrop.type === "opaque-white") backdropStyles = "bg-white/25";
    else if (mountedExtensions.backdrop.type === "blur") backdropStyles = "bg-black/25 backdrop-blur-sm backdrop-saturate-150";
    else if (mountedExtensions.backdrop.type === "blur-white") backdropStyles = "bg-white/25 backdrop-blur-sm backdrop-saturate-150";

    return (
      <span className="absolute z-[100]">
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
      </span>
    );
  }, [mountedExtensions.backdrop, mountedExtensions.prevent, handleClose]);

  // Apply transition when popover is opened and positioned.
  useEffect(() => {
    if (isOpen && isPositioned) transition.current = "duration-250 ease-kolumb-flow";
    else transition.current = "";
  }, [isOpen, isPositioned, styles.popover]);

  // Focus first focusable element when popover is opened.
  useEffect(() => {
    if (!isOpen || !popoverRef.current || mountedExtensions.prevent?.autofocus) return;

    const focusableElements = popoverRef.current.querySelectorAll<HTMLElement>(
      "a, area, button, input, object, select, textarea, [tabindex]:not([tabindex='-1'])",
    );
    Array.from(focusableElements)[0]?.focus({ preventScroll: true });
  }, [popoverRef, isOpen, mountedExtensions.prevent?.autofocus]);

  // Observe triggerRef's visibility to close the popover when out of view.
  useEffect(() => {
    if (!isOpen || mountedExtensions.prevent?.hide) return;

    const triggerElement = triggerRef.current;
    const observer = new IntersectionObserver(([entry]) => !entry.isIntersecting && setOpen(false), { threshold: 0.1 });

    if (triggerElement) observer.observe(triggerElement);

    return () => {
      triggerElement && observer.unobserve(triggerElement);
    };
  }, [triggerRef, isOpen, setOpen, container.selector, mountedExtensions.prevent?.hide]);

  useCloseTriggers([triggerRef, popoverRef], handleClose, !isOpen || mountedExtensions.prevent?.closeTriggers);

  return (
    <AnimatePresence>
      {isOpen ? (
        <Portal selector={container.selector} skipSSRCheck>
          {backdropContent}
          <motion.div
            ref={popoverRef}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            style={{ zIndex, ...styles.popover }}
            className={cn(
              strategy,
              "left-0 top-0 min-h-fit min-w-fit appearance-none bg-transparent",
              mountedExtensions.prevent?.pointer && "pointer-events-none",
              transition.current,
            )}
            data-placement={placement}
          >
            <RemoveScroll
              enabled={mountedExtensions.prevent?.scroll === true && isOpen}
              allowPinchZoom={mountedExtensions.prevent?.scroll === true && isOpen}
              style={styles.content}
              className={cn("relative font-inter", transition.current, className)}
            >
              {children}
              {arrowContent}
            </RemoveScroll>
          </motion.div>
        </Portal>
      ) : null}
    </AnimatePresence>
  );
}
