import {
  Alignment,
  Arrow,
  Axis,
  Length,
  Offset,
  Placement,
  Prevent,
  Side,
  Flip,
  Position,
  Backdrop,
  Rect,
  Dimensions,
  Coords,
} from "./types";

const oppositeSideMap = {
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
export function getOppositeAxis(axis: Axis): Axis {
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
export function getSideAxis(placement: Placement): Axis {
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
  return getOppositeAxis(getSideAxis(placement));
}

/**
 * Returns the main and opposite alignment sides based on the target and popover rectangles and the placement.
 *
 * @param targetRect - The target rectangle.
 * @param popoverRect - The popover rectangle.
 * @param placement - The placement of the popover relative to the target.
 * @returns An array containing the main and opposite alignment sides.
 *
 * @example
 * const targetRect = {...rect, width: 100};
 * const popoverRect = {...rect, width: 200};
 * const placement = "bottom-start";
 * getAlignmentSides(targetRect, popoverRect, placement); // Returns ["right", "left"]
 */
export function getAlignmentSides(targetRect: Rect, popoverRect: Rect, placement: Placement): [Side, Side] {
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);

  let mainAlignmentSide: Side =
    alignmentAxis === "x" ? (alignment === "start" ? "right" : "left") : alignment === "start" ? "bottom" : "top";

  if (targetRect[length] > popoverRect[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide) as Side;
  }

  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide) as Side];
}

export function getFallbackPlacements(placement: Placement): Placement[] {
  const [side, alignment] = placement.split("-") as [Side, Alignment];
  const [oppositeSide, oppositeAlignment] = getOppositePlacement(placement).split("-") as [Side, Alignment];

  let list: Placement[] = [];

  if (alignment) list.push(`${side}-${alignment}`, side, `${side}-${oppositeAlignmentMap[alignment]}`);
  else list.push(side, `${side}-start`, `${side}-end`);

  if (oppositeAlignment)
    list.push(`${oppositeSide}-${oppositeAlignment}`, oppositeSide, `${oppositeSide}-${oppositeAlignmentMap[oppositeAlignment]}`);
  else list.push(oppositeSide, `${oppositeSide}-start`, `${oppositeSide}-end`);

  return list;
}

export function getExpandedPlacement(placement: Placement): [Placement, Placement, Placement] {
  const [side, alignment] = placement.split("-") as [Side, Alignment];

  const oppositeSide = oppositeSideMap[side] as Side;

  const oppositeAlignment = alignment === "start" ? "end" : "start";

  const flippedAlignment = placement.replace(alignment, oppositeAlignment) as Placement;
  const flippedSide = placement.replace(side, oppositeSide) as Placement;
  const flipped = flippedSide.replace(alignment, oppositeAlignment) as Placement;

  return [flippedAlignment, flippedSide, flipped];
}

function getSideList(side: Side, isStart: boolean): Placement[] {
  const lr: Placement[] = ["left", "right"];
  const rl: Placement[] = ["right", "left"];
  const tb: Placement[] = ["top", "bottom"];
  const bt: Placement[] = ["bottom", "top"];

  switch (side) {
    case "top":
    case "bottom":
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}

export function getOppositeAxisPlacements(placement: Placement): Placement[] {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), alignment === "start");

  if (alignment) {
    list = list.map((side) => `${side}-${alignment}` as Placement);

    list = list.concat(list.map(getOppositeAlignmentPlacement));
  }

  return list;
}

export function getOppositePlacement(placement: Placement): Placement {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side as Side]) as Placement;
}

export function getOppositeAlignmentPlacement(placement: Placement): Placement {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment as Alignment]) as Placement;
}

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
