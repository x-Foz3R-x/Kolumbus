import { useEffect, useRef, useState } from "react";
import { DropdownSelect } from "./dropdown";
import useKeyPress from "@/hooks/use-key-press";
import { Key } from "@/types";

import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full appearance-none outline-0 disabled:pointer-events-none placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:z-10 focus:outline-none",
  {
    variants: {
      variant: {
        default: "shadow-border focus:shadow-focus peer",
        unstyled: "",
      },
      Size: {
        default: "px-3 py-2 text-sm rounded-md",
        lg: "px-4 py-3 text-base rounded-lg",
        insetLabel: "rounded-md text-sm px-3 pb-1 pt-5",
        insetLabelLg: "rounded-lg text-base px-4 pb-1.5 pt-6",
      },
    },
    defaultVariants: { variant: "default", Size: "default" },
  }
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    value?: string | number;
    label?: string;
    width?: number;
    onChange: (e: React.FocusEvent<HTMLInputElement>) => void;
  };

export default function Input({
  type = "text",
  value = "",
  label,
  width,
  onChange,
  variant,
  Size,
  className,
  ...props
}: InputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [prevInputValue, setPrevInputValue] = useState(inputValue);

  useEffect(() => setInputValue(value), [value]);

  const ref = useRef<HTMLInputElement | null>(null);
  const enterPressed = useKeyPress(Key.Enter);
  useEffect(() => {
    if (enterPressed && ref.current && document.activeElement === ref.current) ref.current.blur();
  }, [enterPressed]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  const handleUpdate = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === prevInputValue) return;
    setPrevInputValue(e.target.value);
    onChange(e);
  };

  let labelStyle =
    "pointer-events-none select-none absolute inset-0 flex origin-top-left items-center overflow-hidden text-sm text-gray-700 duration-[125ms] ease-in ";
  switch (Size) {
    case "insetLabel":
      labelStyle += `ml-3 peer-focus:-translate-y-1.5 peer-focus:scale-[0.84] ${
        inputValue.toString().length > 0 && "-translate-y-1.5 scale-[0.84]"
      }`;
      break;
    case "insetLabelLg":
      labelStyle += `ml-4 peer-focus:-translate-y-2.5 peer-focus:scale-90 ${
        inputValue.toString().length > 0 && "-translate-y-2.5 scale-90"
      }`;
      break;
    default:
      labelStyle = "";
      break;
  }

  return (
    <div style={{ width: width ? `${width}px` : "100%" }} className="relative focus-within:z-30">
      <input
        ref={ref}
        type={type}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleUpdate}
        className={cn(inputVariants({ variant, Size, className }))}
        {...props}
      />
      {label && <label className={labelStyle}>{label}</label>}
    </div>
  );
}

//
//  OLD
//

interface InputDefaultProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange: Function;
  width?: number;
}
interface WithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "number" | "email" | "password";
  value: string;
  label: string;
  width?: number;
}
interface WithInsetLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "number" | "email" | "password";
  value: string;
  label: string;
  width?: number;
}
interface withInsetLabelAndDropdownProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "number" | "email" | "password";
  value: string | number;
  label: string;
  width?: number;
  selectList: { icon?: React.ReactNode; text: string; optionText: string }[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<number>;
}

export const Input2 = {
  Unstyled: ({ onValueChange, width, value, className, ...props }: InputDefaultProps) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => setInputValue(value), [value]);

    const ref = useRef<HTMLInputElement | null>(null);
    const enterPressed = useKeyPress(Key.Enter);
    useEffect(() => {
      if (enterPressed && document.activeElement === ref.current) ref.current!.blur();
    }, [enterPressed]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
    const handleInputUpdate = async (e: React.FocusEvent<HTMLInputElement>) => onValueChange(e);

    return (
      <div style={{ width: `${width}px` }}>
        <input
          ref={ref}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleInputUpdate}
          className={`w-full appearance-none bg-transparent outline-0 placeholder:text-gray-400 focus:z-10 focus:outline-0 ${className}`}
          {...props}
        />
      </div>
    );
  },
  WithLabel: ({ type, label, placeholder, ...props }: WithLabelProps) => (
    <div>
      <label htmlFor="input" className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="w-full overflow-hidden rounded-md border border-kolumbrown-200 focus-within:z-10 focus-within:border-kolumblue-500 focus-within:shadow-focus">
        <input
          type={type}
          name="input"
          id="input"
          className="w-full appearance-none border-0 bg-transparent px-5 py-1.5 outline-0 placeholder:text-gray-400 focus:outline-0"
          placeholder={placeholder}
          {...props}
        />
      </div>
    </div>
  ),
  WithInsetLabel: ({ type, value, label, width, onChange, className, ...props }: WithInsetLabelProps) => (
    <div style={{ width: `${width}px` }} className="relative flex flex-col">
      <input
        type={type}
        value={value}
        className={`peer w-full appearance-none border-kolumbrown-200 bg-transparent px-3 pb-1.5 pt-5 text-sm shadow-border outline-0 placeholder:text-gray-400 focus:z-10 focus:border-kolumblue-500 focus:shadow-focus focus:outline-0 ${className}`}
        onChange={onChange}
        {...props}
      />
      <label
        className={`pointer-events-none absolute inset-0 left-3 flex origin-top-left items-center overflow-hidden text-sm text-gray-700 duration-150 ease-in peer-focus:-translate-y-1.5 peer-focus:scale-[0.84] peer-focus:font-medium ${
          value?.length > 0 && "-translate-y-1.5 scale-[0.84] font-medium"
        }`}
      >
        {label}
      </label>
    </div>
  ),
  WithInsetLabelAndDropdown: ({
    type,
    value,
    label,
    width,
    selectList,
    selectedIndex,
    setSelectedIndex,
    onChange,
    className,
    ...props
  }: withInsetLabelAndDropdownProps) => (
    <div style={{ width: `${width}px` }} className="relative flex flex-col">
      <input
        type={type}
        value={value}
        className={`peer w-full appearance-none bg-transparent px-3 pb-1.5 pt-5 text-sm shadow-border outline-0 placeholder:text-gray-400 focus:z-10 focus:shadow-focus focus:outline-0 ${className}`}
        onChange={onChange}
        {...props}
      />

      <label
        className={`pointer-events-none absolute inset-0 left-3 flex origin-top-left items-center overflow-hidden text-sm text-gray-700 duration-150 ease-in peer-focus:-translate-y-1.5 peer-focus:scale-[0.84] peer-focus:font-medium ${
          typeof value !== "undefined" &&
          value?.toString().length > 0 &&
          "-translate-y-1.5 scale-[0.84] font-medium"
        }`}
      >
        {label}
      </label>

      <DropdownSelect
        optionHeight={28}
        maxVisibleOptionsLength={10}
        selectList={selectList}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        className="inset-y-0 right-0 w-16 rounded peer-focus:z-10"
      />
    </div>
  ),
};
