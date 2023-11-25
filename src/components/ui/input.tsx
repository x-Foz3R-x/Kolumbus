"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Key } from "@/types";

const InputVariants = cva(
  "peer w-full appearance-none text-gray-900 outline-none outline-0 placeholder:text-gray-400 focus:z-10 focus:outline-none disabled:pointer-events-none dark:text-gray-100 dark:placeholder:text-gray-600",
  {
    variants: {
      variant: {
        default: "shadow-border focus:shadow-focus",
        insetLabelSm: "pb-1 pt-5 shadow-border focus:shadow-focus",
        insetLabel: "pb-1.5 pt-6 shadow-border focus:shadow-focus",
        unstyled: "",
      },
      size: {
        default: "rounded-lg px-4 text-base",
        sm: "rounded-md px-3 text-sm",
        unstyled: "",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type InputProps = Omit<HTMLMotionProps<"input">, "size"> &
  VariantProps<typeof InputVariants> & {
    label?: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    onChange?: (e: React.FocusEvent<HTMLInputElement>) => void;
    fullWidth?: boolean;
    fullHeight?: boolean;
    dynamicWidth?: boolean;
    preventEmpty?: boolean;
  };
/**
 * A customizable input component.
 *
 * @example
 * ```tsx
 * import Input from "./components/ui/input";
 *
 * function App() {
 *   const [value, setValue] = useState("");
 *   const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
 *     // handle input change
 *   };
 *
 *   return (
 *     <div>
 *       <Input
 *         ref={ref}
 *         label=""
 *         value=={value}
 *         setValue={setValue}
 *         onChange={handleChange}
 *         variant="default"
 *         fullWidth
 *         fullHeight
 *         dynamicWidth
 *         preventEmpty
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, value, setValue, onChange, variant, size, className, fullWidth, fullHeight, dynamicWidth, preventEmpty, ...props }, ref) => {
    const previousInputValue = useRef(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
    const handleUpdate = async (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value === previousInputValue.current) return;
      if (preventEmpty && e.target.value.length < 1) {
        setValue(previousInputValue.current);
        return;
      }

      previousInputValue.current = e.target.value;
      if (onChange) onChange(e);
    };

    const getLabelStyle = () => {
      const baseStyle =
        "pointer-events-none select-none absolute inset-0 flex origin-top-left items-center overflow-hidden text-sm text-gray-700 duration-100 ease-in ";

      const variantStyles: { [key: string]: string } = {
        insetLabel: `ml-4 peer-focus:-translate-y-2.5 peer-focus:scale-90 ${value.toString().length > 0 && "-translate-y-2.5 scale-90"}`,
        insetLabelSm: `ml-3 peer-focus:-translate-y-1.5 peer-focus:scale-[0.84] ${
          value.toString().length > 0 && "-translate-y-1.5 scale-[0.84]"
        }`,
      };

      return label ? baseStyle + (variant && variantStyles[variant]) : "";
    };

    return (
      <div style={{ ...(fullWidth && { width: "100%" }), ...(fullHeight && { height: "100%" }) }} className="relative focus-within:z-30">
        {/* dynamic width of input */}
        {dynamicWidth && (
          <p className={cn(InputVariants({ variant, size, className }), "invisible w-fit whitespace-pre border-r")}>{value}</p>
        )}

        <motion.input
          ref={ref}
          value={value}
          onChange={handleChange}
          onBlur={handleUpdate}
          onKeyDown={(e) => (e.key === Key.Escape || e.key === Key.Enter) && e.currentTarget.blur()}
          className={cn(InputVariants({ variant, size, className }), dynamicWidth && "absolute inset-0 h-full text-center")}
          {...props}
        />

        {/* inset label */}
        {label && <label className={getLabelStyle()}>{label}</label>}
      </div>
    );
  },
);
Input.displayName = "Input";
export default Input;

type StatelessInputProps = Omit<HTMLMotionProps<"input">, "size"> &
  VariantProps<typeof InputVariants> & {
    ref?: React.Ref<HTMLInputElement> | React.MutableRefObject<HTMLInputElement | null>;
    label?: string;
    value?: string | number | readonly string[];
    onChange: (e: React.FocusEvent<HTMLInputElement>) => void;
    fullWidth?: boolean;
    fullHeight?: boolean;
    dynamicWidth?: boolean;
    preventEmpty?: boolean;
  };
/**
 * A customizable stateless input component.
 *
 * @example
 * ```tsx
 * import { StatelessInput } from "./components/ui/input";
 *
 * function App() {
 *   const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
 *     // handle input change
 *   };
 *
 *   return (
 *     <div>
 *       <Input
 *         label=""
 *         value=""
 *         onChange={handleChange}
 *         variant="default"
 *         fullWidth
 *         fullHeight
 *         dynamicWidth
 *         preventEmpty
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function StatelessInput({
  ref,
  label,
  value = "",
  onChange,
  variant,
  size,
  className,
  fullWidth,
  fullHeight,
  dynamicWidth,
  preventEmpty,
  ...props
}: StatelessInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const previousInputValue = useRef(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  const handleUpdate = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === previousInputValue.current) return;
    if (preventEmpty && e.target.value.length < 1) {
      setInputValue(previousInputValue.current);
      return;
    }

    previousInputValue.current = e.target.value;
    onChange(e);
  };

  const getLabelStyle = () => {
    const baseStyle =
      "pointer-events-none select-none absolute inset-0 flex origin-top-left items-center overflow-hidden text-sm text-gray-700 duration-100 ease-in ";

    const variantStyles: { [key: string]: string } = {
      insetLabel: `ml-4 peer-focus:-translate-y-2.5 peer-focus:scale-90 ${inputValue.toString().length > 0 && "-translate-y-2.5 scale-90"}`,
      insetLabelSm: `ml-3 peer-focus:-translate-y-1.5 peer-focus:scale-[0.84] ${
        inputValue.toString().length > 0 && "-translate-y-1.5 scale-[0.84]"
      }`,
    };

    return label ? baseStyle + (variant && variantStyles[variant]) : "";
  };

  useEffect(() => {
    setInputValue(value);
    previousInputValue.current = value;
  }, [value]);

  return (
    <div style={{ ...(fullWidth && { width: "100%" }), ...(fullHeight && { height: "100%" }) }} className="relative focus-within:z-30">
      {/* dynamic width of input */}
      {dynamicWidth && (
        <p className={cn(InputVariants({ variant, size, className }), "invisible w-fit whitespace-pre border-r")}>{inputValue}</p>
      )}

      <motion.input
        ref={ref}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleUpdate}
        onKeyDown={(e) => (e.key === Key.Escape || e.key === Key.Enter) && e.currentTarget.blur()}
        className={cn(InputVariants({ variant, size, className }), dynamicWidth && "absolute inset-0 h-full text-center")}
        {...props}
      />

      {/* inset label */}
      {label && <label className={getLabelStyle()}>{label}</label>}
    </div>
  );
}

type InputBasicProps = React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof InputVariants> & { className?: string };
export const BasicInput = forwardRef<HTMLInputElement, InputBasicProps>(({ variant, className, ...props }, ref) => (
  <input ref={ref} className={cn(InputVariants({ variant, className }))} {...props} />
));
BasicInput.displayName = "Input Basic";
