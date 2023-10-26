import { Alignment, Arrow, Axis, Length, Offset, Placement, Prevent, Side, Flip, Position, Backdrop, Rect, Dimensions } from "./types";

const oppositeSideMap: { top: Side; bottom: Side; right: Side; left: Side } = {
  top: "bottom",
  bottom: "top",
  right: "left",
  left: "right",
};
const oppositeAlignmentMap: { start: Alignment; end: Alignment } = { start: "end", end: "start" };

/**
 * Returns the side of a popover based on its placement.
 *
 * @param placement - The placement of the popover.
 * @returns The side of the popover.
 *
 * @example
 * getSide("top-start"); // Returns "top"
 * getSide("right-end"); // Returns "right"
 */
export function getSide(placement: Placement): Side {
  return placement.split("-")[0] as Side;
}

/**
 * Returns the alignment of a given placement string.
 *
 * @param placement - The placement string to extract the alignment from.
 * @returns The alignment string or undefined if not found.
 *
 * @example
 * getAlignment("top-start") // returns "start"
 * getAlignment("bottom-end") // returns "end"
 */
export function getAlignment(placement: Placement): Alignment | undefined {
  return placement.split("-")[1] as Alignment | undefined;
}

/**
 * Returns the opposite axis of the given axis.
 *
 * @param axis The axis to get the opposite of.
 * @returns The opposite axis.
 *
 * @example
 * getOppositeAxis("x"); // Returns "y"
 * getOppositeAxis("y"); // Returns "x"
 */
function getOppositeAxis(axis: Axis): Axis {
  return axis === "x" ? "y" : "x";
}

/**
 * Returns the length property name for a given axis.
 *
 * @param axis - The axis to get the length property name for.
 * @returns The length property name for the given axis.
 *
 * @example
 * getAxisLength("y"); // Returns "height"
 * getAxisLength("x"); // Returns "width"
 */
export function getAxisLength(axis: Axis): Length {
  return axis === "y" ? "height" : "width";
}

/**
 * Returns the axis of the side of the popover based on its placement.
 *
 * @param placement - The placement of the popover.
 * @returns The axis ("x" or "y") corresponding to the side of the popover.
 *
 * @example
 * getSideAxis("top-start"); // Returns "y"
 */
export function getAxis(placement: Placement): Axis {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}

/**
 * Returns the alignment axis for a given placement.
 *
 * @param placement - The placement to get the alignment axis for.
 * @returns The alignment axis for the given placement.
 *
 * @example
 * getAlignmentAxis("top-start"); // Returns "x"
 */
export function getAlignmentAxis(placement: Placement): Axis {
  return getOppositeAxis(getAxis(placement));
}

export function getFallbackPlacements(placement: Placement): Placement[] {
  const [side, alignment] = placement.split("-") as [Side, Alignment];
  const [oppositeSide, oppositeAlignment] = getOppositePlacement(placement).split("-") as [Side, Alignment];

  let list: Placement[] = [];

  if (alignment) list.push(`${side}-${alignment}`, `${side}-${oppositeAlignmentMap[alignment]}`);
  else list.push(side, `${side}-start`, `${side}-end`);

  if (oppositeAlignment) list.push(`${oppositeSide}-${oppositeAlignment}`, `${oppositeSide}-${oppositeAlignmentMap[oppositeAlignment]}`);
  else list.push(oppositeSide, `${oppositeSide}-start`, `${oppositeSide}-end`);

  return list;
}

export type PlacementData = {
  side: Side;
  alignment: Alignment | undefined;
  oppositeSide: Side;
  oppositeAlignment: Alignment | undefined;
  axis: Axis;
  oppositeAxis: Axis;
  length: "width" | "height";
  oppositeLength: "width" | "height";
  isBasePlacement: boolean;
};
export function getPlacementData(placement: Placement) {
  const [side, alignment] = placement.split("-") as [Side, Alignment | undefined];
  const [oppositeSide, oppositeAlignment] = getOppositePlacement(placement).split("-") as [Side, Alignment | undefined];

  const axis: Axis = ["top", "bottom"].includes(side) ? "y" : "x";
  const oppositeAxis: Axis = axis === "x" ? "y" : "x";

  const length: "height" | "width" = axis === "y" ? "height" : "width";
  const oppositeLength: "height" | "width" = oppositeAxis === "y" ? "height" : "width";

  const isBasePlacement = side === placement;

  return {
    side,
    alignment,
    oppositeSide,
    oppositeAlignment,
    axis,
    oppositeAxis,
    length,
    oppositeLength,
    isBasePlacement,
  };
}

function getOppositePlacement(placement: Placement): Placement {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side as Side]) as Placement;
}

// to be removed
/**
 * Returns the dimensions of an element relative to its container.
 * @param element - The element to get the dimensions of.
 * @param containerDimensions - Optional dimensions of the container element. If not provided, the dimensions of the body element will be used.
 * @returns An object containing the dimensions of the element relative to its container.
 */
export function getDimensions(element: Element, containerDimensions?: Dimensions) {
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

/**
 * Finds the two sides that correspond to overflowing for the given placement.
 * If the placement is the base placement, the two sides will be the opposite sides of the axis.
 *
 * @param axis The placement axis ("x" or "y").
 * @param alignment The popover alignment ("start" or "end").
 * @param isBasePlacement Whether the placement is the base placement.
 * @returns An array of two sides that are corresponding to overflowing for the given placement.
 */
export function getPlacementOverflowSides(axis: Axis, alignment: Alignment | undefined, isBasePlacement: boolean): [Side, Side] {
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
export function getElementRect(element: Element, containerRect?: Rect): Rect {
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

//#region extensions
export function Offset(value: number): Offset {
  return { name: "offset", value };
}
export function Position(position: { top?: number; bottom?: number; left?: number; right?: number }, transformOrigin: string): Position {
  return { name: "position", position, transformOrigin };
}
export function Flip(): Flip {
  return { name: "flip" };
}
export function Arrow(value: number, className: { arrow: string; backdrop: string }): Arrow {
  return { name: "arrow", size: value, className };
}
export function Backdrop(type: "opaque" | "blur", className: string): Backdrop {
  return { name: "backdrop", type, className };
}
export function Prevent(scroll: boolean): Prevent {
  return { name: "prevent", scroll };
}
//#endregion
