import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RemoveScroll } from "react-remove-scroll";
import { Arrow, Backdrop, Container, Extensions, Flip, Offset, Placement, Position, Prevent, PropsForPopoverComponent } from "./types";
import usePopover from "./use-popover";

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
  placement = "bottom",
  container = { selector: "body", margin: 0, padding: 0 },
  extensions = [],
  className,
  children,
}: PopoverContentProps) {
  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);
  useCloseTriggers([targetRef, popoverRef], handleClose);

  const [mountedExtensions, setMountedExtensions] = useState({
    offset: extensions.find((extension) => extension.name === "offset") as Offset | undefined,
    position: extensions.find((extension) => extension.name === "position") as Position | undefined,
    flip: extensions.find((extension) => extension.name === "flip") as Flip | undefined,
    arrow: extensions.find((extension) => extension.name === "arrow") as Arrow | undefined,
    backdrop: extensions.find((extension) => extension.name === "backdrop") as Backdrop | undefined,
    prevent: extensions.find((extension) => extension.name === "prevent") as Prevent | undefined,
  });
  useEffect(() => {
    setMountedExtensions({
      offset: extensions.find((extension) => extension.name === "offset") as Offset | undefined,
      position: extensions.find((extension) => extension.name === "position") as Position | undefined,
      flip: extensions.find((extension) => extension.name === "flip") as Flip | undefined,
      arrow: extensions.find((extension) => extension.name === "arrow") as Arrow | undefined,
      backdrop: extensions.find((extension) => extension.name === "backdrop") as Backdrop | undefined,
      prevent: extensions.find((extension) => extension.name === "prevent") as Prevent | undefined,
    });
  }, [extensions]);

  let props: PropsForPopoverComponent;
  if (!mountedExtensions.position) {
    props = usePopover(popoverRef, targetRef, isOpen, placement, container, mountedExtensions).props;
  } else {
    props = {
      popover: { style: { top: mountedExtensions.position.y, left: mountedExtensions.position.x } },
      arrow: { style: { top: 0, left: 0, width: "", height: "" } },
      motion: { style: { transformOrigin: mountedExtensions.position.transformOrigin } },
    };
  }

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
    if (mountedExtensions.backdrop.type === "blur") backdropStyles = "bg-black/25 backdrop-blur-sm backdrop-saturate-150";

    return (
      <motion.div
        role="presentation"
        initial="initial"
        animate="enter"
        exit="exit"
        variants={TRANSITION.fade}
        onClick={handleClose}
        className={cn("fixed inset-0 -z-20", backdropStyles, mountedExtensions.backdrop?.className)}
      />
    );
  }, [mountedExtensions.backdrop, handleClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <Portal containerSelector={container.selector}>
          <RemoveScroll
            ref={popoverRef}
            enabled={mountedExtensions.prevent?.scroll === true && isOpen}
            className="absolute z-[100] min-h-fit min-w-fit appearance-none bg-transparent"
            {...props.popover}
          >
            {backdropContent}
            <motion.div
              initial="initial"
              animate="enter"
              exit="exit"
              variants={TRANSITION.scaleSpring}
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
