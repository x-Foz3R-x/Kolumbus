import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Alignment, Container, Coords, MountedExtensions, Placement, Rect, Inset, Side, Axis, Length, Strategy } from "./types";

/**
 * A hook that calculates the position of a popover relative to a trigger element.
 *
 * @remarks
 * This hook uses the `computePosition` function to calculate the position of the popover based on the trigger element, the popover element, and the specified placement. It also updates the position of the popover when the window is resized or scrolled.
 *
 * @param popoverRef - A ref to the popover element.
 * @param triggerRef - A ref to the trigger element.
 * @param isOpen - Whether the popover is currently open.
 * @param placement - The placement of the popover relative to the trigger element.
 * @param container - The container element for the popover.
 * @param extensions - Additional options for the popover.
 */
export default function usePopover(
  triggerRef: React.RefObject<HTMLElement>,
  popoverRef: React.RefObject<HTMLElement>,
  isOpen: boolean,
  placement: Placement,
  strategy: Strategy,
  container: Container,
  extensions: MountedExtensions,
) {
  const [isPositioned, setIsPositioned] = useState(false);
  const [position, setPosition] = useState({ coords: { x: 0, y: 0 }, arrowCoords: { x: 0, y: 0 } });
  const [popover, setPopover] = useState({
    placement: placement,
    translate: "0",
    translateArrow: "0",
    transformOrigin: getTransformOrigin(placement),
  });

  const computePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    setIsPositioned(true);
    setPosition(
      ComputePosition(
        document.querySelector(container.selector) ?? document.body,
        triggerRef.current,
        popoverRef.current,
        placement,
        strategy,
        extensions.offset?.value ?? 0,
        extensions.arrow?.size ?? 0,
      ),
    );
  }, [container.selector, triggerRef, popoverRef, placement, strategy, extensions.offset, extensions.arrow]);

  const updatePopover = useCallback(() => {
    if (!isOpen || !isPositioned || !triggerRef.current || !popoverRef.current || !extensions.flip || extensions.position) return;

    const {
      placement: newPlacement,
      translate,
      translateArrow,
    } = Flip(
      document.querySelector(container.selector) ?? document.body,
      triggerRef.current,
      popoverRef.current,
      placement,
      strategy,
      toInsetValue(container.padding ?? 0),
      extensions.offset?.value ?? 0,
      extensions.arrow?.size ?? 0,
    );

    setPopover({ placement: newPlacement, translate, translateArrow, transformOrigin: getTransformOrigin(newPlacement) });
  }, [isOpen, isPositioned, triggerRef, popoverRef, placement, strategy, container, extensions]);

  // Compute position when popover is opened
  useLayoutEffect(computePosition, [computePosition]);

  // Update popover on opened
  useLayoutEffect(updatePopover, [isOpen, triggerRef, popoverRef, placement]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update popover when window is resized or scrolled
  useLayoutEffect(() => {
    window.addEventListener("resize", updatePopover);
    if (!extensions.prevent?.scroll) window.addEventListener("scroll", updatePopover, true);

    return () => {
      window.removeEventListener("resize", updatePopover);
      if (!extensions.prevent?.scroll) window.removeEventListener("scroll", updatePopover, true);
    };
  }, [updatePopover, extensions.prevent]);

  const styles = useMemo(() => {
    const { position: extPosition, arrow: extArrow } = extensions;
    const { coords, arrowCoords } = position;
    const arrowSize = `${(extArrow?.size ?? 0) / 16}rem`;

    const popoverStyles = extPosition
      ? { top: extPosition.y, left: extPosition.x, transformOrigin: extPosition.transformOrigin }
      : { top: coords.y, left: coords.x, transformOrigin: popover.transformOrigin };

    const contentStyles = { translate: popover.translate };

    const arrowStyles = {
      top: arrowCoords.y,
      left: arrowCoords.x,
      width: arrowSize,
      height: arrowSize,
      translate: popover.translateArrow,
    };

    return { popover: popoverStyles, content: contentStyles, arrow: arrowStyles };
  }, [position, popover, extensions]);

  return useMemo(() => ({ placement: popover.placement, styles, isPositioned }), [popover.placement, styles, isPositioned]);
}

