import { forwardRef, useEffect, useRef, useState } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import useKeyPress from "@/hooks/use-key-press";
import { Key } from "@/types";

const InputVariants = cva(
  "w-full appearance-none outline-0 text-gray-900 disabled:pointer-events-none placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:z-10 focus:outline-none",
  {
    variants: {
      variant: {
        default: "shadow-border focus:shadow-focus peer",
        insetLabelSm: "shadow-border focus:shadow-focus peer rounded-md text-sm px-3 pb-1 pt-5",
        insetLabel: "shadow-border focus:shadow-focus peer rounded-lg text-base px-4 pb-1.5 pt-6",
        unstyled: "",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof InputVariants> & {
    label?: string;
    value?: string | number | readonly string[];
    onChange: (e: React.FocusEvent<HTMLInputElement>) => void;
    fullWidth?: boolean;
    fullHeight?: boolean;
    dynamicWidth?: boolean;
    preventEmpty?: boolean;
  };
export default function Input({
  label,
  value = "",
  onChange,
  variant,
  fullWidth,
  fullHeight,
  dynamicWidth,
  preventEmpty,
  style,
  className,
  ...props
}: InputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [prevInputValue, setPrevInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
    setPrevInputValue(value);
  }, [value]);

  const ref = useRef<HTMLInputElement | null>(null);
  const [enterPressed] = useKeyPress(Key.Enter);
  useEffect(() => {
    if (enterPressed && ref.current && document.activeElement === ref.current) ref.current.blur();
  }, [enterPressed]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  const handleUpdate = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === prevInputValue) return;
    if (preventEmpty && e.target.value.length < 1) {
      setInputValue(prevInputValue);
      return;
    }

    setPrevInputValue(e.target.value);
    onChange(e);
  };

  let labelStyle =
    "pointer-events-none select-none absolute inset-0 flex origin-top-left items-center overflow-hidden text-sm text-gray-700 duration-[125ms] ease-in ";
  if (label) {
    switch (variant) {
      case "insetLabel":
        labelStyle += `ml-4 peer-focus:-translate-y-2.5 peer-focus:scale-90 ${
          inputValue.toString().length > 0 && "-translate-y-2.5 scale-90"
        }`;
        break;
      case "insetLabelSm":
        labelStyle += `ml-3 peer-focus:-translate-y-1.5 peer-focus:scale-[0.84] ${
          inputValue.toString().length > 0 && "-translate-y-1.5 scale-[0.84]"
        }`;
        break;
      default:
        labelStyle = "";
        break;
    }
  }

  const divStyle = {
    ...(fullWidth ? { width: "100%" } : {}),
    ...(fullHeight ? { height: "100%" } : {}),
  };

  return (
    <div style={divStyle} className="relative focus-within:z-30">
      {dynamicWidth && <p className={cn(InputVariants({ variant, className }), "invisible w-fit whitespace-pre border-r")}>{inputValue}</p>}

      <input
        ref={ref}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleUpdate}
        style={!dynamicWidth ? style : { position: "absolute", inset: 0, textAlign: "center", ...style }}
        className={cn(InputVariants({ variant, className }))}
        {...props}
      />
      {label && <label className={labelStyle}>{label}</label>}
    </div>
  );
}

type InputBasicProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof InputVariants> & {
    className?: string;
  };

export const BasicInput = forwardRef<HTMLInputElement, InputBasicProps>(({ variant, className, ...props }, ref) => (
  <input ref={ref} className={cn(InputVariants({ variant, className }))} {...props} />
));
BasicInput.displayName = "Input Basic";

//  OLD
// interface withInsetLabelAndDropdownProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   type: "text" | "number" | "email" | "password";
//   value: string | number;
//   label: string;
//   width?: number;
//   selectList: { icon?: React.ReactNode; text: string; optionText: string }[];
//   selectedIndex: number;
//   setSelectedIndex: React.Dispatch<number>;
// }

// WithInsetLabelAndDropdown: ({
//   type,
//   value,
//   label,
//   width,
//   selectList,
//   selectedIndex,
//   setSelectedIndex,
//   onChange,
//   className,
//   ...props
// }: withInsetLabelAndDropdownProps) => (
//   <div style={{ width: `${width}px` }} className="relative flex flex-col">
//     <input
//       type={type}
//       value={value}
//       className={`peer w-full appearance-none bg-transparent px-3 pb-1.5 pt-5 text-sm shadow-border outline-0 placeholder:text-gray-400 focus:z-10 focus:shadow-focus focus:outline-0 ${className}`}
//       onChange={onChange}
//       {...props}
//     />

//     <label
//       className={`pointer-events-none absolute inset-0 left-3 flex origin-top-left items-center overflow-hidden text-sm text-gray-700 duration-150 ease-in peer-focus:-translate-y-1.5 peer-focus:scale-[0.84] peer-focus:font-medium ${
//         typeof value !== "undefined" && value?.toString().length > 0 && "-translate-y-1.5 scale-[0.84] font-medium"
//       }`}
//     >
//       {label}
//     </label>

//     <DropdownSelect
//       optionHeight={28}
//       maxVisibleOptionsLength={10}
//       selectList={selectList}
//       selectedIndex={selectedIndex}
//       setSelectedIndex={setSelectedIndex}
//       className="inset-y-0 right-0 w-16 rounded peer-focus:z-10"
//     />
//   </div>
// );
