"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  useFloating,
  useInteractions,
  useListNavigation,
  useTypeahead,
  useRole,
  FloatingList,
  autoUpdate,
} from "@floating-ui/react";
import { SelectContext } from "./select-context";
import { cn } from "~/lib/utils";

import { ScrollIndicator } from "../scroll-indicator";

type SelectProps = {
  defaultSelectedIndex?: number | null;
  selectedIndex?: number | null;
  setSelectedIndex?: (index: number | null) => void;
  className?: string;
  children?: React.ReactNode;
};
export function SelectInline({
  defaultSelectedIndex = null,
  selectedIndex: controlledSelectedIndex,
  setSelectedIndex: controlledSetSelectedIndex,
  className,
  children,
}: SelectProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [uncontrolledSelectedIndex, uncontrolledSetSelectedIndex] = useState<number | null>(
    defaultSelectedIndex,
  );

  const selectedIndex = controlledSelectedIndex ?? uncontrolledSelectedIndex;
  const setSelectedIndex = controlledSetSelectedIndex ?? uncontrolledSetSelectedIndex;

  //#region Floating UI
  const elementsRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);

  const handleSelect = useCallback(
    (index: number | null) => setSelectedIndex(index),
    [setSelectedIndex],
  );

  const { refs, context } = useFloating({ open: true, whileElementsMounted: autoUpdate });

  const role = useRole(context, { role: "listbox" });
  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: (index) => handleSelect(index),
  });

  const { getFloatingProps, getItemProps } = useInteractions([role, listNav, typeahead]);
  //#endregion

  const selectContext = useMemo(
    () => ({
      activeIndex,
      selectedIndex,
      getItemProps,
      handleSelect,
    }),
    [activeIndex, selectedIndex, getItemProps, handleSelect],
  );

  return (
    <SelectContext.Provider value={selectContext}>
      <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
        <ul
          ref={refs.setFloating}
          className={cn(
            "flex flex-col overflow-y-auto overflow-x-hidden bg-white p-1.5 font-inter dark:bg-gray-800 dark:text-white",
            className,
          )}
          {...getFloatingProps()}
        >
          {children}
        </ul>

        <ScrollIndicator
          scrollRef={refs.floating}
          zIndex={10}
          className={{ start: "rounded-t-xl", end: "rounded-b-xl" }}
          vertical
        />
      </FloatingList>
    </SelectContext.Provider>
  );
}
