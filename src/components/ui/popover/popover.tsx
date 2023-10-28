import { useCallback, useMemo } from "react";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { RemoveScroll } from "react-remove-scroll";
import { Arrow, Backdrop, Container, Extensions, Flip, Motion, Offset, Placement, Position, Prevent } from "./types";
import usePopover, { parsePlacement } from "./use-popover";

import { useCloseTriggers } from "@/hooks/use-accessibility-features";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";
import Portal from "@/components/portal";

type PopoverContentProps = {
  tag?: "div" | "ul";

  popoverRef: React.RefObject<HTMLElement>;
  targetRef: React.RefObject<HTMLElement>;

  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placement?: Placement;
  container?: Container;
  extensions?: Extensions;

  className?: string;
  children: React.ReactNode;
};
export function Popover({
  tag = "div",
  popoverRef,
  targetRef,
  isOpen,
  setOpen,
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
    if (isOpen) {
      setOpen(false), [setOpen];
      targetRef.current?.focus();
    }
  }, [targetRef, isOpen, setOpen]);

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

  // Focus first element in popover
  if (popoverRef.current && isOpen) {
    const focusableElements = popoverRef.current.querySelectorAll<HTMLElement>(
      "input, select, textarea, button, object, a, area, [tabindex]"
    );
    Array.from(focusableElements)[0]?.focus({ preventScroll: true });
  }

  useCloseTriggers([targetRef, popoverRef], handleClose);
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
            {tag === "div" ? (
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
            ) : (
              <motion.ul
                initial="initial"
                animate="enter"
                exit="exit"
                variants={variants}
                className={cn("relative", className)}
                {...props.motion}
              >
                {arrowContent}
                {children}
              </motion.ul>
            )}
          </RemoveScroll>
        </Portal>
      ) : null}
    </AnimatePresence>
  );
}
