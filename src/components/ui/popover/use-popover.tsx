import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  Alignment,
  Container,
  Coords,
  MountedExtensions,
  Placement,
  Rect,
  Inset,
  Side,
  Axis,
  Length,
  DynamicCoords,
  SideMap,
} from "./types";

/**
 * A hook that calculates the position of a popover relative to a trigger element.
 *
 * @remarks
 * This hook uses the `computePosition` function to calculate the position of the popover based on the trigger element, the popover element, and the specified placement. It also updates the position of the popover when the window is resized or scrolled.
 *
 * @param popoverRef - A ref to the popover element.
 * @param triggerRef - A ref to the trigger element.
 * @param isOpen - Whether the popover is currently open.
 * @param initialPlacement - The placement of the popover relative to the trigger element.
 * @param container - The container element for the popover.
 * @param extensions - Additional options for the popover.
 * @returns An object containing the popover, arrow, and motion styles, as well as an `update` function to update the position of the popover.
 *
 * @example
 * function MyComponent() {
 *   const triggerRef = useRef(null);
 *   const popoverRef = useRef(null);
 *   const { props } = usePopover({
 *     popoverRef,
 *     triggerRef,
 *     isOpen: true,
 *     placement: 'bottom',
 *     container: { selector: '#container', margin: 10, padding: 10 },
 *     extensions: { offset: { value: 10 }, flip: true, arrow: { size: 8 }, prevent: { scroll: false } },
 *   });
 *
 *   return (
 *     <div id="container">
 *       <button ref={triggerRef}>Trigger element</button>
 *       <div ref={popoverRef} style={props.popover.style}>
 *         Popover content
 *         <div ref={arrowRef} style={props.arrow.style} />
 *       </div>
 *     </div>
 *   );
 * }
 */
