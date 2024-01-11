"use client";

import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { z } from "zod";

const TextAreaVariants = cva(
  "block w-full resize-none appearance-none text-gray-900 outline-none outline-0 placeholder:text-gray-400 focus:outline-none disabled:pointer-events-none dark:text-white dark:placeholder:text-gray-600",
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
  const previousValue = useRef(String(value || defaultValue));

  const [height, setHeight] = useState(0);

  const handleChange = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (
      !z.string().safeParse(e.target.value).success ||
      e.target.value === previousValue.current ||
      (preventEmpty && e.target.value.length < 1)
    )
      return;
    if (onChange) onChange(e);
    previousValue.current = e.target.value;
  };

  const resize = () => {
    let node: HTMLTextAreaElement | null = null;

    if (typeof userRef === "function") userRef(node);
    else if (userRef) node = userRef.current;
    else if (libRef) node = libRef.current;

    if (!node) return;

    const styles = window.getComputedStyle(node);
    const paddingBlock = parseFloat(styles.paddingBottom) + parseFloat(styles.paddingTop);
    const borderBlock = parseFloat(styles.borderBottomWidth) + parseFloat(styles.borderTopWidth);
    const rowHeight = parseFloat(styles.lineHeight);

    // Clone styles from textarea to hidden textarea so we can measure the height
    const hiddenTextarea = document.createElement("textarea");
    hiddenTextarea.value = node.value || node.placeholder;
    Object.assign(hiddenTextarea.style, {
      top: "0",
      left: "0",
      width: styles.width,
      height: "0",
      minHeight: "0",
      maxHeight: "none",
      padding: styles.padding,
      border: styles.border,
      visibility: "hidden",
      overflow: "hidden",
      zIndex: "-1000",

      // Typography
      font: styles.font,
      fontStyle: styles.fontStyle,
      fontWeight: styles.fontWeight,
      letterSpacing: styles.letterSpacing,
      tabSize: styles.tabSize,
      textIndent: styles.textIndent,
      textRendering: styles.textRendering,
      textTransform: styles.textTransform,
      wordBreak: styles.wordBreak,
    });

    document.body.appendChild(hiddenTextarea);

    const fullHeight = hiddenTextarea.scrollHeight + borderBlock;

    document.body.removeChild(hiddenTextarea);

    const minHeight = rowHeight * minRows + paddingBlock + borderBlock;
    const maxHeight = rowHeight * maxRows + paddingBlock + borderBlock;

    const computedHeight = Math.min(Math.max(fullHeight, minHeight), maxHeight);

    if (computedHeight !== height) setHeight(computedHeight);
  };

  useLayoutEffect(resize, [userRef, libRef, value, minRows, maxRows]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <textarea
      ref={userRef ? userRef : libRef}
      id={id}
      value={value}
      defaultValue={defaultValue}
      autoComplete={autoComplete}
      onChange={() => !value && resize()}
      onBlur={handleChange}
      style={{ ...style, height }}
      className={cn(TextAreaVariants({ variant, size, className }))}
      {...props}
    />
  );
});
TextArea.displayName = "TextArea";
