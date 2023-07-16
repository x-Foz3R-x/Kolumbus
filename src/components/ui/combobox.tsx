import React, { forwardRef, useRef, useState } from "react";
import useKeyboardNavigation from "@/hooks/use-keyboard-navigation";

let comboName: string;

interface ComboboxProps {
  name: string;
  className?: string;
  children: React.ReactNode;
}
export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  function comboboxComponent(
    { name, className, children },
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    comboName = name;
    return (
      <div
        ref={ref}
        className={`relative w-full flex-shrink-0 bg-transparent ${className}`}
      >
        {children}
      </div>
    );
  }
);

interface ComboboxInputProps {
  value: string | number | readonly string[] | undefined;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  ariaExpanded: boolean;
  className?: string;
  children?: React.ReactNode;
}
export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function comboboxComponent(
    {
      value,
      placeholder,
      onChange,
      onFocus,
      ariaExpanded,
      className,
      children,
    },
    ref: any
    // ref: React.ForwardedRef<HTMLInputElement>
  ) {
    return (
      <section className={`relative z-10 flex items-center ${className}`}>
        <input
          ref={ref}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              ref.current?.blur();
              console.log(ref);
            }
          }}
          role="combobox"
          aria-controls={comboName}
          aria-autocomplete="list"
          aria-expanded={ariaExpanded}
          data-active-option=""
          className={`w-full appearance-none bg-transparent py-[0.375rem] text-sm font-normal text-kolumbGray-900 outline-0 ${
            React.Children.count(children) > 0 ? " pl-2" : "px-2"
          }`}
        />
        <section className="relative z-10 flex items-center">
          {children}
        </section>
      </section>
    );
  }
);

export function ComboboxInput2({
  value,
  placeholder,
  onChange,
  onFocus,
  ariaExpanded,
  className,
  children,
}: ComboboxInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className={`relative z-10 flex items-center ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={(e) => {
          if (e.key === "Escape") inputRef.current?.blur();
        }}
        role="combobox"
        aria-controls={comboName}
        aria-autocomplete="list"
        aria-expanded={ariaExpanded}
        data-active-option=""
        className={`w-full appearance-none bg-transparent py-[0.375rem] text-sm font-normal text-kolumbGray-900 outline-0 ${
          React.Children.count(children) > 0 ? " pl-2" : "px-2"
        }`}
      />
      <section className="relative z-10 flex items-center">{children}</section>
    </section>
  );
}

interface ComboboxListProps {
  showWhen: boolean;
  length: number;
  children: React.ReactNode;
}
export function ComboboxList({
  showWhen,
  length,
  children,
}: ComboboxListProps) {
  return (
    <div
      id={comboName}
      role="listbox"
      aria-label="combobox options list"
      style={{ height: length * 52 + 12 }}
      className={`absolute w-full origin-top overflow-hidden rounded-b-[0.625rem] bg-white p-[6px] shadow-container ${
        showWhen
          ? "scale-y-100 opacity-100 duration-300 ease-kolumb-flow"
          : "pointer-events-none scale-y-50 opacity-0 duration-200 ease-kolumb-leave"
      }`}
    >
      <section className="flex flex-col">{children}</section>
    </div>
  );
}

interface ComboboxOptionProps {
  id: string;
  animationDelay?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}
export const ComboboxOption = forwardRef<
  HTMLButtonElement,
  ComboboxOptionProps
>(function ComboboxOptionComponent(
  { id, animationDelay, onClick, children },
  ref
) {
  const [opacity, setOpacity] = useState("opacity-0");
  setTimeout(() => {
    setOpacity("opacity-100");
  }, 300);

  return (
    <button
      ref={ref}
      id={id}
      role="option"
      aria-selected={false}
      style={{ animationDelay: animationDelay }}
      onClick={onClick}
      className={`group flex w-full animate-appear items-center gap-4 rounded-md px-4 py-2 text-left text-sm hover:bg-kolumbGray-100 focus:bg-kolumblue-300 ${opacity}`}
    >
      {children}
    </button>
  );
});
