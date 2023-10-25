import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Alignment, Container, Coords, Dimensions, MountedExtensions, Placement, PopoverData, Rect, RectPosition, Side } from "./types";
import {
  getDimensions,
  getAlignment,
  getAlignmentAxis,
  getAlignmentSides,
  getAxisLength,
  getExpandedPlacement,
  getOppositeAxisPlacements,
  getOppositePlacement,
  getSide,
  getSideAxis,
  getElementRect,
  getFallbackPlacements,
} from "./utils";

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

//#region Compute
function computePosition(
  container: Element,
  target: Element,
  popover: Element,
  initialPlacement: Placement,
  margin: RectPosition,
  padding: RectPosition,
  offset: number,
  arrowSize: number,
  flip: boolean
) {
  let placement = initialPlacement;

  const elementsRect = {
    target: getElementRect(target, getElementRect(container)),
    popover: getElementRect(popover, getElementRect(container)),
  };
  const elementsAbsoluteRect = {
    target: getElementRect(target),
    popover: getElementRect(popover),
  };

  const documentRect = document.documentElement.getBoundingClientRect();
  const boundary: RectPosition = {
    top: margin.top + padding.top,
    bottom: documentRect.height - (margin.bottom + padding.bottom),
    left: margin.left + padding.left,
    right: documentRect.width - (margin.right + padding.right),
  };
  const containerDimensions = getDimensions(container);
  const targetDimensions = getDimensions(target, containerDimensions);

  console.log("--------------------");

  const side = getSide(initialPlacement);
  const sideAxis = getSideAxis(initialPlacement);
  const alignment = getAlignment(initialPlacement);
  const isVertical = sideAxis === "y";

  const { coords: absoluteCoords } = computeCoords(elementsAbsoluteRect, initialPlacement, offset, arrowSize);
  elementsRect.popover = { ...elementsRect.popover, ...absoluteCoords };

  if (flip) placement = Flip(elementsRect, boundary, initialPlacement);

  const { coords, arrowCoords } = computeCoords(elementsRect, placement, offset, arrowSize);
  const maxLengths = computeMaxLengths(containerDimensions, targetDimensions, initialPlacement, padding);
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
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);

  const commonX = rects.target.x + rects.target.width / 2 - rects.popover.width / 2;
  const commonY = rects.target.y + rects.target.height / 2 - rects.popover.height / 2;
  const commonAlign = rects.target[alignLength] / 2 - rects.popover[alignLength] / 2;
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
      coords[alignmentAxis] -= commonAlign;
      arrowCoords[alignmentAxis] += commonAlign;
      break;
    case "end":
      coords[alignmentAxis] += commonAlign;
      arrowCoords[alignmentAxis] -= commonAlign;
      break;
  }

  if (offset !== 0) {
    offset += arrowSize / 2;
    coords = Offset(side, offset, coords);
  }

  return { coords, arrowCoords };
}
// todo finish
function computeMaxLengths(containerDimensions: Dimensions, targetDimensions: Dimensions, placement: Placement, padding: RectPosition) {
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const alignment = getAlignment(placement);

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
      maxWidth -= targetDimensions[alignLength] / 2;
      maxHeight -= targetDimensions[alignLength] / 2;
      break;
    case "end":
      maxWidth -= targetDimensions[alignLength] / 2;
      maxHeight -= targetDimensions[alignLength] / 2;
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
//#endregion

//#region Extensions
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
function Flip(rects: { target: Rect; popover: Rect }, boundary: RectPosition, initialPlacement: Placement): Placement {
  let placement = initialPlacement;
  let overflowsData: { placement: Placement; overflows: number[] }[] = [];

  const placements = getFallbackPlacements(initialPlacement);

  for (let i = 0; i < placements.length; i++) {
    // Continue if placement is the same as previous calculated placement
    if (overflowsData.length > 0 && overflowsData[overflowsData.length - 1].placement === placement) continue;

    const side = getSide(placement);

    const overflow = detectOverflow(boundary, rects.popover);

    const overflows = [overflow[side]];

    const alignmentSides = getAlignmentSides(rects.target, rects.popover, placement);
    overflows.push(overflow[alignmentSides[0]], overflow[alignmentSides[1]]);

    // console.log(placement);
    overflowsData = [...overflowsData, { placement, overflows }];

    // Checks if the popover overflows the container on any side and flips it if it does
    // If any side is <= 0, that means the popover is overflowing the container on that side
    if (!overflows.every((side) => side <= 0)) {
      if (placements[i + 1]) {
        placement = placements[i + 1];
        continue;
      }

      // let resetPlacement = overflowsData
      //   .filter((data) => data.overflows[0] <= 0)
      //   .sort((a, b) => a.overflows[1] - b.overflows[1])[0]?.placement;

      // if (!resetPlacement) resetPlacement = initialPlacement;

      // if (placement !== resetPlacement) {
      //   placement = resetPlacement;
      // }
      // continue;
    }
  }

  let bestPlacement = overflowsData.filter((data) => data.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]?.placement;
  let nonOverflownPlacements = overflowsData.filter((data) => data.overflows[0] <= 0);

  // console.log(placement);
  // console.log(bestPlacement);
  // console.log(nonOverflownPlacements);

  return placement;
}
function FlipOLD(rects: { target: Rect; popover: Rect }, boundary: RectPosition, initialPlacement: Placement): Placement {
  type extensionData = { index: number; overflows: { placement: Placement; overflows: number[] }[] };

  let placement = initialPlacement;
  let extensionData: extensionData = { index: 0, overflows: [] };
  let resetCount = 0;

  const isBasePlacement = getSide(initialPlacement) === initialPlacement;

  const fallbackPlacements = isBasePlacement ? [getOppositePlacement(initialPlacement)] : getExpandedPlacement(initialPlacement);
  fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement));

  type fnReturn = { data?: extensionData; reset?: boolean | { placement?: Placement } };
  const fn = ({
    rects,
    initialPlacement,
    placement,
    extensionData,
  }: {
    rects: { target: Rect; popover: Rect };
    initialPlacement: Placement;
    placement: Placement;
    extensionData: extensionData;
  }): fnReturn => {
    const side = getSide(placement);
    const isBasePlacement = getSide(initialPlacement) === initialPlacement;

    const fallbackPlacements = isBasePlacement ? [getOppositePlacement(initialPlacement)] : getExpandedPlacement(initialPlacement);
    fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement));
    const placements = [initialPlacement, ...fallbackPlacements];

    const overflow = detectOverflow(boundary, rects.popover);

    const overflows = [overflow[side]];
    let overflowsData = extensionData.overflows;

    const alignmentSides = getAlignmentSides(rects.target, rects.popover, placement);
    overflows.push(overflow[alignmentSides[0]], overflow[alignmentSides[1]]);

    overflowsData = [...overflowsData, { placement, overflows }];

    // Checks if the popover overflows the container on any side and flips it if it does
    // If any side is <= 0, that means the popover is overflowing the container on that side
    if (!overflows.every((side) => side <= 0)) {
      const nextIndex = extensionData.index + 1;
      const nextPlacement = placements[nextIndex];

      if (nextPlacement) return { data: { index: nextIndex, overflows: overflowsData }, reset: { placement: nextPlacement } };

      // First, find the candidates that fit on the mainAxis side of overflow,
      // then find the placement that fits the best on the main crossAxis side.
      let resetPlacement = overflowsData
        .filter((data) => data.overflows[0] <= 0)
        .sort((a, b) => a.overflows[1] - b.overflows[1])[0]?.placement;

      if (!resetPlacement) resetPlacement = initialPlacement;

      if (placement !== resetPlacement) {
        return {
          reset: {
            placement: resetPlacement,
          },
        };
      }
    }

    return {};
  };

  for (let i = 0; i < 1; i++) {
    const { data, reset } = fn({
      rects,
      initialPlacement,
      placement,
      extensionData,
    });

    extensionData = { ...extensionData, ...data };

    if (reset && resetCount <= 24) {
      resetCount++;

      if (typeof reset === "object" && reset.placement) placement = reset.placement;

      i = -1;
      continue;
    }
  }

  return placement;
}
//#endregion

/**
 * Calculates the overflow of a popover element relative to the viewport boundaries.
 * @param popoverRect - The bounding rectangle of the popover element.
 * @param margin - The margin of the popover element.
 * @param padding - The padding of the popover element.
 * @returns An object containing the overflow values for each direction (top, bottom, left, right).
 */
function detectOverflow(boundary: RectPosition, popoverRect: Rect) {
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
