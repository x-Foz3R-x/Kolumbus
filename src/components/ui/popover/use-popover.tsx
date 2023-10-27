import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Alignment, Container, Coords, MountedExtensions, Placement, Rect, Inset, Side, Axis, Length } from "./types";

/**
 * A hook that calculates the position of a popover relative to a target element.
 *
 * @remarks
 * This hook uses the `computePosition` function to calculate the position of the popover based on the target element, the popover element, and the specified placement. It also updates the position of the popover when the window is resized or scrolled.
 *
 * @param popoverRef - A ref to the popover element.
 * @param targetRef - A ref to the target element.
 * @param isOpen - Whether the popover is currently open.
 * @param placement - The placement of the popover relative to the target element.
 * @param container - The container element for the popover.
 * @param extensions - Additional options for the popover.
 * @returns An object containing the popover, arrow, and motion styles, as well as an `update` function to update the position of the popover.
 *
 * @example
 * function MyComponent() {
 *   const targetRef = useRef(null);
 *   const popoverRef = useRef(null);
 *   const { props } = usePopover({
 *     popoverRef,
 *     targetRef,
 *     isOpen: true,
 *     placement: 'bottom',
 *     container: { selector: '#container', margin: 10, padding: 10 },
 *     extensions: { offset: { value: 10 }, flip: true, arrow: { size: 8 }, prevent: { scroll: false } },
 *   });
 *
 *   return (
 *     <div id="container">
 *       <div ref={targetRef}>Target element</div>
 *       <div ref={popoverRef} style={props.popover.style}>
 *         Popover content
 *         <div ref={arrowRef} style={props.arrow.style} />
 *       </div>
 *     </div>
 *   );
 * }
 */
export default function usePopover(
  popoverRef: React.RefObject<HTMLElement>,
  targetRef: React.RefObject<HTMLElement>,
  isOpen: boolean,
  placement: Placement,
  container: Container,
  extensions: MountedExtensions
) {
  const [data, setData] = useState<{
    coords: { x: number | string; y: number | string };
    arrowCoords: { x: number; y: number };
    transformOrigin?: string;
    settedPlacement: Placement;
  }>({
    settedPlacement: placement,
    coords: extensions.position ? { x: extensions.position.x, y: extensions.position.y } : { x: 0, y: 0 },
    arrowCoords: { x: 0, y: 0 },
    transformOrigin: extensions.position ? extensions.position.transformOrigin : undefined,
  });

  const update = useCallback(() => {
    if (!targetRef?.current || !popoverRef?.current || !isOpen || extensions.position) return;

    const containerMargin =
      typeof container.margin === "number"
        ? { top: container.margin, right: container.margin, bottom: container.margin, left: container.margin }
        : { top: container.margin[0], right: container.margin[1], bottom: container.margin[2], left: container.margin[3] };
    const containerPadding =
      typeof container.padding === "number"
        ? { top: container.padding, right: container.padding, bottom: container.padding, left: container.padding }
        : { top: container.padding[0], right: container.padding[1], bottom: container.padding[2], left: container.padding[3] };

    const offset = extensions.offset?.value ?? 0;
    const flip = !!extensions.flip ?? false;
    const arrowSize = extensions.arrow?.size ?? 0;

    const computedPosition = computePosition(
      document.querySelector(container.selector) ?? document.body,
      targetRef.current,
      popoverRef.current,
      placement,
      containerMargin,
      containerPadding,
      offset,
      flip,
      arrowSize
    );

    if (computedPosition !== data) setData(computedPosition);
  }, [popoverRef, targetRef, isOpen, placement, container, extensions]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update position when popover is opened, closed or any of the dependencies change
  useLayoutEffect(update, [update, popoverRef, targetRef, placement, container, extensions]);

  // Update position when window is resized or scrolled (if prevent.scroll is false)
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
    const popover = { style: { top: data.coords.y, left: data.coords.x } };

    const arrowSize = `${(extensions.arrow?.size ?? 0) / 16}rem`;
    const arrow = { style: { top: data.arrowCoords.y, left: data.arrowCoords.x, width: arrowSize, height: arrowSize } };

    const motion = { style: { transformOrigin: data.transformOrigin } };
    return { popover, arrow, motion };
  }, [data, extensions.arrow]);

  return useMemo(() => ({ placement: data.settedPlacement, props, update }), [data.settedPlacement, props, update]);
}

/**
 * Computes the position of a popover element relative to a target element and a container element.
 *
 * @param container - The container element that the popover is positioned within.
 * @param target - The target element that the popover is positioned relative to.
 * @param popover - The popover element that is being positioned.
 * @param placement - The initial placement of the popover relative to the target element.
 * @param margin - The margin of the popover element.
 * @param padding - The padding of the popover element.
 * @param offset - The offset of the popover element from the target element.
 * @param shouldFlip - Whether or not the popover should flip to the opposite side if there is not enough space.
 * @param arrowSize - The size of the arrow element on the popover.
 * @returns An object containing the computed placement, coordinates, arrow coordinates, and transform origin of the popover element.
 */
