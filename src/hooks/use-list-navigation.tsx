import { useEffect, useState } from "react";
import useKeyPress from "./use-key-press";
import { Key } from "@/types";

type ListNavigationOptions = {
  onChange?: (index: number) => void;
  hasFocus?: false | "trigger" | "popover";
  setFocus?: React.Dispatch<React.SetStateAction<false | "trigger" | "popover">>;
  triggerRef?: React.MutableRefObject<HTMLElement | null>;
  listItemsRef?: React.MutableRefObject<(HTMLElement | null)[]>;
  listLength: number;
  initialIndex?: number;
  skipIndexes?: number[];
  enabled: boolean;
  preventLoop?: boolean;
  preventFocus?: boolean;
  /** v -> vertical, h -> horizontal */
  preventArrowDefault?: { v?: boolean; h?: boolean };
};

// todo - add printable character navigation (e.g. type "a" to select the first option that starts with "a")
// todo - add arrow key navigation for nested dropdowns (e.g. left/right arrow keys to navigate between nested dropdowns)
/**
 * Custom hook for list navigation.
 *
 * @example
 * const [hasFocus, setFocus] = useState(false)
 * const triggerRef = useRef(null);
 * const listItemsRef = useRef([]);
 *
 * const [activeIndex, setActiveIndex] = useListNavigation({
 *   onChangeCallback: (index) => console.log(`Active index changed to ${index}`);
 *   hasFocus,
 *   setFocus,
 *   triggerRef,
 *   listItemsRef,
 *   listLength: 5,
 *   initialIndex: 0,
 *   skipIndexes: [2],
 *   placement: "bottom",
 *   enabled: true,
 *   loop: true,
 *   useFocus: true,
 * });
 */
export default function useListNavigation({
  onChange,
  hasFocus,
  setFocus,
  triggerRef,
  listItemsRef,
  listLength,
  skipIndexes,
  initialIndex = -1,
  enabled,
  preventLoop = false,
  preventFocus = false,
  preventArrowDefault = { v: false, h: false },
}: ListNavigationOptions) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [firstValidIndex, setFirstValidIndex] = useState(0);
  const [lastValidIndex, setLastValidIndex] = useState(listLength - 1);

  const [arrowUpPressed] = useKeyPress(Key.ArrowUp, enabled && preventArrowDefault.v);
  const [arrowDownPressed] = useKeyPress(Key.ArrowDown, enabled && preventArrowDefault.v);
  const [arrowLeftPressed] = useKeyPress(Key.ArrowLeft, enabled && preventArrowDefault.h);
  const [arrowRightPressed] = useKeyPress(Key.ArrowRight, enabled && preventArrowDefault.h);

  const [homePressed] = useKeyPress(Key.Home);
  const [endPressed] = useKeyPress(Key.End);

  const [tabPressed, tabEvent] = useKeyPress(Key.Tab);

  /**
   * Focuses on a specific list item by its index.
   * @param index - The index of the list item to focus on.
   */
  const focusOnListItem = (index: number) => {
    if (!preventFocus) listItemsRef?.current[index]?.focus();
    setActiveIndex(index);
    onChange?.(index);
  };

  // Handle valid indexes for the first and last list items.
  useEffect(() => {
    const newExcludedIndexes = Array.from({ length: listLength }, (_, i) => (skipIndexes?.includes(i) ? "x" : "valid_index"));

    setFirstValidIndex(newExcludedIndexes.indexOf("valid_index") ?? 0);
    setLastValidIndex(newExcludedIndexes.lastIndexOf("valid_index") ?? listLength - 1);
  }, [skipIndexes, listLength]);

  // Handle arrow key press events for navigating within or to a list.
  useEffect(() => {
    if (!enabled) return;

    // Handles Up & Down arrow keys for navigating within a list.
    const handleYArrowPress = (direction: Key.ArrowUp | Key.ArrowDown) => {
      let nextIndex = activeIndex;

      if (activeIndex < 0 || hasFocus === "trigger") {
        nextIndex = direction === Key.ArrowUp ? lastValidIndex : firstValidIndex;
      } else if (!preventLoop) {
        nextIndex = (direction === Key.ArrowUp ? activeIndex + listLength - 1 : activeIndex + 1) % listLength;

        // Determine the nextIndex by skipping the indexes specified in skipArray.
        while (skipIndexes?.includes(nextIndex)) {
          nextIndex = (direction === Key.ArrowUp ? nextIndex + listLength - 1 : nextIndex + 1) % listLength;
        }
      } else {
        nextIndex = direction === Key.ArrowUp ? Math.max(activeIndex - 1, firstValidIndex) : Math.min(activeIndex + 1, lastValidIndex);

        // Determine the nextIndex by skipping the indexes specified in skipArray.
        while (skipIndexes?.includes(nextIndex)) {
          nextIndex = direction === Key.ArrowUp ? Math.max(nextIndex - 1, firstValidIndex) : Math.min(nextIndex + 1, lastValidIndex);
        }
      }

      focusOnListItem(nextIndex);
    };

    // Handles Left & Right arrow keys for navigating within a list.
    const handleXArrowPress = (direction: Key.ArrowLeft | Key.ArrowRight) => {
      if ((activeIndex < 0 || hasFocus === "trigger") && !preventFocus) {
        focusOnListItem(direction === Key.ArrowRight ? firstValidIndex : lastValidIndex);
      }
    };

    if (arrowUpPressed) handleYArrowPress(Key.ArrowUp);
    else if (arrowDownPressed) handleYArrowPress(Key.ArrowDown);
    else if (arrowLeftPressed) handleXArrowPress(Key.ArrowLeft);
    else if (arrowRightPressed) handleXArrowPress(Key.ArrowRight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrowUpPressed, arrowDownPressed, arrowLeftPressed, arrowRightPressed]);

  // Handles Home and End key press events for navigating to the first or last not skipped list item.
  useEffect(() => {
    if (!enabled) return;
    if (homePressed) focusOnListItem(firstValidIndex);
    else if (endPressed) focusOnListItem(lastValidIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homePressed, endPressed]);

  // Handles Tab key press events for managing focus transitions in different scenarios.
  useEffect(() => {
    if (!enabled && preventFocus) return;

    const handleTabPress = () => {
      if (hasFocus === "trigger" && !tabEvent?.shiftKey) {
        tabEvent?.preventDefault();
        const nextIndex = activeIndex < firstValidIndex ? firstValidIndex : activeIndex;
        focusOnListItem(nextIndex);
      } else if (hasFocus === "popover" && tabEvent?.shiftKey) {
        tabEvent?.preventDefault();
        triggerRef?.current?.focus();
      } else if (hasFocus === "popover" && activeIndex < firstValidIndex) {
        tabEvent?.preventDefault();
        focusOnListItem(firstValidIndex);
      } else {
        setFocus?.(false);
      }
    };

    if (tabPressed) handleTabPress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabPressed]);

  useEffect(() => {
    if (activeIndex > lastValidIndex) setActiveIndex(firstValidIndex);
  }, [activeIndex, firstValidIndex, lastValidIndex]);

  return [activeIndex, setActiveIndex] as const;
}
