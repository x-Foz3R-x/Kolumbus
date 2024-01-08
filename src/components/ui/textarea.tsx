"use client";

import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const TextAreaVariants = cva(
  "w-full resize-none appearance-none text-gray-900 outline-none outline-0 placeholder:text-gray-400 focus:outline-none disabled:pointer-events-none dark:text-white dark:placeholder:text-gray-600",
  {
    variants: {
      variant: {
        default: "shadow-border focus:shadow-focus",
        unstyled: "",
      },
      size: {
        default: "rounded-lg px-4 py-2 text-base",
        sm: "rounded-md px-3 py-1.5 text-sm",
        unstyled: "",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type TextAreaProps = Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, "size"> &
  VariantProps<typeof TextAreaVariants> & {
    onChange?: (e: React.FocusEvent<HTMLInputElement>) => void;
    minRows?: number;
    maxRows?: number;
    fullWidth?: boolean;
    fullHeight?: boolean;
    preventEmpty?: boolean;
  };
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((inputProps, userRef) => {
  const {
    id,
    value,
    defaultValue,
    autoComplete,
    onChange,
    minRows = 2,
    maxRows = Infinity,
    fullWidth,
    fullHeight,
    preventEmpty,
    variant,
    size,
    style,
    className,
    ...props
  } = inputProps;
  const libRef = useRef<HTMLTextAreaElement | null>(null);
  const previousValue = useRef(value || defaultValue);

  const [height, setHeight] = useState(0);

  const handleChange = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (e.target.value === previousValue.current || (preventEmpty && e.target.value.length < 1)) return;
    if (onChange) onChange(e);
    previousValue.current = e.target.value;
  };

  const resizeTextArea = () => {
    let node: HTMLTextAreaElement | null = null;

    if (typeof userRef === "function") userRef(node);
    else if (userRef) node = userRef.current;

    if (!node) node = libRef.current;
    if (!node) return;

    const nodeSizingData = getSizingData(node);

    if (!nodeSizingData) return;

    const computedHeight = computeHeight(nodeSizingData, node.value || node.placeholder || "x", minRows, maxRows);
    if (computedHeight !== height) setHeight(computedHeight);
  };

  useLayoutEffect(resizeTextArea, [userRef, libRef, value, minRows, maxRows]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <textarea
      ref={userRef ? userRef : libRef}
      id={id}
      value={value}
      defaultValue={defaultValue}
      autoComplete={autoComplete}
      onChange={() => {
        !value && resizeTextArea();
      }}
      onBlur={handleChange}
      style={{ ...style, height }}
      className={cn(TextAreaVariants({ variant, size, className }))}
      {...props}
    />
  );
});
TextArea.displayName = "TextArea";

function computeHeight(
  sizing: NonNullable<ReturnType<typeof getSizingData>>,
  value: string,
  minRows: number = 1,
  maxRows: number = Infinity,
) {
  const { sizingStyles, paddingBlock, borderBlock } = sizing;

  const hiddenTextarea = document.createElement("textarea");
  Object.assign(hiddenTextarea.style, {
    ...sizingStyles,
    minHeight: "0",
    maxHeight: "none",
    height: "0",
    visibility: "hidden",
    overflow: "hidden",
    zIndex: "-1000",
    top: "0",
    left: "0",
  });

  hiddenTextarea.setAttribute("tabindex", "-1");
  hiddenTextarea.setAttribute("aria-hidden", "true");

  document.body.appendChild(hiddenTextarea);

  hiddenTextarea.value = "x";
  const rowHeight = hiddenTextarea.scrollHeight - paddingBlock;

  hiddenTextarea.value = value;
  const height = hiddenTextarea.scrollHeight + borderBlock;

  const minHeight = rowHeight * minRows + paddingBlock + borderBlock;
  const maxHeight = rowHeight * maxRows + paddingBlock + borderBlock;

  document.body.removeChild(hiddenTextarea);

  return Math.min(Math.max(height, minHeight), maxHeight);
}

function getSizingData(node: HTMLTextAreaElement) {
  const SIZING_STYLE = [
    //Padding
    "paddingBottom",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    // Border
    "borderBottomWidth",
    "borderLeftWidth",
    "borderRightWidth",
    "borderTopWidth",
    // Typography
    "fontFamily",
    "fontSize",
    "fontStyle",
    "fontWeight",
    "letterSpacing",
    "lineHeight",
    "tabSize",
    "textIndent",
    "textRendering",
    "textTransform",
    "wordBreak",

    "width",
  ] as const;

  const computedStyles = window.getComputedStyle(node);

  type SizingStyles = Record<(typeof SIZING_STYLE)[number], string>;
  const sizingStyles: SizingStyles = SIZING_STYLE.reduce((styles, style) => {
    styles[style] = computedStyles[style];
    return styles;
  }, {} as SizingStyles);

  const paddingBlock = parseFloat(sizingStyles.paddingBottom) + parseFloat(sizingStyles.paddingTop);
  const borderBlock = parseFloat(sizingStyles.borderBottomWidth) + parseFloat(sizingStyles.borderTopWidth);

  return {
    sizingStyles,
    paddingBlock,
    borderBlock,
  };
}
