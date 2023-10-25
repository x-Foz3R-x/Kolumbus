import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Arrow, Container, Modifiers, Placement } from ".";
import { motion } from "framer-motion";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  triggerRef: React.RefObject<HTMLElement>;
  popoverRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  placement: Placement;
  container: Container;
  arrow: Arrow;
  modifiers: Modifiers;
};
export default function usePopoverPosition({ triggerRef, popoverRef, isOpen, placement, container, arrow, modifiers }: Props) {
  type PositionResult = {
    position: Position;
    arrowLeft?: number;
    arrowTop?: number;
    maxHeight?: number;
    maxWidth?: number;
    transformOrigin?: string;
  };
  const [position, setPosition] = useState<PositionResult>({
    position: { top: 0, left: 0 },
    arrowLeft: undefined,
    arrowTop: undefined,
    maxHeight: undefined,
    maxWidth: undefined,
    transformOrigin: undefined,
  });

  const updatePosition = useCallback(() => {
    if (!isOpen || !triggerRef?.current || !popoverRef?.current) return;

    const position = computePosition(
      placement,
      document.querySelector(container.selector) ?? document.body,
      triggerRef.current,
      popoverRef.current,
      container.margin,
      container.padding,
      modifiers.offset,
      arrow.enabled ? arrow.size : 0,
      modifiers.preventFlip
    );

    setPosition(position);
  }, [triggerRef, popoverRef, isOpen, placement, container, arrow, modifiers]);

  // Update position when anything changes
  useLayoutEffect(updatePosition, [updatePosition, triggerRef, popoverRef, isOpen, placement, container, arrow, modifiers]);

  // Update position on window resize and scroll
  useLayoutEffect(() => {
    window.addEventListener("resize", updatePosition, false);
    if (!modifiers.preventScroll) window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition, false);
      if (!modifiers.preventScroll) window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition, modifiers.preventScroll]);

  //#region Props for components
  const popoverProps = { style: { ...position.position, maxHeight: position.maxHeight, maxWidth: position.maxWidth } };
  const motionProps = { style: { transformOrigin: position.transformOrigin } };
  //#endregion

  const arrowContent = useMemo(() => {
    const arrowProps = arrow.enabled
      ? {
          "aria-hidden": true,
          role: "presentation",
          style: { top: position.arrowTop, left: position.arrowLeft, width: arrow.size, height: arrow.size },
        }
      : null;

    if (!arrow.enabled) return null;

    return (
      <>
        <span className="absolute z-10 rotate-45 bg-white" {...arrowProps}></span>
        <span className="absolute -z-10 rotate-45 shadow-borderXL" {...arrowProps}></span>
      </>
    );
  }, [arrow, position.arrowTop, position.arrowLeft]);

  const backdropContent = useMemo(() => {
    if (modifiers.backdrop === "transparent") return null;

    let backdropStyles;
    if (modifiers.backdrop === "opaque") backdropStyles = "bg-black/25";
    if (modifiers.backdrop === "blur") backdropStyles = "bg-black/25 backdrop-blur-sm backdrop-saturate-150";

    return (
      <motion.div
        initial="initial"
        animate={"enter"}
        exit="exit"
        variants={TRANSITION.fade}
        // onClick={() => setIsOpen(false)}
        className={cn("fixed inset-0 -z-10", backdropStyles)}
      />
    );
  }, [modifiers.backdrop]); // eslint-disable-line

  return { popoverProps, motionProps, arrowContent, backdropContent };
}

type Position = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};
type Dimensions = {
  top: number;
  bottom: number;
  left: number;
  right: number;

  documentTop: number;
  documentBottom: number;
  documentLeft: number;
  documentRight: number;

  width: number;
  height: number;
  totalWidth: number;
  totalHeight: number;
};

/**
 * Returns the dimensions of an element relative to its container.
 * @param element - The element to get the dimensions of.
 * @param containerDimensions - Optional dimensions of the container element. If not provided, the dimensions of the body element will be used.
 * @returns An object containing the dimensions of the element relative to its container.
 */