/**
 * Computes the position of a popover relative to a container and trigger element.
 *
 * @remarks
 * This function calculates the position of the popover based on the provided parameters.
 * It takes into account the container, trigger, and popover elements, as well as the desired placement, strategy, offset, and arrow size.
 * The resulting coordinates are returned as an object.
 *
 * @param container - The container element.
 * @param trigger - The trigger element.
 * @param popover - The popover element.
 * @param placement - The placement of the popover (e.g., "top", "bottom", "left", "right").
 * @param strategy - The strategy for positioning the popover.
 * @param offset - The offset for positioning the popover.
 * @param arrowSize - The size of the arrow on the popover.
 * @returns An object containing the coordinates of the popover and arrow.
 */
function ComputePosition(
  container: HTMLElement,
  trigger: HTMLElement,
  popover: HTMLElement,
  placement: Placement,
  strategy: Strategy,
  offset: number | { mainAxis?: number; crossAxis?: number },
  arrowSize: number,
) {
  const triggerRect = getStrategisedElementRect(container, trigger, strategy);
  const popoverRect = getStrategisedElementRect(container, popover, strategy);

  const [side, alignment] = parsePlacement(placement);
  const oppositeAxis = getOppositeAxis(placement);
  const oppositeLength = getOppositeAxisLength(placement);

  const commonX = triggerRect.x + triggerRect.width / 2 - popoverRect.width / 2;
  const commonY = triggerRect.y + triggerRect.height / 2 - popoverRect.height / 2;
  const commonAlign = triggerRect[oppositeLength] / 2 - popoverRect[oppositeLength] / 2;
  const arrowCommonX = popoverRect.width / 2 - arrowSize / 2;
  const arrowCommonY = popoverRect.height / 2 - arrowSize / 2;

  let coords: Coords = { x: triggerRect.y, y: triggerRect.x };
  let arrowCoords: Coords = { x: 0, y: 0 };
  switch (side) {
    case "top":
      coords = { x: commonX, y: triggerRect.y - popoverRect.height };
      arrowCoords = { x: arrowCommonX, y: popoverRect.height - arrowSize / 1.5 };
      break;
    case "bottom":
      coords = { x: commonX, y: triggerRect.y + triggerRect.height };
      arrowCoords = { x: arrowCommonX, y: -arrowSize / 3 };
      break;
    case "left":
      coords = { x: triggerRect.x - popoverRect.width, y: commonY };
      arrowCoords = { x: popoverRect.width - arrowSize / 1.5, y: arrowCommonY };
      break;
    case "right":
      coords = { x: triggerRect.x + triggerRect.width, y: commonY };
      arrowCoords = { x: -arrowSize / 3, y: arrowCommonY };
      break;
  }
  switch (alignment) {
    case "start":
      coords[oppositeAxis] -= commonAlign;
      arrowCoords[oppositeAxis] += commonAlign;
      break;
    case "end":
      coords[oppositeAxis] += commonAlign;
      arrowCoords[oppositeAxis] -= commonAlign;
      break;
  }

  coords = Offset(coords, side, offset, arrowSize);

  return { coords, arrowCoords };
}

/**
 * Calculates the offset coordinates for a popover based on the given offsets and arrow size.
 * @param coords - The initial coordinates of the popover.
 * @param side - The side of the popover where the offset should be applied (top, bottom, right, left).
 * @param offset - The offset value or an object containing mainAxis and crossAxis offsets.
 * @param arrowSize - The size of the arrow on the popover.
 * @returns The updated coordinates after applying the offset.
 */
