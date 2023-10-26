import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  Alignment,
  Container,
  Coords,
  Dimensions,
  MountedExtensions,
  Placement,
  PopoverData,
  Rect,
  Inset,
  Side,
  Axis,
  Length,
} from "./types";

type UsePopoverProps = {
  popoverRef: React.RefObject<HTMLElement>;
  targetRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  placement: Placement;
  container: Container;
  extensions: MountedExtensions;
};
export default function usePopover({ popoverRef, targetRef, isOpen, placement, container, extensions }: UsePopoverProps) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<PopoverData>({
    coords: { x: 0, y: 0 },
    arrowCoords: { x: 0, y: 0 },
    maxWidth: undefined,
    maxHeight: undefined,
    transformOrigin: undefined,
    isPositioned: false,
  });

  const update = useCallback(() => {
    if (!targetRef?.current || !popoverRef?.current) return;

    const containerMargin =
      typeof container.margin === "number"
        ? { top: container.margin, bottom: container.margin, left: container.margin, right: container.margin }
        : { top: container.margin[0], bottom: container.margin[2], left: container.margin[3], right: container.margin[1] };
    const containerPadding =
      typeof container.padding === "number"
        ? { top: container.padding, bottom: container.padding, left: container.padding, right: container.padding }
        : { top: container.padding[0], bottom: container.padding[2], left: container.padding[3], right: container.padding[1] };
    const offset = extensions.offset?.value ?? 0;
    const arrowSize = extensions.arrow?.size ?? 0;
    const flip = (!!extensions.flip && mounted) ?? false;

    if (!mounted) setMounted(true);

    const fullData = {
      ...computePosition(
        document.querySelector(container.selector) ?? document.body,
        targetRef.current,
        popoverRef.current,
        placement,
        containerMargin,
        containerPadding,
        offset,
        arrowSize,
        flip
      ),
      isPositioned: true,
    };

    if (fullData !== data) setData(fullData);
  }, [popoverRef, targetRef, isOpen, placement, container, mounted, extensions]); // eslint-disable-line

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

  useLayoutEffect(() => {
    if (isOpen === false && data.isPositioned) setData((data) => ({ ...data, isPositioned: false }));
  }, [isOpen]); // eslint-disable-line

  const props = useMemo(() => {
    const popover = { style: { top: data.coords.y, left: data.coords.x, maxWidth: data.maxWidth, maxHeight: data.maxHeight } };

    const arrowSize = `${(extensions.arrow?.size ?? 0) / 16}rem`;
    const arrow = { style: { top: data.arrowCoords.y, left: data.arrowCoords.x, width: arrowSize, height: arrowSize } };

    const motion = { style: { transformOrigin: data.transformOrigin } };
    return { popover, arrow, motion };
  }, [data, extensions.arrow]);

  return useMemo(() => ({ ...data, update, props }), [data, update, props]);
}

