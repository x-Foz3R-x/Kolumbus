import React, { forwardRef, useRef, useState } from "react";
import { Key } from "@/types";

let comboName: string;

interface ComboboxProps {
  name: string;
  className?: string;
  children: React.ReactNode;
}
export const Combobox = forwardRef(function ComboboxComponent(
  { name, className, children }: ComboboxProps,
  ref: any
) {
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
        className={`w-full appearance-none bg-transparent py-[0.375rem] text-sm font-normal text-gray-900 outline-0 ${
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
      aria-label="Options list"
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
  isSelected: boolean;
  animationDelay?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}
export function ComboboxOption({ isSelected, animationDelay, onClick, children }: ComboboxOptionProps) {
  const [opacity, setOpacity] = useState("opacity-0");
  setTimeout(() => {
    setOpacity("opacity-100");
  }, 300);

  return (
    <button
      style={{ animationDelay: animationDelay }}
      className={`group flex w-full animate-appear items-center gap-4 rounded fill-gray-400 px-4 py-2 text-left text-sm hover:z-10 hover:fill-red-500 hover:shadow-select ${opacity} ${
        isSelected ? "bg-gray-100 shadow-select hover:bg-gray-200" : "hover:bg-gray-100"
      }`}
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