function Offset(coords: Coords, side: Side, offset: number | { mainAxis?: number; crossAxis?: number }, arrowSize: number) {
  const arrowOffset = arrowSize / 3;
  const mainOffset = typeof offset === "number" ? offset + arrowOffset : (offset.mainAxis ?? 0) + arrowOffset;
  const crossOffset = typeof offset === "number" ? 0 : offset.crossAxis ?? 0;

  const offsetMap = {
    top: { y: coords.y - mainOffset, x: coords.x + crossOffset },
    bottom: { y: coords.y + mainOffset, x: coords.x + crossOffset },
    right: { x: coords.x + mainOffset, y: coords.y + crossOffset },
    left: { x: coords.x - mainOffset, y: coords.y + crossOffset },
  };

  return offsetMap[side];
}

/**
 * Determines the best placement for a popover based on the trigger and popover rectangles,
 * the boundary of the container, and an set placement.
 *
 * @remarks
 * This function uses the `DetectOverflow` function to determine the overflow of the popover
 * relative to the container boundary, and then calculates the overflow for each possible
 * placement. It then filters the placements based on the initial placement's overflow and
 * returns the best placement.
 *
 * @param boundary - The boundary of the container.
 * @param rects - The trigger and popover rectangles.
 * @param initialPlacement - The initial placement.
 * @returns The best placement for the popover.
 */
function Flip(
  container: HTMLElement,
  trigger: HTMLElement,
  popover: HTMLElement,
  initialPlacement: Placement,
  strategy: Strategy,
  padding: Inset,
  offset: number | { mainAxis?: number; crossAxis?: number },
  arrowSize: number,
) {
  // Temporarily remove the transform to get the correct bounding rect
  const originalTransform = popover.style.transform;
  popover.style.transform = "none";

  const windowRect = getWindowRect(container);
  const triggerRect = getStrategisedElementRect(container, trigger, strategy);
  const popoverRect = getStrategisedElementRect(container, popover, strategy);
  const boundary: Inset = {
    top: windowRect.top + padding.top,
    bottom: windowRect.bottom - padding.bottom,
    left: windowRect.left + padding.left,
    right: windowRect.right - padding.right,
  };

  const PLACEMENTS = getFallbackPlacements(initialPlacement);
  const OVERFLOW = DetectOverflow(boundary, popover.getBoundingClientRect());

  // Restore the transform after getting the bounding rect
  popover.style.transform = originalTransform;

  // Map each placement to its overflow data
  const overflowsData = PLACEMENTS.map((placement) => {
    const [side, alignment] = parsePlacement(placement);
    const axis = getAxis(placement);

    // Get the overflow for the side and its adjacent sides
    const overflows = [
      OVERFLOW[side],
      OVERFLOW[getPlacementOverflowSides(axis, alignment, side === placement)[0]],
      OVERFLOW[getPlacementOverflowSides(axis, alignment, side === placement)[1]],
    ];

    return { placement, overflows };
  });

  // If the initial placement side overflows, remove the opposite placements from consideration
  // Otherwise, remove the initial placements from consideration
  if (OVERFLOW[parsePlacement(initialPlacement)[0]] < 0) {
    overflowsData.splice(PLACEMENTS.length / 2, PLACEMENTS.length / 2);
  } else {
    overflowsData.splice(0, PLACEMENTS.length / 2);
  }

  let placement;
  if (overflowsData[0].overflows[1] < 0 && overflowsData[0].overflows[2] < 0) {
    // Gives priority to the same alignment as the initial placement
    // if it doesn't overflow (e.g., "top-start" -> "bottom-start" over "bottom-end")
    placement = overflowsData[0].placement;
  } else {
    // Sort the placements by their overflow on the adjacent sides
    // and return the placement with the least overflowing
    placement = overflowsData.sort((a, b) => a.overflows[1] - b.overflows[1]).sort((a, b) => a.overflows[2] - b.overflows[2])[0].placement;
  }

  const [side, alignment] = parsePlacement(initialPlacement);
  const [newSide, newAlignment] = parsePlacement(placement);
  const axis = getAxis(placement);

  const arrowOffset = arrowSize / 3;
  const mainOffset = (typeof offset === "number" ? offset + arrowOffset : (offset.mainAxis ?? 0) + arrowOffset) * 2;
  const crossOffset = typeof offset === "number" ? 0 : (offset.crossAxis ?? 0) * 2;

  let x: [number, number] = [0, 0];
  let y: [number, number] = [0, 0];

  const commonX = triggerRect.width + popoverRect.width + mainOffset;
  const commonY = triggerRect.height + popoverRect.height + mainOffset;
  const arrowCommonX = popoverRect.width - arrowOffset;
  const arrowCommonY = popoverRect.height - arrowOffset;
  switch (`${side}->${newSide}`) {
    case "top->bottom":
      y = [commonY, -arrowCommonY];
      break;
    case "bottom->top":
      y = [-commonY, arrowCommonY];
      break;
    case "left->right":
      x = [commonX, -arrowCommonX];
      break;
    case "right->left":
      x = [-commonX, arrowCommonX];
      break;
  }

  const commonHorizontalShift = popoverRect.width - triggerRect.width + crossOffset;
  const commonVerticalShift = popoverRect.height - triggerRect.height + crossOffset;
  const commonXShift = triggerRect.x - popoverRect.x + crossOffset;
  const commonYShift = triggerRect.y - popoverRect.y + crossOffset;
  switch (`${alignment}->${newAlignment}`) {
    case "start->end":
      axis === "y" ? (x = [-commonHorizontalShift, commonHorizontalShift]) : (y = [-commonVerticalShift, commonVerticalShift]);
      break;
    case "end->start":
      axis === "y" ? (x = [commonHorizontalShift, -commonHorizontalShift]) : (y = [commonVerticalShift, -commonVerticalShift]);
      break;
    case "undefined->start":
      axis === "y" ? (x = [commonXShift, -commonXShift]) : (y = [commonYShift, -commonYShift]);
      break;
    case "undefined->end":
      axis === "y" ? (x = [-commonXShift, commonXShift]) : (y = [-commonYShift, commonYShift]);
      break;
  }

  const translate = `${x[0]}px ${y[0]}px`;
  const translateArrow = `${x[1]}px ${y[1]}px`;

  return { placement, translate, translateArrow };
}

