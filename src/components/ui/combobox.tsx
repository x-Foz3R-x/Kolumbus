import React, { forwardRef, useRef, useState } from "react";
import { Key } from "@/types";

let comboName: string;

interface ComboboxProps {
  name: string;
  className?: string;
  children: React.ReactNode;
}
export const Combobox = forwardRef(function ComboboxComponent({ name, className, children }: ComboboxProps, ref: any) {
  comboName = name;

  return (
    <div ref={ref} className={`relative w-full flex-shrink-0 bg-transparent shadow-smI ${className}`}>
      {children}
    </div>
  );
});

interface ComboboxInputProps {
  value: string | number | readonly string[] | undefined;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  ariaExpanded: boolean;
  className?: string;
  children?: React.ReactNode;
}
export function ComboboxInput({
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
          if (e.key === Key.Escape || e.key === Key.Enter) inputRef.current?.blur();
        }}
        role="combobox"
        aria-controls={comboName}
        aria-autocomplete="list"
        aria-expanded={ariaExpanded}
        spellCheck={false}
        className={`w-full appearance-none bg-transparent py-[0.375rem] text-sm font-normal text-kolumbGray-900 outline-0 ${
          React.Children.count(children) > 0 ? " pl-2" : "px-2"
        }`}
      />
      <span className="relative z-10 flex items-center">{children}</span>
    </section>
  );
}

interface ComboboxListProps {
  showList: boolean;
  length: number;
  children: React.ReactNode;
}
export function ComboboxList({ showList, length, children }: ComboboxListProps) {
  const optionHeight = 52;
  const padding = 12;

  return (
    <div
      id={comboName}
      role="listbox"
      aria-label="combobox options list"
      style={{ height: length * optionHeight + padding }}
      className={`absolute w-full origin-top overflow-hidden rounded-b-[0.625rem] bg-white p-[6px] shadow-xl ${
        showList
          ? "scale-y-100 opacity-100 duration-300 ease-kolumb-flow"
          : "pointer-events-none scale-y-50 opacity-0 duration-200 ease-kolumb-leave"
      }`}
    >
      <section className="flex flex-col">{children}</section>
    </div>
  );
}

interface ComboboxOptionProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  isSelected: boolean;
  animationDelay?: string;
  children: React.ReactNode;
}
export function ComboboxOption({ onClick, isSelected, animationDelay, children }: ComboboxOptionProps) {
  const [opacity, setOpacity] = useState("opacity-0");
  setTimeout(() => {
    setOpacity("opacity-100");
  }, 300);

  return (
    <button
      role="option"
      aria-selected={isSelected}
      style={{ animationDelay: animationDelay }}
      onClick={onClick}
      className={`group flex w-full animate-appear items-center gap-4 rounded fill-kolumbGray-400 px-4 py-2 text-left text-sm hover:z-10 hover:fill-red-500 hover:shadow-select ${opacity} ${
        isSelected ? "bg-kolumbGray-100 shadow-select hover:bg-kolumbGray-200" : "hover:bg-kolumbGray-100"
      }`}
    >
      {children}
    </button>
  );
}