function getDimensions(element: Element, containerDimensions?: Dimensions) {
  const { top, left, width, height } = element.getBoundingClientRect();
  const { scrollWidth, scrollHeight, scrollTop, scrollLeft, clientTop: borderTop, clientLeft: borderLeft } = element;

  if (!containerDimensions) {
    const { top, left, width, height } = document.documentElement.getBoundingClientRect();
    const { scrollWidth, scrollHeight, scrollTop, scrollLeft, clientTop: borderTop, clientLeft: borderLeft } = document.documentElement;

    const totalWidth = scrollWidth + borderLeft * 2;
    const totalHeight = scrollHeight + borderTop * 2;

    const offsetTop = top - scrollTop;
    const offsetLeft = left - scrollLeft;

    containerDimensions = {
      top: offsetTop,
      bottom: totalHeight - offsetTop,
      left: offsetLeft,
      right: totalWidth - offsetLeft,

      documentTop: top,
      documentBottom: document.documentElement.scrollHeight - (top + height),
      documentLeft: left,
      documentRight: document.documentElement.scrollWidth - (left + width),

      width,
      height,
      totalWidth,
      totalHeight,
    };
  }

  const totalWidth = scrollWidth + borderLeft * 2;
  const totalHeight = scrollHeight + borderTop * 2;

  const offsetTop = top - scrollTop - containerDimensions.top;
  const offsetLeft = left - scrollLeft - containerDimensions.left;

  return {
    top: offsetTop,
    bottom: containerDimensions.height - (offsetTop + totalHeight),
    left: offsetLeft,
    right: containerDimensions.width - (offsetLeft + totalWidth),

    documentTop: top,
    documentBottom: document.documentElement.scrollHeight - (top + height),
    documentLeft: left,
    documentRight: document.documentElement.scrollWidth - (left + width),

    width,
    height,
    totalWidth,
    totalHeight,
  };
}

