"use client";

import { forwardRef, useMemo, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { z } from "zod";
import { cn } from "~/lib/utils";
import { KEYS } from "~/types";
import { type HTMLMotionProps, motion } from "framer-motion";

const InputVariants = cva(
  "peer w-full appearance-none text-gray-800 outline-none outline-0 placeholder:text-gray-400 focus:outline-none disabled:pointer-events-none dark:text-white dark:placeholder:text-gray-600",
  {
    variants: {
      variant: {
        default: "shadow-border focus:shadow-focus",
        insetLabelSm: "pb-1 pt-5 shadow-border focus:shadow-focus",
        insetLabel: "pb-1.5 pt-6 shadow-border focus:shadow-focus",
        unset: null,
      },
      size: {
        default: "rounded-lg px-4 text-base",
        sm: "rounded-md px-3 text-sm",
        unset: null,
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type InputProps = Omit<HTMLMotionProps<"input">, "size"> &
  VariantProps<typeof InputVariants> & {
    label?: string;
    onChange?: (e: React.FocusEvent<HTMLInputElement>) => void;
    fullWidth?: boolean;
    fullHeight?: boolean;
    dynamicWidth?: boolean;
    preventEmpty?: boolean;
    labelClassName?: string;
  };
export const Input = forwardRef<HTMLInputElement, InputProps>((inputProps, ref) => {
  const {
    id,
    label,
    value,
    defaultValue,
    autoComplete,
    onChange,
    onKeyDown,
    fullWidth = false,
    fullHeight = false,
    dynamicWidth = false,
    preventEmpty = false,
    variant,
    size,
    className,
    labelClassName,
    ...props
  } = inputProps;
  const isDynamicWidth = useMemo(() => dynamicWidth && !defaultValue, [dynamicWidth, defaultValue]);
  const previousValue = useRef(value ?? defaultValue);

  const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      !z.string().safeParse(e.target.value).success ||
      e.target.value === previousValue.current ||
      (preventEmpty && e.target.value.length < 1)
    )
      return;
    if (onChange) onChange(e);
    previousValue.current = e.target.value;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) onKeyDown(e);
    else if (e.key === (KEYS.Enter as string)) e.currentTarget.blur();
  };

  const getLabelStyle = () => {
    const baseStyle =
      "pointer-events-none select-none absolute inset-0 flex origin-top-left items-center overflow-hidden text-sm text-gray-600 duration-100 ease-in";

    const variantStyles: Record<string, string> = {
      insetLabel: `mx-4 peer-focus:-translate-y-2.5 peer-focus:scale-90 ${
        value !== undefined && value.toString().length > 0 && "-translate-y-2.5 scale-90"
      }`,
      insetLabelSm: `mx-3 peer-focus:-translate-y-1.5 peer-focus:scale-[0.84] ${
        value !== undefined && value.toString().length > 0 && "-translate-y-1.5 scale-[0.84]"
      }`,
    };

    return cn(baseStyle, variant && variantStyles[variant]);
  };

  return (
    <div
      style={{ ...(fullWidth && { width: "100%" }), ...(fullHeight && { height: "100%" }) }}
      className={cn(
        "focus-within:z-30",
        (isDynamicWidth || !!label || !!autoComplete) && "relative",
      )}
    >
      {/* Dynamic width of input */}
      {isDynamicWidth && (
        <div
          role="presentation"
          className={cn(
            InputVariants({ variant, size, className }),
            "invisible w-fit whitespace-pre border-r",
          )}
        >
          {value}
        </div>
      )}

      {/* Label for autocomplete identification */}
      {!label && autoComplete && (
        <label htmlFor={id} className="absolute -z-10 select-none text-transparent opacity-0">
          {autoComplete}
        </label>
      )}

      <motion.input
        ref={ref}
        id={id}
        value={value}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        onChange={() => {
          return;
        }}
        onBlur={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          InputVariants({ variant, size, className }),
          isDynamicWidth && "absolute inset-0 h-full text-center",
        )}
        {...props}
      />

      {/* Inset label */}
      {label && (
        <label htmlFor={id} className={cn(getLabelStyle(), labelClassName)}>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
        </label>
      )}
    </div>
  );
});
Input.displayName = "Input";