export default function usePopover(
  triggerRef: React.RefObject<HTMLElement>,
  popoverRef: React.RefObject<HTMLElement>,
  isOpen: boolean,
  initialPlacement: Placement,
  container: Container,
  extensions: MountedExtensions,
) {
  type Data = { placement: Placement; coords: DynamicCoords; arrowCoords: Coords; transformOrigin?: string };
  const [data, setData] = useState<Data>({
    placement: initialPlacement,
    coords: { x: 0, y: 0 },
    arrowCoords: { x: 0, y: 0 },
    transformOrigin: undefined,
  });

  const containerMargin = useMemo(() => getInsetValues(container.margin ?? 0), [container.margin]);
  const containerPadding = useMemo(() => getInsetValues(container.padding ?? 0), [container.padding]);

  const update = useCallback(() => {
    if (!triggerRef?.current || !popoverRef?.current || !isOpen || extensions.position) return;

    const computedPosition = computePosition(
      document.querySelector(container.selector) ?? document.body,
      triggerRef.current,
      popoverRef.current,
      initialPlacement,
      containerMargin,
      containerPadding,
      !!extensions.flip ?? false,
      extensions.offset?.value ?? 0,
      extensions.arrow?.size ?? 0,
    );

    setData(computedPosition);
  }, [popoverRef, triggerRef, isOpen, initialPlacement, container.selector, containerMargin, containerPadding, extensions]);

  // Update position when popover is opened
  useLayoutEffect(update, [popoverRef, triggerRef, isOpen, initialPlacement]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update position when window is resized or scrolled
  useLayoutEffect(() => {
    window.addEventListener("resize", update);
    if (!extensions.prevent?.scroll) window.addEventListener("scroll", update, true);

    return () => {
      window.removeEventListener("resize", update);
      if (!extensions.prevent?.scroll) window.removeEventListener("scroll", update, true);
    };
  }, [update, extensions.prevent]);

  // Calculate and memoize the popover, arrow, and motion styles
  const props = useMemo(() => {
    const popover = {
      style: extensions.position
        ? { top: extensions.position.y, left: extensions.position.x, transformOrigin: extensions.position.transformOrigin }
        : { top: data.coords.y, left: data.coords.x, transformOrigin: data.transformOrigin },
    };

    const arrowSize = `${(extensions.arrow?.size ?? 0) / 16}rem`;
    const arrow = { style: { top: data.arrowCoords.y, left: data.arrowCoords.x, width: arrowSize, height: arrowSize } };

    return { popover, arrow };
  }, [data, extensions.arrow, extensions.position]);

  return useMemo(() => ({ placement: data.placement, props }), [data.placement, props]);
}

/**
 * Computes the position of a popover element relative to a trigger element and a container element.
 *
 * @param container - The container element that the popover is positioned within.
 * @param trigger - The trigger element that the popover is positioned relative to.
 * @param popover - The popover element that is being positioned.
 * @param placement - The initial placement of the popover relative to the trigger element.
 * @param margin - The margin of the popover element.
 * @param padding - The padding of the popover element.
 * @param offset - The offset of the popover element from the trigger element.
 * @param flip - Whether or not the popover should flip to the opposite side if there is not enough space.
 * @param arrowSize - The size of the arrow element on the popover.
 * @returns An object containing the computed placement, coordinates, arrow coordinates, and transform origin of the popover element.
 */
function computePosition(
  container: Element,
  trigger: Element,
  popover: Element,
  placement: Placement,
  margin: Inset,
  padding: Inset,
  flip: boolean,
  offset: number,
  arrowSize: number,
) {
  const documentRect = document.body.getBoundingClientRect();
  const boundary: Inset = {
    top: margin.top + padding.top,
    bottom: documentRect.height - (margin.bottom + padding.bottom),
    left: margin.left + padding.left,
    right: documentRect.width - (margin.right + padding.right),
  };
  const elementsRect = {
    container: getElementRect(container),
    trigger: getElementRect(trigger, getElementRect(container)),
    popover: getElementRect(popover, getElementRect(container)),
  };

  if (flip) {
    const elementsAbsoluteRect = { trigger: getElementRect(trigger), popover: getElementRect(popover) };

    const { coords: absoluteCoords } = computeCoords(elementsAbsoluteRect, placement, offset, arrowSize);
    elementsRect.popover = { ...elementsRect.popover, ...absoluteCoords };

    placement = Flip(boundary, elementsRect, placement);
  }

  const { coords, arrowCoords } = computeCoords(elementsRect, placement, offset, arrowSize);
  const transformOrigin = computeTransformOrigin(parsePlacement(placement), getAxis(placement));

  return { placement, coords, arrowCoords, transformOrigin };
}

/**
 * Computes the coordinates for a popover based on the trigger element's position and the desired placement.
 *
 * @param rects An object containing the trigger element's and popover's size and positions.
 * @param placement The desired placement of the popover relative to the trigger element.
 * @param offset The offset distance between the popover and the trigger element.
 * @param arrowSize The size of the arrow on the popover.
 * @returns An object containing the coordinates for the popover and its arrow.
 */
function computeCoords(rects: { trigger: Rect; popover: Rect }, placement: Placement, offset: number, arrowSize: number) {
  const [side, alignment] = parsePlacement(placement);
  const oppositeAxis = getOppositeAxis(placement);
  const oppositeLength = getOppositeAxisLength(placement);

  const commonX = rects.trigger.x + rects.trigger.width / 2 - rects.popover.width / 2;
  const commonY = rects.trigger.y + rects.trigger.height / 2 - rects.popover.height / 2;
  const commonAlign = rects.trigger[oppositeLength] / 2 - rects.popover[oppositeLength] / 2;
  const arrowCommonX = rects.popover.width / 2 - arrowSize / 2;
  const arrowCommonY = rects.popover.height / 2 - arrowSize / 2;

  let coords: Coords;
  let arrowCoords: Coords;
  switch (side) {
    case "top":
      coords = { x: commonX, y: rects.trigger.y - rects.popover.height };
      arrowCoords = { x: arrowCommonX, y: rects.popover.height - arrowSize / 1.5 };
      break;
    case "bottom":
      coords = { x: commonX, y: rects.trigger.y + rects.trigger.height };
      arrowCoords = { x: arrowCommonX, y: -arrowSize / 3 };
      break;
    case "right":
      coords = { x: rects.trigger.x + rects.trigger.width, y: commonY };
      arrowCoords = { x: -arrowSize / 3, y: arrowCommonY };
      break;
    case "left":
      coords = { x: rects.trigger.x - rects.popover.width, y: commonY };
      arrowCoords = { x: rects.popover.width - arrowSize / 1.5, y: arrowCommonY };
      break;
    default:
      coords = { x: rects.trigger.y, y: rects.trigger.x };
      arrowCoords = { x: 0, y: 0 };
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

  offset += arrowSize / 3;
  if (offset !== 0) coords = Offset(coords, side, offset);

  return { coords, arrowCoords };
}

/**
 * Computes the transform origin for a popover based on its side, alignment and axis.
 * @param side The side of the popover.
 * @param alignment The alignment of the popover.
 * @param axis The axis of the popover.
 * @returns The computed transform origin.
 */
function computeTransformOrigin([side, alignment]: [Side, Alignment | undefined], axis: Axis) {
  const oppositeSideMap: SideMap = { top: "bottom", right: "left", bottom: "top", left: "right" };

  let transformOrigin: string = oppositeSideMap[side];
  if (alignment === "start") transformOrigin = axis === "y" ? `${transformOrigin} left` : `top ${transformOrigin}`;
  else if (alignment === "end") transformOrigin = axis === "y" ? `${transformOrigin} right` : `bottom ${transformOrigin}`;

  return transformOrigin;
}

/**
 * Calculates the offset coordinates for a popover based on the offset value.
 * @param side - The side of the popover.
 * @param offset - The offset value to apply to the popover.
 * @param coords - The original coordinates of the popover.
 * @returns The new coordinates of the popover with the applied offset.
 */
function Offset(coords: Coords, side: Side, offset: number) {
  const offsetMap = {
    top: { y: coords.y - offset },
    bottom: { y: coords.y + offset },
    right: { x: coords.x + offset },
    left: { x: coords.x - offset },
  };
  return { ...coords, ...offsetMap[side] };
}

// TODO: instead of finding and returning the best placement, return x, y translate values to modify existing placement rather than recalculating new placement positions.
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
 * @param placement - The initial placement.
 * @returns The best placement for the popover.
 */
function Flip(boundary: Inset, rects: { trigger: Rect; popover: Rect }, placement: Placement): Placement {
  const PLACEMENTS = getFallbackPlacements(placement);
  const OVERFLOW = DetectOverflow(boundary, rects.popover);

  const overflowsData = PLACEMENTS.map((placement) => {
    const [side, alignment] = parsePlacement(placement);
    const axis = getAxis(placement);

    const overflows = [
      OVERFLOW[side],
      OVERFLOW[getPlacementOverflowSides(axis, alignment, side === placement)[0]],
      OVERFLOW[getPlacementOverflowSides(axis, alignment, side === placement)[1]],
    ];
    return { placement, overflows };
  });

  // Filter placements to retain either the initial or opposite side based on the initial side's overflow.
  if (OVERFLOW[parsePlacement(placement)[0]] < 0) {
    overflowsData.splice(PLACEMENTS.length / 2, PLACEMENTS.length / 2);
  } else {
    overflowsData.splice(0, PLACEMENTS.length / 2);
  }

  // Return placement without alignment if it doesn't overflow.
  if (overflowsData[0].overflows[1] < 0 && overflowsData[0].overflows[2] < 0) {
    return overflowsData[0].placement;
  }

  // Sort and return the placement with the least overflow.
  return overflowsData.sort((a, b) => a.overflows[1] - b.overflows[1]).sort((a, b) => a.overflows[2] - b.overflows[2])[0].placement;
}

//#region Utils
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
  const oppositeSideMap: SideMap = { top: "bottom", right: "left", bottom: "top", left: "right" };
  const oppositeAlignmentMap: { start: Alignment; end: Alignment } = { start: "end", end: "start" };

  const [side, alignment] = placement.split("-") as [Side, Alignment];
  const oppositeSide = oppositeSideMap[side];
  const oppositeAlignment = alignment && oppositeAlignmentMap[alignment];

  const placements: Placement[] = alignment
    ? [
        `${side}-${alignment}`,
        `${side}-${oppositeAlignmentMap[alignment]}`,
        `${oppositeSide}-${oppositeAlignment}`,
        `${oppositeSide}-${oppositeAlignmentMap[oppositeAlignment]}`,
      ]
    : [side, `${side}-start`, `${side}-end`, oppositeSide, `${oppositeSide}-start`, `${oppositeSide}-end`];

  return placements;
}

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
function getElementRect(element: Element, containerRect?: Rect): Rect {
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
function getInsetValues(value: number | [number, number, number, number]): Inset {
  return typeof value === "number"
    ? { top: value, right: value, bottom: value, left: value }
    : { top: value[0], right: value[1], bottom: value[2], left: value[3] };
}

/**
 * Calculates the overflow of a popover element relative to a boundary element.
 * Values above 0 indicate overflow, values below 0 indicate underflow.
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
//#endregion