function computePosition(
  container: Element,
  target: Element,
  popover: Element,
  placement: Placement,
  margin: Inset,
  padding: Inset,
  offset: number,
  shouldFlip: boolean,
  arrowSize: number
) {
  const documentRect = document.documentElement.getBoundingClientRect();
  const boundary: Inset = {
    top: margin.top + padding.top,
    bottom: documentRect.height - (margin.bottom + padding.bottom),
    left: margin.left + padding.left,
    right: documentRect.width - (margin.right + padding.right),
  };
  const elementsRect = {
    container: getElementRect(container),
    target: getElementRect(target, getElementRect(container)),
    popover: getElementRect(popover, getElementRect(container)),
  };

  if (shouldFlip) {
    const elementsAbsoluteRect = {
      target: getElementRect(target),
      popover: getElementRect(popover),
    };

    const { coords: absoluteCoords } = computeCoords(elementsAbsoluteRect, placement, offset, arrowSize);
    elementsRect.popover = { ...elementsRect.popover, ...absoluteCoords };

    placement = Flip(boundary, elementsRect, placement);
  }

  const { coords, arrowCoords } = computeCoords(elementsRect, placement, offset, arrowSize);
  const transformOrigin = computeTransformOrigin(parsePlacement(placement), getAxis(placement));

  return { settedPlacement: placement, coords, arrowCoords, transformOrigin };
}

/**
 * Computes the coordinates for a popover based on the target element's position and the desired placement.
 *
 * @param rects An object containing the target element's and popover's size and positions.
 * @param placement The desired placement of the popover relative to the target element.
 * @param offset The offset distance between the popover and the target element.
 * @param arrowSize The size of the arrow on the popover.
 * @returns An object containing the coordinates for the popover and its arrow.
 */
function computeCoords(rects: { target: Rect; popover: Rect }, placement: Placement, offset: number, arrowSize: number) {
  const [side, alignment] = parsePlacement(placement);
  const oppositeAxis = getOppositeAxis(placement);
  const oppositeLength = getOppositeAxisLength(placement);

  const commonX = rects.target.x + rects.target.width / 2 - rects.popover.width / 2;
  const commonY = rects.target.y + rects.target.height / 2 - rects.popover.height / 2;
  const commonAlign = rects.target[oppositeLength] / 2 - rects.popover[oppositeLength] / 2;
  const arrowCommonX = rects.popover.width / 2 - arrowSize / 2;
  const arrowCommonY = rects.popover.height / 2 - arrowSize / 2;

  let coords: Coords;
  let arrowCoords: Coords;
  switch (side) {
    case "top":
      coords = { x: commonX, y: rects.target.y - rects.popover.height };
      arrowCoords = { x: arrowCommonX, y: rects.popover.height - arrowSize / 1.5 };
      break;
    case "bottom":
      coords = { x: commonX, y: rects.target.y + rects.target.height };
      arrowCoords = { x: arrowCommonX, y: -arrowSize / 3 };
      break;
    case "right":
      coords = { x: rects.target.x + rects.target.width, y: commonY };
      arrowCoords = { x: -arrowSize / 3, y: arrowCommonY };
      break;
    case "left":
      coords = { x: rects.target.x - rects.popover.width, y: commonY };
      arrowCoords = { x: rects.popover.width - arrowSize / 1.5, y: arrowCommonY };
      break;
    default:
      coords = { x: rects.target.y, y: rects.target.x };
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

  offset += arrowSize / 2;
  if (offset !== 0) coords = Offset(side, offset, coords);

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
  const oppositeSideMap = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };

  let transformOrigin = oppositeSideMap[side];
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
function Offset(side: Side, offset: number, coords: Coords) {
  const offsetMap = {
    top: { y: coords.y - offset },
    bottom: { y: coords.y + offset },
    right: { x: coords.x + offset },
    left: { x: coords.x - offset },
  };
  return { ...coords, ...offsetMap[side] };
}

/**
 * Determines the best placement for a popover based on the target and popover rectangles,
 * the boundary of the container, and an set placement.
 *
 * @remarks
 * This function uses the `DetectOverflow` function to determine the overflow of the popover
 * relative to the container boundary, and then calculates the overflow for each possible
 * placement. It then filters the placements based on the initial placement's overflow and
 * returns the best placement.
 *
 * @param boundary - The boundary of the container.
 * @param rects - The target and popover rectangles.
 * @param placement - The initial placement.
 * @returns The best placement for the popover.
 */
function Flip(boundary: Inset, rects: { target: Rect; popover: Rect }, placement: Placement): Placement {
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
  const oppositeSideMap: { top: Side; bottom: Side; right: Side; left: Side } = {
    top: "bottom",
    bottom: "top",
    right: "left",
    left: "right",
  };
  const oppositeAlignmentMap: { start: Alignment; end: Alignment } = {
    start: "end",
    end: "start",
  };

  const [side, alignment] = placement.split("-") as [Side, Alignment];
  const [oppositeSide, oppositeAlignment] = placement
    .replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side as Side])
    .split("-") as [Side, Alignment];

  let list: Placement[] = [];

  if (alignment) list.push(`${side}-${alignment}`, `${side}-${oppositeAlignmentMap[alignment]}`);
  else list.push(side, `${side}-start`, `${side}-end`);

  if (oppositeAlignment) list.push(`${oppositeSide}-${oppositeAlignment}`, `${oppositeSide}-${oppositeAlignmentMap[oppositeAlignment]}`);
  else list.push(oppositeSide, `${oppositeSide}-start`, `${oppositeSide}-end`);

  return list;
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
    const { top, left, width, height } = document.documentElement.getBoundingClientRect();
    const { scrollTop, scrollLeft } = document.documentElement;

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
 * Calculates the overflow of a popover element relative to a boundary element.
 * Values above 0 indicate overflow, values below 0 indicate underflow.
 *
 * @param boundary The boundary element's inset.
 * @param popoverRect The popover element's rect.
 * @returns An object containing the overflow values for top, bottom, left, and right.
 */
function DetectOverflow(boundary: Inset, popoverRect: Rect) {
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
