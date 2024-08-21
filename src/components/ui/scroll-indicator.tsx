"use client";

import { cloneElement, Fragment, isValidElement, memo, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";

import { useOverflowObserver } from "~/hooks/use-overflow-observer";
import { EASING } from "~/lib/motion";
import { cn } from "~/lib/utils";

type Direction = "top" | "bottom" | "left" | "right";

type Offset =
  | number
  | { x?: number; y?: number; top?: number; bottom?: number; left?: number; right?: number };

type ClassName =
  | string
  | { x?: string; y?: string; top?: string; bottom?: string; left?: string; right?: string };

type Indicator = {
  offset?: Offset;
  size?: number;
  zIndex?: number;
  className?: ClassName;
};

/**
 * ScrollIndicator provides a visual indication of overflow in a scrollable container.
 * It displays a fading effect at the edges of the container to indicate that more content is available off-screen.
 *
 * @param props.renderInline - Whether to render indicators with the children inline or within container.
 * @param props.className - The class name of the container.
 */
export const ScrollIndicator = memo(function ScrollIndicator(props: {
  ref?: React.MutableRefObject<HTMLElement | null>;
  indicator?: Indicator;
  orientation?: "x" | "y";
  renderInline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const childrenRef = useRef<HTMLElement | null>(props.ref?.current ?? null);
  const overflow = useOverflowObserver(childrenRef);
  const children = useMemo(
    () =>
      isValidElement(props.children)
        ? cloneElement(
            props.children,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            Object.assign({}, props.children.props, { ref: childrenRef }),
          )
        : null,
    [props.children],
  );

  const shouldRenderIndicator = useCallback(
    (dir: Direction) => {
      return props.orientation === "x"
        ? ["left", "right"].includes(dir)
        : props.orientation === "y"
          ? ["top", "bottom"].includes(dir)
          : true;
    },
    [props.orientation],
  );

  const Container = props.renderInline ? Fragment : "div";
  const containerProps = props.renderInline ? {} : { className: cn("relative", props.className) };

  return (
    <Container {...containerProps}>
      {(["top", "bottom", "left", "right"] as Direction[]).map(
        (dir) =>
          shouldRenderIndicator(dir) && (
            <Indicator
              key={dir}
              direction={dir}
              overflow={overflow[dir]}
              style={getStyle(dir, props.indicator)}
              className={getClassName(dir, props.indicator?.className)}
            />
          ),
      )}

      {children}
    </Container>
  );
});

function Indicator(props: {
  direction: Direction;
  overflow: boolean;
  style: React.CSSProperties;
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden
      style={props.style}
      className={cn(
        "pointer-events-none absolute select-none from-white to-transparent dark:from-gray-800",
        props.direction === "top" && "bg-gradient-to-b",
        props.direction === "bottom" && "bg-gradient-to-t",
        props.direction === "left" && "bg-gradient-to-r",
        props.direction === "right" && "bg-gradient-to-l",
        props.className,
      )}
      animate={{ opacity: props.overflow ? 1 : 0 }}
      transition={{ duration: 0.15, ease: EASING.easeIn }}
    />
  );
}

function getStyle(dir: Direction, indicator?: Indicator) {
  if (typeof indicator !== "object") return {};

  const isHorizontal = dir === "left" || dir === "right";
  const commonStyles = {
    zIndex: indicator.zIndex ?? 50,
    [isHorizontal ? "width" : "height"]: indicator.size ?? 40,
  };

  const getOffset = (dir: Direction, offset?: Offset) => {
    if (typeof offset === "undefined") return 0;
    if (typeof offset === "number") return offset;
    return offset[dir] ?? (dir === "top" || dir === "bottom" ? (offset.y ?? 0) : (offset.x ?? 0));
  };

  return {
    ...commonStyles,
    top: ["top", "left", "right"].includes(dir) ? getOffset("top", indicator?.offset) : undefined,
    bottom: ["bottom", "left", "right"].includes(dir)
      ? getOffset("bottom", indicator?.offset)
      : undefined,
    left: ["left", "top", "bottom"].includes(dir)
      ? getOffset("left", indicator?.offset)
      : undefined,
    right: ["right", "top", "bottom"].includes(dir)
      ? getOffset("right", indicator?.offset)
      : undefined,
  };
}

function getClassName(dir: Direction, className?: ClassName) {
  return typeof className === "object"
    ? cn(dir === "top" || dir === "bottom" ? className.y : className.x, className[dir])
    : className;
}