function computePosition(
  placementInput: Placement,
  container: Element,
  trigger: Element,
  popover: Element,
  containerMargin: number | [number, number, number, number],
  containerPadding: number | [number, number, number, number],
  offset: number,
  arrowSize: number,
  preventFlip: boolean
) {
  const containerDimensions = getDimensions(container);
  const triggerDimensions = getDimensions(trigger, containerDimensions);
  const popoverDimensions = getDimensions(popover, containerDimensions);

  container.scrollTo({ top: triggerDimensions.top - 100, left: triggerDimensions.left - 100, behavior: "smooth" });

  console.log("first");
  console.log(containerDimensions);
  console.log(triggerDimensions);

  let placement = placementInput;
  const [direction, crossDirection] = placementInput.split("-");

  let maxWidth = containerDimensions.totalWidth;
  let maxHeight = containerDimensions.totalHeight;

  const topMargin = typeof containerMargin === "number" ? containerMargin : containerMargin[0];
  const bottomMargin = typeof containerMargin === "number" ? containerMargin : containerMargin[1];
  const leftMargin = typeof containerMargin === "number" ? containerMargin : containerMargin[2];
  const rightMargin = typeof containerMargin === "number" ? containerMargin : containerMargin[3];

  const topPadding = typeof containerPadding === "number" ? containerPadding : containerPadding[0];
  const bottomPadding = typeof containerPadding === "number" ? containerPadding : containerPadding[1];
  const leftPadding = typeof containerPadding === "number" ? containerPadding : containerPadding[2];
  const rightPadding = typeof containerPadding === "number" ? containerPadding : containerPadding[3];

  // Adjust maxWidth and maxHeight for container padding
  switch (direction) {
    case "top":
      maxWidth -= leftPadding + rightPadding;
      maxHeight -= triggerDimensions.bottom + triggerDimensions.height - topPadding;
      break;
    case "bottom":
      maxWidth -= leftPadding + rightPadding;
      maxHeight -= triggerDimensions.top + triggerDimensions.height - bottomPadding;
      break;
    case "left":
      maxWidth -= triggerDimensions.right + triggerDimensions.width - leftPadding;
      maxHeight -= topPadding + bottomPadding;
      break;
    case "right":
      maxWidth -= triggerDimensions.left + triggerDimensions.width - rightPadding;
      maxHeight -= topPadding + bottomPadding;
      break;
  }

  if (!preventFlip) {
    const topBoundary = topMargin + topPadding;
    const bottomBoundary = bottomMargin + bottomPadding;
    const leftBoundary = leftMargin + leftPadding;
    const rightBoundary = rightMargin + rightPadding;

    let documentTop = triggerDimensions.documentTop - popoverDimensions.height - offset;
    let documentTop_left = triggerDimensions.documentLeft + triggerDimensions.width / 2 - popoverDimensions.width / 2;
    if (crossDirection === "start") documentTop_left = triggerDimensions.documentLeft;
    if (crossDirection === "end") documentTop_left = triggerDimensions.documentRight;
    let documentTop_right = triggerDimensions.documentRight - triggerDimensions.width / 2 - popoverDimensions.width / 2;
    if (crossDirection === "start") documentTop_right = triggerDimensions.documentRight;
    if (crossDirection === "end") documentTop_right = triggerDimensions.documentRight;

    let documentBottom = triggerDimensions.documentBottom - popoverDimensions.height - offset;
    let documentBottom_left = triggerDimensions.documentLeft + triggerDimensions.width / 2 - popoverDimensions.width / 2;
    let documentBottom_right = triggerDimensions.documentRight - triggerDimensions.width / 2 - popoverDimensions.width / 2;

    let documentLeft = triggerDimensions.documentLeft - popoverDimensions.width - offset;
    let documentLeft_top = triggerDimensions.documentTop + triggerDimensions.height / 2 - popoverDimensions.height / 2;
    let documentLeft_bottom = triggerDimensions.documentBottom - triggerDimensions.height / 2 - popoverDimensions.height / 2;

    let documentRight = triggerDimensions.documentRight - popoverDimensions.width - offset;
    let documentRight_top = triggerDimensions.documentTop + triggerDimensions.height / 2 - popoverDimensions.height / 2;
    let documentRight_bottom = triggerDimensions.documentBottom - triggerDimensions.height / 2 - popoverDimensions.height / 2;

    switch (direction) {
      case "top":
        console.log("1");
        if (
          documentTop < topBoundary &&
          documentBottom >= bottomBoundary &&
          documentBottom_left >= leftBoundary &&
          documentBottom_right >= rightBoundary
        ) {
          placement = `bottom-${crossDirection}` as Placement;
          break;
        }
        console.log("2");
        if (documentTop_left < leftBoundary && documentRight >= rightBoundary) {
          placement = "right";
          break;
        }
        console.log("3");
        if (documentTop_right < rightBoundary && documentLeft >= leftBoundary) {
          placement = "left";
          break;
        }
        break;
      case "bottom":
        // if (bottom < bottomPadding && top >= topPadding) {
        //   placement = `top-${crossDirection}` as Placement;
        //   break;
        // }
        // if (bottom_left < leftPadding && right >= rightPadding) {
        //   placement = "right";
        //   break;
        // }
        // if (bottom_right < rightPadding && left >= leftPadding) {
        //   placement = "left";
        //   break;
        // }
        break;
      case "left":
        // if (left_top < topPadding && bottom >= bottomPadding) {
        //   placement = "bottom";
        //   break;
        // }
        // if (left_bottom < bottomPadding && top >= topPadding) {
        //   placement = "top";
        //   break;
        // }
        // if (left < leftPadding && right >= rightPadding) {
        //   placement = `right-${crossDirection}` as Placement;
        //   break;
        // }
        break;
      case "right":
        // if (right_top < topPadding && bottom >= bottomPadding) {
        //   placement = "bottom";
        //   break;
        // }
        // if (right_bottom < bottomPadding && top >= topPadding) {
        //   placement = "top";
        //   break;
        // }
        // if (right < rightPadding && left >= leftPadding) {
        //   placement = `left-${crossDirection}` as Placement;
        //   break;
        // }
        break;
    }
  }

  let position: Position = {};
  let arrowTop;
  let arrowLeft;
  let transformOrigin;

  switch (placement) {
    case "top":
      position.top = triggerDimensions.top - popoverDimensions.height - offset;
      position.left = triggerDimensions.left + triggerDimensions.width / 2 - popoverDimensions.width / 2;
      arrowTop = popoverDimensions.height - arrowSize / 2;
      arrowLeft = popoverDimensions.width / 2 - arrowSize / 2;
      transformOrigin = "bottom";
      break;
    case "bottom":
      position.bottom = triggerDimensions.bottom - popoverDimensions.height - offset;
      position.left = triggerDimensions.left + triggerDimensions.width / 2 - popoverDimensions.width / 2;
      arrowTop = -arrowSize / 2;
      arrowLeft = popoverDimensions.width / 2 - arrowSize / 2;
      transformOrigin = "top";
      break;
    case "right":
      position.top = triggerDimensions.top + triggerDimensions.height / 2 - popoverDimensions.height / 2;
      position.right = triggerDimensions.right - popoverDimensions.width - offset;
      arrowTop = popoverDimensions.height / 2 - arrowSize / 2;
      arrowLeft = -arrowSize / 2;
      transformOrigin = "left";
      break;
    case "left":
      position.top = triggerDimensions.top + triggerDimensions.height / 2 - popoverDimensions.height / 2;
      position.left = triggerDimensions.left - popoverDimensions.width - offset;
      arrowTop = popoverDimensions.height / 2 - arrowSize / 2;
      arrowLeft = popoverDimensions.width - arrowSize / 2;
      transformOrigin = "right";
      break;
    case "top-start":
      position.top = triggerDimensions.top - popoverDimensions.height - offset;
      position.left = triggerDimensions.left;
      arrowTop = popoverDimensions.height - arrowSize / 2;
      arrowLeft = triggerDimensions.width / 2 - arrowSize / 2;
      transformOrigin = "bottom left";
      break;
    case "top-end":
      position.top = triggerDimensions.top - popoverDimensions.height - offset;
      position.right = triggerDimensions.right;
      arrowTop = popoverDimensions.height - arrowSize / 2;
      arrowLeft = popoverDimensions.width - triggerDimensions.width / 2 - arrowSize / 2;
      transformOrigin = "bottom right";
      break;
    case "bottom-start":
      position.bottom = triggerDimensions.bottom - popoverDimensions.height - offset;
      position.left = triggerDimensions.left;
      arrowTop = -arrowSize / 2;
      arrowLeft = triggerDimensions.width / 2 - arrowSize / 2;
      transformOrigin = "top left";
      break;
    case "bottom-end":
      position.bottom = triggerDimensions.bottom - popoverDimensions.height - offset;
      position.right = triggerDimensions.right;
      arrowTop = -arrowSize / 2;
      arrowLeft = popoverDimensions.width - triggerDimensions.width / 2 - arrowSize / 2;
      transformOrigin = "top right";
      break;
    case "left-start":
      position.top = triggerDimensions.top;
      position.left = triggerDimensions.left - popoverDimensions.width - offset;
      arrowTop = popoverDimensions.height / 2 - arrowSize / 2;
      arrowLeft = popoverDimensions.width - arrowSize / 2;
      transformOrigin = "top right";
      break;
    case "left-end":
      position.bottom = triggerDimensions.bottom;
      position.left = triggerDimensions.left - popoverDimensions.width - offset;
      arrowTop = popoverDimensions.height - triggerDimensions.height / 2 - arrowSize / 2;
      arrowLeft = popoverDimensions.width - arrowSize / 2;
      transformOrigin = "bottom right";
      break;
    case "right-start":
      position.top = triggerDimensions.top;
      position.right = triggerDimensions.right - popoverDimensions.width - offset;
      arrowTop = triggerDimensions.height / 2 - arrowSize / 2;
      arrowLeft = -arrowSize / 2;
      transformOrigin = "top left";
      break;
    case "right-end":
      position.bottom = triggerDimensions.bottom;
      position.right = triggerDimensions.right - popoverDimensions.width - offset;
      arrowTop = popoverDimensions.height - triggerDimensions.height / 2 - arrowSize / 2;
      arrowLeft = -arrowSize / 2;
      transformOrigin = "bottom left";
      break;
  }

  return { position, maxHeight, maxWidth, arrowTop, arrowLeft, transformOrigin, placement };
}

function flip() {}
