import { useEffect, useState } from "react";
import useKeyPress from "./use-key-press";
import { Key } from "@/types";

// todo - add printable character navigation (e.g. type "a" to select the first option that starts with "a")
// todo - add arrow key navigation for nested dropdowns (e.g. left/right arrow keys to navigate between nested dropdowns)

type ListNavigationOptions = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onChange?: (index: number) => void;
  triggerRef?: React.MutableRefObject<HTMLElement | null>;
  listItemsRef?: React.MutableRefObject<(HTMLElement | null)[]>;
  listLength: number;
  skipIndexes?: number[];
  selectFirstIndex?: boolean;
  preventLoop?: boolean;
  preventFocus?: boolean;
  preventArrowDefault?: { v?: boolean; h?: boolean };
};
/**
 * Custom hook for list navigation.
 *
 * @example
 * const [isOpen, setOpen] = useState(false);
 * const triggerRef = useRef(null);
 * const listItemsRef = useRef([]);
 *
 * const [activeIndex, setActiveIndex, setFocus] = useListNavigation({
 *   isOpen,
 *   setOpen,
 *   onChange: (index) => console.log(`Active index changed to ${index}`);
 *   triggerRef,
 *   listItemsRef,
 *   listLength: 5,
 *   skipIndexes: [0, 2],
 *   selectFirstIndex: false,
 *   preventLoop: false,
 *   preventFocus: false,
 *   preventArrowDefault: { v: false, h: false },
 * });
 */
export default function useListNavigation({
  isOpen,
  setOpen,
  onChange,
  triggerRef,
  listItemsRef,
  listLength,
  skipIndexes,
  selectFirstIndex = false,
  preventLoop = false,
  preventFocus = false,
  preventArrowDefault = { v: false, h: false },
}: ListNavigationOptions) {
  const [activeIndex, setActiveIndex] = useState(selectFirstIndex ? getValidIndexes(listLength, skipIndexes).first : -1);
  const [hasFocus, setFocus] = useState<"trigger" | "popover">();

  const [firstValidIndex, setFirstValidIndex] = useState(getValidIndexes(listLength, skipIndexes).first);
  const [lastValidIndex, setLastValidIndex] = useState(getValidIndexes(listLength, skipIndexes).last);

  const [arrowUpPressed] = useKeyPress(Key.ArrowUp, isOpen && preventArrowDefault.v);
  const [arrowDownPressed] = useKeyPress(Key.ArrowDown, isOpen && preventArrowDefault.v);
  const [arrowLeftPressed] = useKeyPress(Key.ArrowLeft, isOpen && preventArrowDefault.h);
  const [arrowRightPressed] = useKeyPress(Key.ArrowRight, isOpen && preventArrowDefault.h);

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

  // Handle arrow key press events for navigating within or to a list.
  useEffect(() => {
    if (!isOpen) return;

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
    if (!isOpen) return;
    if (homePressed) focusOnListItem(firstValidIndex);
    else if (endPressed) focusOnListItem(lastValidIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homePressed, endPressed]);

  // Handles Tab key press events for managing focus transitions in different scenarios.
  useEffect(() => {
    if (!isOpen && preventFocus) return;

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
        setOpen(false);
      }
    };

    if (tabPressed) handleTabPress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabPressed]);

  // Handle valid indexes for the first and last list items.
  useEffect(() => {
    const { first, last } = getValidIndexes(listLength, skipIndexes);

    setFirstValidIndex(first);
    setLastValidIndex(last);
  }, [skipIndexes, listLength]);

  // Handle open event for managing active index and focus.
  useEffect(() => {
    if (!isOpen) return;

    const nextIndex = selectFirstIndex ? firstValidIndex : -1;

    focusOnListItem(nextIndex);
    setActiveIndex(nextIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (activeIndex > lastValidIndex) setActiveIndex(firstValidIndex);
  }, [activeIndex, firstValidIndex, lastValidIndex]);

  return [activeIndex, setActiveIndex, setFocus] as const;
}

// Find first and last valid index and return them as an object with keys "first" and "last".
const getValidIndexes = (listLength: number, skipIndexes?: number[]) => {
  const newExcludedIndexes = Array.from({ length: listLength }, (_, i) => (skipIndexes?.includes(i) ? "invalid" : "valid"));

  const firstValidIndex = newExcludedIndexes.indexOf("valid") ?? 0;
  const lastValidIndex = newExcludedIndexes.lastIndexOf("valid") ?? listLength - 1;

  return { first: firstValidIndex, last: lastValidIndex };
};