/**
 * Calculates the overflow of a popover element relative to a boundary element.
 * Values above 0 indicate overflow (out of bounds).
 *
 * @param boundary The boundary element's inset.
 * @param popoverRect The popover element's rect.
 * @returns An object containing the overflow values for top, bottom, left, and right.
 */
function DetectOverflow(boundary: Inset, popoverRect: Rect): Inset {
  const popoverClientRect = {
    ...popoverRect,
    top: popoverRect.y,
    bottom: popoverRect.y + popoverRect.height,
    left: popoverRect.x,
    right: popoverRect.x + popoverRect.width,
  };

  return {
    top: boundary.top - popoverClientRect.top,
    bottom: popoverClientRect.bottom - boundary.bottom,
    left: boundary.left - popoverClientRect.left,
    right: popoverClientRect.right - boundary.right,
  };
}

//#region Utils

//#region Parsing and Placement Manipulation Functions

/**
 * Parses a placement string into a tuple of side and alignment.
 * 
 * @param placement - The placement string to parse.
 * @returns A tuple of side and alignment.

 * @example
 * ```typescriptreact
 * const [side, alignment] = parsePlacement("top-start"); // ["top", "start"]
 * ```
 */
export function parsePlacement(placement: Placement): [Side, Alignment | undefined] {
  return placement.split("-") as [Side, Alignment];
}

/**
 * Returns the axis of the side of the popover based on its placement.
 *
 * @param placement - The placement of the popover.
 * @returns The axis ("x" or "y") corresponding to the side of the popover.
 *
 * @example
 * ```typescriptreact
 * const oppositeAxis = getOppositeAxis("top-start"); // "y"
 * ```
 */
