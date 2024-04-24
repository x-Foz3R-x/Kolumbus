"use client";

import { forwardRef, memo, useId, useRef } from "react";
import { type HTMLMotionProps, motion } from "framer-motion";
import { OTPInput } from "input-otp";
import { cva, type VariantProps } from "class-variance-authority";
import { z } from "zod";
import { cn } from "~/lib/utils";
import { KEYS } from "~/types";

const InputVariants = cva(
  "peer w-full appearance-none text-gray-800 outline-none outline-0 placeholder:text-gray-400 focus:outline-none disabled:pointer-events-none dark:text-white dark:placeholder:text-gray-600",
  {
    variants: {
      variant: {
        default: "shadow-border focus:shadow-focus",
        insetLabel: "pb-1 pt-5 shadow-border focus:shadow-focus",
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

type TypeAttribute =
  | "checkbox"
  | "color"
  | "email"
  | "file"
  | "hidden"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "tel"
  | "text"
  | "url";

type HTMLInputProps = Omit<HTMLMotionProps<"input">, "size" | "className" | "onUpdate">;

type InputDefaultProps = HTMLInputProps &
  VariantProps<typeof InputVariants> & {
    type?: TypeAttribute;
    insetLabel?: string;
    onUpdate?: (e: React.FocusEvent<HTMLInputElement>) => void;
    preventEmpty?: boolean;
    dynamicWidth?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    className?: { container?: string; input?: string; label?: string };
    inputRef?: React.ForwardedRef<HTMLInputElement>;
  };
type InputOTPProps = {
  id?: string;
  type: "otp";
  length: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  pattern?: "DigitsOnly" | "CharsOnly" | "DigitsAndChars";
  className?: { container?: string; input?: string };
  inputRef?: React.ForwardedRef<HTMLInputElement>;
};

export type InputProps = InputDefaultProps | InputOTPProps;
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(inputProps, ref) {
  const uniqueId = useId();
  const inputId = inputProps.id ?? uniqueId;
  // Changes when value is updated in handleUpdate
  const previousValue = useRef(inputProps.value ?? inputProps?.defaultValue);

  if (inputProps.type === "otp") return <InputOTP {...inputProps} id={inputId} inputRef={ref} />;

  const {
    insetLabel,
    value,
    defaultValue,
    autoComplete,
    onUpdate,
    onKeyDown,
    fullWidth = false,
    fullHeight = false,
    dynamicWidth = false,
    preventEmpty = false,
    variant = !!inputProps.insetLabel ? "insetLabel" : inputProps.variant,
    size,
    className,
    inputRef,
    ...props
  } = inputProps;

  const handleUpdate = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      !z.string().safeParse(e.target.value).success ||
      e.target.value === previousValue.current ||
      (preventEmpty && e.target.value.length < 1)
    ) {
      return;
    }
    if (onUpdate) onUpdate(e);
    previousValue.current = e.target.value;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) onKeyDown(e);
    else if (e.key === (KEYS.Enter as string)) e.currentTarget.blur();
  };

  return (
    <div
      style={{ ...(fullWidth && { width: "100%" }), ...(fullHeight && { height: "100%" }) }}
      className={cn(
        "focus-within:z-30",
        (dynamicWidth || !!insetLabel || !!autoComplete) && "relative",
        dynamicWidth && "w-fit",
        className?.container,
      )}
    >
      {/* Dynamic width of input */}
      {dynamicWidth && (
        <div
          role="presentation"
          className={cn(
            InputVariants({ variant, size, className }),
            "invisible w-fit whitespace-pre border-r border-transparent bg-transparent text-transparent",
          )}
        >
          {value}
        </div>
      )}

      {/* Label for autocomplete identification */}
      {!!autoComplete && (
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute -z-50 select-none opacity-0"
        >
          {autoComplete}
        </label>
      )}

      <motion.input
        ref={inputRef}
        id={inputId}
        value={value}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        onBlur={handleUpdate}
        onKeyDown={handleKeyDown}
        className={cn(
          InputVariants({ variant, size, className: className?.input }),
          dynamicWidth && "absolute inset-0 h-full text-center",
        )}
        {...props}
      />

      {!!insetLabel && (
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute inset-0 flex origin-top-left select-none items-center overflow-hidden px-4 text-base text-gray-500 duration-100 ease-in peer-focus:-translate-y-1.5 peer-focus:translate-x-[3px] peer-focus:scale-[.8]",
            value !== undefined &&
              value.toString().length > 0 &&
              "-translate-y-1.5 translate-x-[3px] scale-[.8]",
            className?.label,
          )}
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{insetLabel}</span>
        </label>
      )}
    </div>
  );
});

const InputOTP = memo(function InputOTP({
  id,
  value,
  length,
  onChange,
  onComplete,
  pattern = "DigitsOnly",
  className,
  inputRef,
}: InputOTPProps) {
  const REGEXP_ONLY_DIGITS = "^\\d+$";
  const REGEXP_ONLY_CHARS = "^[a-zA-Z]+$";
  const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$";

  const patterns = {
    DigitsOnly: REGEXP_ONLY_DIGITS,
    CharsOnly: REGEXP_ONLY_CHARS,
    DigitsAndChars: REGEXP_ONLY_DIGITS_AND_CHARS,
  };

  return (
    <OTPInput
      id={id}
      ref={inputRef}
      maxLength={length}
      value={value}
      onChange={onChange}
      pattern={pattern && patterns[pattern]}
      onComplete={onComplete}
      inputMode={pattern === "DigitsOnly" ? "numeric" : "text"}
      noScriptCSSFallback={null}
      containerClassName={cn(
        "flex items-center gap-2.5 has-[:disabled]:opacity-50 h-fit w-fit select-none",
        className?.container,
      )}
      className={cn("disabled:cursor-not-allowed", className?.input)}
      render={(inputProps) =>
        inputProps.slots.map((slot, index) => (
          <div
            key={index}
            className={cn(
              "relative flex h-11 w-10 items-center justify-center rounded-lg bg-white text-lg font-medium",
              slot.char ? "bg-gray-100" : "text-gray-300",
              slot.isActive ? "bg-white shadow-focus" : "border shadow-softSm",
            )}
          >
            {slot.char}
            {slot.hasFakeCaret ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[18px] w-[1.5px] animate-caret-blink bg-gray-800" />
              </div>
            ) : (
              !slot.char && "•"
            )}
          </div>
        ))
      }
    />
  );
});