function computePosition(
  container: Element,
  target: Element,
  popover: Element,
  placement: Placement,
  margin: Inset,
  padding: Inset,
  offset: number,
  arrowSize: number,
  flip: boolean
) {
  const elementsRect = {
    target: getElementRect(target, getElementRect(container)),
    popover: getElementRect(popover, getElementRect(container)),
  };
  const elementsAbsoluteRect = {
    target: getElementRect(target),
    popover: getElementRect(popover),
  };

  const documentRect = document.documentElement.getBoundingClientRect();
  const boundary: Inset = {
    top: margin.top + padding.top,
    bottom: documentRect.height - (margin.bottom + padding.bottom),
    left: margin.left + padding.left,
    right: documentRect.width - (margin.right + padding.right),
  };
  const containerDimensions = getDimensions(container);
  const targetDimensions = getDimensions(target, containerDimensions);

  console.log("--------------------");

  const [side, alignment] = parsePlacement(placement);
  const sideAxis = getAxis(placement);
  const isVertical = sideAxis === "y";

  const { coords: absoluteCoords } = computeCoords(elementsAbsoluteRect, placement, offset, arrowSize);
  elementsRect.popover = { ...elementsRect.popover, ...absoluteCoords };

  if (flip) placement = Flip(boundary, elementsRect, placement);

  const { coords, arrowCoords } = computeCoords(elementsRect, placement, offset, arrowSize);
  const maxLengths = computeMaxLengths(containerDimensions, targetDimensions, placement, padding);
  const maxWidth = maxLengths.maxWidth;
  const maxHeight = maxLengths.maxHeight;
  const transformOrigin = computeTransformOrigin(side, alignment, isVertical);

  return { coords, arrowCoords, maxWidth, maxHeight, transformOrigin };
}
/**
 * Computes the coordinates for a popover based on the target dimensions, popover dimensions, placement, and arrow size.
 * @param targetRect The dimensions of the target element.
 * @param popoverRect The dimensions of the popover element.
 * @param placement The placement of the popover relative to the target element.
 * @param arrowSize The size of the arrow on the popover.
 * @returns An object containing the coordinates for the popover and arrow.
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

  if (offset !== 0) {
    offset += arrowSize / 2;
    coords = Offset(side, offset, coords);
  }

  return { coords, arrowCoords };
}
// todo finish
function computeMaxLengths(containerDimensions: Dimensions, targetDimensions: Dimensions, placement: Placement, padding: Inset) {
  const [side, alignment] = parsePlacement(placement);
  const oppositeLength = getOppositeAxisLength(placement);

  // const commonAlign = targetDimensions[alignLength] / 2 - popoverDimensions[alignLength] / 2;
  const commonWidth = containerDimensions.totalWidth - padding.left + padding.right;
  const commonHeight = containerDimensions.totalHeight - padding.top + padding.bottom;

  let maxWidth: number;
  let maxHeight: number;
  switch (side) {
    case "top":
      maxWidth = commonWidth;
      maxHeight =
        containerDimensions.totalHeight - (containerDimensions.totalHeight - targetDimensions.top - targetDimensions.height) - padding.top;
      break;
    case "bottom":
      maxWidth = commonWidth;
      maxHeight = containerDimensions.totalHeight - targetDimensions.top - padding.bottom;
      break;
    case "left":
      maxWidth =
        containerDimensions.totalWidth - (containerDimensions.totalWidth - targetDimensions.left - targetDimensions.width) - padding.left;
      maxHeight = commonHeight;
      break;
    case "right":
      maxWidth = containerDimensions.totalWidth - targetDimensions.left - padding.right;
      maxHeight = commonHeight;
      break;
  }
  // todo correctly adjust for alignment
  switch (alignment) {
    case "start":
      maxWidth -= targetDimensions[oppositeLength] / 2;
      maxHeight -= targetDimensions[oppositeLength] / 2;
      break;
    case "end":
      maxWidth -= targetDimensions[oppositeLength] / 2;
      maxHeight -= targetDimensions[oppositeLength] / 2;
      break;
  }

  return { maxWidth, maxHeight };
}
/**
 * Computes the transform origin for a popover based on its side, alignment and orientation.
 * @param side - The side of the popover.
 * @param alignment - The alignment of the popover.
 * @param isVertical - Whether the popover is vertically oriented.
 * @returns The computed transform origin.
 */
function computeTransformOrigin(side: Side, alignment: Alignment | undefined, isVertical: boolean) {
  const oppositeSideMap = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };

  let transformOrigin = oppositeSideMap[side];
  if (alignment === "start") transformOrigin = isVertical ? `${transformOrigin} left` : `top ${transformOrigin}`;
  else if (alignment === "end") transformOrigin = isVertical ? `${transformOrigin} right` : `bottom ${transformOrigin}`;

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
function parsePlacement(placement: Placement): [Side, Alignment | undefined] {
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
 * Returns the length of the axis of the given placement.
 *
 * @param placement - The placement of the popover.
 * @returns The length of the axis.
 *
 * @example
 * ```typescriptreact
 * const axisLength = getAxisLength("left"); // "width"
 * ```
 */
function getAxisLength(placement: Placement): Length {
  return ["top", "bottom"].includes(parsePlacement(placement)[0]) ? "height" : "width";
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

// to be removed
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
//

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