function getAxis(placement: Placement): Axis {
  return ["top", "bottom"].includes(parsePlacement(placement)[0]) ? "y" : "x";
}

/**
 * Returns the opposite axis of the given placement.
 *
 * @param placement - The placement to get the opposite axis for.
 * @returns The opposite axis of the given placement.
 *
 * @example
 * ```typescriptreact
 * const oppositeAxis = getOppositeAxis("top-start"); // "x"
 * ```
 */
function getOppositeAxis(placement: Placement): Axis {
  return ["top", "bottom"].includes(parsePlacement(placement)[0]) ? "x" : "y";
}

/**
 * Returns the length of the opposite axis of the given placement.
 *
 * @param placement - The placement of the popover.
 * @returns The length of the opposite axis.
 *
 * @example
 * ```typescriptreact
 * const oppositeAxisLength = getOppositeAxisLength("left"); // "height"
 * ```
 */
function getOppositeAxisLength(placement: Placement): Length {
  return ["top", "bottom"].includes(parsePlacement(placement)[0]) ? "width" : "height";
}

/**
 * Returns an array of fallback placements based on the provided placement.
 *
 * @param placement - The placement to generate fallback placements for.
 * @returns An array of fallback placements.
 *
 * @example
 * ```typescriptreact
 * // ["top-start", "top-end", "bottom-start", "bottom-end"]
 * const fallbackPlacements = getFallbackPlacements("top-start");
 * ---
 * // ["bottom", "bottom-start", "bottom-end", "top", "top-start", "top-end"]
 * const fallbackPlacements = getFallbackPlacements("bottom");
 * ```
 */
function getFallbackPlacements(placement: Placement): Placement[] {
  const oppositeSideMap = { top: "bottom" as Side, right: "left" as Side, bottom: "top" as Side, left: "right" as Side };
  const oppositeAlignmentMap = { start: "end" as Alignment, end: "start" as Alignment };

  const [side, alignment] = placement.split("-") as [Side, Alignment];
  const oppositeSide = oppositeSideMap[side];
  const oppositeAlignment = alignment && oppositeAlignmentMap[alignment];

  const placements: Placement[] = alignment
    ? [`${side}-${alignment}`, `${side}-${oppositeAlignment}`, `${oppositeSide}-${alignment}`, `${oppositeSide}-${oppositeAlignment}`]
    : [side, `${side}-start`, `${side}-end`, oppositeSide, `${oppositeSide}-start`, `${oppositeSide}-end`];

  return placements;
}

//#endregion

//#region Positioning and Dimensions Functions

/**
 * Finds the two sides that correspond to overflowing for the given placement.
 * If the placement is the base placement, the two sides will be the opposite sides of the axis.
 *
 * @param axis The placement axis ("x" or "y").
 * @param alignment The popover alignment ("start" or "end").
 * @param isBasePlacement Whether the placement is the base placement.
 * @returns An array of two sides that are corresponding to overflowing for the given placement.
 */
function getPlacementOverflowSides(axis: Axis, alignment: Alignment | undefined, isBasePlacement: boolean): [Side, Side] {
  if (isBasePlacement) return axis === "x" ? ["top", "bottom"] : ["left", "right"];
  if (axis === "x") return alignment === "start" ? ["bottom", "bottom"] : ["top", "top"];
  else return alignment === "start" ? ["right", "right"] : ["left", "left"];
}

/**
 * This function calculates the Inset (top, right, bottom, left) of a given element.
 * It first checks if the element is overflowing its parent.
 * If it is, it returns the bounding rectangle of the parent element.
 * If it's not, or if the element has no parent, it returns the dimensions of the viewport.
 *
 * @param element - The element to calculate the Inset for.
 * @returns If the element is overflowing its parent, the Inset of the parent is returned.
 * Otherwise, the dimensions of the viewport are returned.
 */
