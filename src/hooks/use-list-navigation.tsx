import { Placement } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import useKeyPress from "./use-key-press";
import { Key } from "@/types";
import { parsePlacement } from "@/components/ui/popover/use-popover";

type ListNavigationOptions = {
  onChange?: (index: number) => void;
  hasFocus?: false | "trigger" | "popover";
  setFocus?: React.Dispatch<React.SetStateAction<false | "trigger" | "popover">>;
  triggerRef?: React.MutableRefObject<HTMLElement | null>;
  listItemsRef?: React.MutableRefObject<(HTMLElement | null)[]>;
  listLength: number;
  skipIndexes?: number[];
  initialIndex?: number;
  placement?: Placement;
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
  initialIndex,
  placement,
  enabled,
  preventLoop = false,
  preventArrowDefault = { v: false, h: false },
  preventFocus = false,
}: ListNavigationOptions) {
  const [activeIndex, setActiveIndex] = useState(initialIndex ?? -1);
  const [firstValidIndex, setFirstValidIndex] = useState(0);
  const [lastValidIndex, setLastValidIndex] = useState(listLength - 1);

  const [arrowUpPressed] = useKeyPress(Key.ArrowUp, enabled && preventArrowDefault.v);
  const [arrowDownPressed] = useKeyPress(Key.ArrowDown, enabled && preventArrowDefault.v);
  const [arrowLeftPressed] = useKeyPress(Key.ArrowLeft, enabled && preventArrowDefault.h);
  const [arrowRightPressed] = useKeyPress(Key.ArrowRight, enabled && preventArrowDefault.h);

  const [homePressed] = useKeyPress(Key.Home);
  const [endPressed] = useKeyPress(Key.End);

  const [tabPressed, tabEvent] = useKeyPress(Key.Tab);

  // Update firstValidIndex, and lastValidIndex whenever skipArray or listLength changes
  useEffect(() => {
    const newExcludedIndexes = Array.from({ length: listLength }, (_, i) => (skipIndexes?.includes(i) ? "x" : "valid_index"));

    setFirstValidIndex(newExcludedIndexes.indexOf("valid_index") ?? 0);
    setLastValidIndex(newExcludedIndexes.lastIndexOf("valid_index") ?? listLength - 1);
  }, [skipIndexes, listLength]);

  // Handle arrow key press events for navigating within or to a list.
  useEffect(() => {
    if (!enabled) return;

    const handleArrowPress = (direction: Key.ArrowUp | Key.ArrowDown | Key.ArrowLeft | Key.ArrowRight) => {
      let nextIndex = activeIndex;

      if (direction === Key.ArrowUp || direction === Key.ArrowDown) {
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
      } else if (
        (activeIndex < 0 || hasFocus === "trigger") &&
        (direction === Key.ArrowLeft || direction === Key.ArrowRight) &&
        placement &&
        !preventFocus
      ) {
        const [side, alignment] = parsePlacement(placement);

        if (side === "top" || side === "bottom") return;

        const startIndex = alignment !== "end" ? firstValidIndex : lastValidIndex;
        const endIndex = alignment !== "end" ? lastValidIndex : firstValidIndex;

        nextIndex =
          side === "left"
            ? direction === Key.ArrowLeft
              ? startIndex
              : endIndex
            : side === "right"
              ? direction === Key.ArrowRight
                ? startIndex
                : endIndex
              : nextIndex;
      }

      // Focus on the list item at the nextIndex if it exists,
      // update the activeIndex with the new value, and trigger the onChangeCallback if available.
      !preventFocus && listItemsRef && listItemsRef.current[nextIndex]?.focus({ preventScroll: true });
      setActiveIndex(nextIndex);
      if (onChange) onChange(nextIndex);
    };

    if (arrowUpPressed) handleArrowPress(Key.ArrowUp);
    else if (arrowDownPressed) handleArrowPress(Key.ArrowDown);
    else if (arrowLeftPressed) handleArrowPress(Key.ArrowLeft);
    else if (arrowRightPressed) handleArrowPress(Key.ArrowRight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrowUpPressed, arrowDownPressed, arrowLeftPressed, arrowRightPressed]);

  // Handles Home and End key press events for navigating to the first or last not skipped list item.
  useEffect(() => {
    if (!enabled) return;

    const handleHomeEndPress = (direction: Key.Home | Key.End) => {
      let nextIndex = direction === Key.Home ? firstValidIndex : lastValidIndex;

      // Focus on the list item at the nextIndex if it exists,
      // update the activeIndex with the new value, and trigger the onChangeCallback if available.
      !preventFocus && listItemsRef && listItemsRef.current[nextIndex]?.focus({ preventScroll: true });
      setActiveIndex(nextIndex);
      if (onChange) onChange(nextIndex);
    };

    if (homePressed) handleHomeEndPress(Key.Home);
    else if (endPressed) handleHomeEndPress(Key.End);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homePressed, endPressed]);

  // Handles Tab key press events for managing focus transitions in different scenarios.
  useEffect(() => {
    if (!enabled && preventFocus) return;

    const handleTabPress = () => {
      if (hasFocus === "trigger" && !tabEvent?.shiftKey) {
        tabEvent?.preventDefault();

        let nextIndex = activeIndex < firstValidIndex ? firstValidIndex : activeIndex;

        // Focus on the list item at the nextIndex if it exists,
        // update the activeIndex with the new value, and call the onChangeCallback if available.
        listItemsRef && listItemsRef.current[nextIndex]?.focus();
        setActiveIndex(nextIndex);
        if (onChange) onChange(nextIndex);
      } else if (hasFocus === "popover") {
        if (tabEvent?.shiftKey) {
          tabEvent?.preventDefault();
          triggerRef && triggerRef.current?.focus();
        } else if (activeIndex < firstValidIndex) {
          tabEvent?.preventDefault();

          // Focus on the first list item (at index firstValidIndex),
          // reset the activeIndex to firstValidIndex, and call the onChangeCallback if available.
          listItemsRef && listItemsRef.current[firstValidIndex]?.focus();
          setActiveIndex(firstValidIndex);
          if (onChange) onChange(firstValidIndex);
        } else setFocus && setFocus(false);
      } else setFocus && setFocus(false);
    };

    if (tabPressed) handleTabPress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabPressed]);

  useEffect(() => {
    if (activeIndex > lastValidIndex) setActiveIndex(firstValidIndex);
  }, [activeIndex, firstValidIndex, lastValidIndex]);

  return [activeIndex, setActiveIndex] as const;
}
