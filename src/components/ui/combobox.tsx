"use client";

import React, { createContext, forwardRef, useContext, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Key } from "@/types";
import { BasicInput } from "./input";

const ComboboxContext = createContext<{ name: string; isExpanded: boolean } | null>(null);
export function useCombobox() {
  const context = useContext(ComboboxContext);
  if (!context) throw new Error("useCombobox must be used within a ComboboxContext.Provider");
  return context;
}

//#region Types
type RootProps = {
  name: string;
  isExpanded: boolean;
  children: React.ReactNode;
};

type InputProps = {
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  className?: string;
  children?: React.ReactNode;
};

type ListProps = {
  listHeight?: number;
  className?: string;
  children: React.ReactNode;
};

type OptionProps = {
  isSelected: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onMouseMove: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave: React.MouseEventHandler<HTMLButtonElement>;
  animationDelay?: number;
  className?: string;
  children?: React.ReactNode;
};
//#endregion

const Combobox = {
  Root: forwardRef<HTMLDivElement, RootProps>(function ComboboxComponent(
    { name, isExpanded, children },
    ref
  ) {
    const value = {
      name,
      isExpanded,
    };

    return (
      <div ref={ref} className="relative w-full flex-shrink-0 bg-transparent">
        <ComboboxContext.Provider value={value}>{children}</ComboboxContext.Provider>
      </div>
    );
  }),

  Input({ placeholder, value = "", onChange, onFocus, className, children }: InputProps) {
    const { name, isExpanded } = useCombobox();
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <div className={cn("relative z-10 flex", className)}>
        <BasicInput
          type="text"
          name="combobox-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={(e) => {
            if (e.key === Key.Escape || e.key === Key.Enter) inputRef.current?.blur();
          }}
          role="combobox"
          aria-controls={name}
          aria-expanded={isExpanded}
          aria-autocomplete="list"
          autoComplete="false"
          autoCorrect="false"
          spellCheck="false"
          variant="unstyled"
          className={`flex-grow bg-transparent ${React.Children.count(children) > 0 ? "pl-2" : "px-2"}`}
        />
        <span className="relative flex items-center">{children}</span>
      </div>
    );
  },

  /**
   * @param listLength listLength * comboboxOptionHeight + padding
   */
  List({ listHeight, className, children }: ListProps) {
    const { name, isExpanded } = useCombobox();

    return (
      <ul
        id={name}
        role="listbox"
        aria-label="Options list"
        style={{ height: listHeight ? `${listHeight}px` : "auto" }}
        className={cn(
          "absolute flex w-full origin-top flex-col overflow-hidden bg-white",
          isExpanded ? "opacity-100" : "pointer-events-none opacity-0",
          className
        )}
      >
        {children}
      </ul>
    );
  },

  Option({
    isSelected,
    onClick,
    onMouseMove,
    onMouseLeave,
    animationDelay = 0,
    className,
    children,
  }: OptionProps) {
    const [opacity, setOpacity] = useState("opacity-0");
    setTimeout(() => {
      setOpacity("opacity-100");
    }, animationDelay);

    return (
      <button
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        role="option"
        aria-selected={isSelected}
        style={{ animationDelay: `${animationDelay}ms` }}
        className={cn("flex w-full items-center hover:z-10", opacity, className)}
      >
        {children}
      </button>
    );
  },
};

export default Combobox;