function getWindowRect(element: HTMLElement): Inset {
  const elementRect = element.getBoundingClientRect();
  const parent = element.parentElement;

  if (parent) {
    const parentRect = parent.getBoundingClientRect();
    const isOverflowing =
      elementRect.top < parentRect.top ||
      elementRect.right > parentRect.right ||
      elementRect.bottom > parentRect.bottom ||
      elementRect.left < parentRect.left;

    if (isOverflowing) {
      return {
        top: parentRect.top,
        right: parentRect.right,
        bottom: parentRect.bottom,
        left: parentRect.left,
      };
    }
  }

  return {
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0,
  };
}

/**
 * Returns the position and size of an element relative to its container.
 *
 * @param element The element to get the position and size of.
 * @param containerRect The container element's position and size. Defaults to the document element.
 * @returns An object containing the position and size of the element relative to its container.
 * - `x`: The horizontal position of the element relative to its container.
 * - `y`: The vertical position of the element relative to its container.
 * - `width`: The width of the element.
 * - `height`: The height of the element.
 *
 * @example
 * const element = document.getElementById('my-element');
 * const elementRect = getElementRect(element);
 * console.log(elementRect); // { x, y, width, height }
 */
function getRect(element: HTMLElement, containerRect?: Rect): Rect {
  const { top, left, width, height } = element.getBoundingClientRect();
  const { scrollTop, scrollLeft } = element;

  if (!containerRect) {
    const { top, left, width, height } = document.body.getBoundingClientRect();
    const { scrollTop, scrollLeft } = document.body;

    containerRect = {
      y: top - scrollTop,
      x: left - scrollLeft,
      width,
      height,
    };
  }

  return {
    y: top - scrollTop - containerRect.y,
    x: left - scrollLeft - containerRect.x,
    width,
    height,
  };
}

/**
 * Calculates the position and size of an element relative to a container based on a given strategy.
 * @param container The container element.
 * @param element The element whose position and size will be calculated.
 * @param strategy The strategy to use for calculating the element's position and size.
 * @returns The calculated position and size of the element.
 */
function getStrategisedElementRect(container: HTMLElement, element: HTMLElement, strategy: string) {
  const containerDOMRect = container.getBoundingClientRect(); // relative to container
  const containerRect = getRect(container); // relative to viewport

  return strategy === "fixed" ? getRect(element, containerRect) : getRect(element, containerDOMRect);
}

//#endregion

/**
 * Returns the transform origin based on the given placement.
 * @param placement - The placement of the popover.
 * @returns The transform origin string.
 */
function getTransformOrigin(placement: Placement) {
  const [side, alignment] = parsePlacement(placement);
  const axis = getAxis(placement);

  const oppositeSideMap = { top: "bottom" as Side, right: "left" as Side, bottom: "top" as Side, left: "right" as Side };

  let transformOrigin: string = oppositeSideMap[side];
  if (alignment === "start") transformOrigin = axis === "y" ? `${transformOrigin} left` : `top ${transformOrigin}`;
  else if (alignment === "end") transformOrigin = axis === "y" ? `${transformOrigin} right` : `bottom ${transformOrigin}`;

  return transformOrigin;
}

/**
 * Converts a number or an array of numbers into an `Inset` object.
 *
 * @param value - The number or array of numbers to convert.
 * @returns The `Inset` object with the converted values.
 *
 * @example
 * // Single number
 * const inset1 = getInsetValues(10);
 * // inset1 = { top: 10, right: 10, bottom: 10, left: 10 }
 *
 * // Array of numbers
 * const inset2 = getInsetValues([5, 10, 15, 20]);
 * // inset2 = { top: 5, right: 10, bottom: 15, left: 20 }
 */
function toInsetValue(value: number | [number, number, number, number]): Inset {
  return typeof value === "number"
    ? { top: value, right: value, bottom: value, left: value }
    : { top: value[0], right: value[1], bottom: value[2], left: value[3] };
}

//#endregion
