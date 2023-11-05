import { useEffect, useState } from "react";
import useKeyPress from "./use-key-press";
import { Key } from "@/types";

import { Placement } from "@/components/ui/popover";
import { parsePlacement } from "@/components/ui/popover/use-popover";

/**
 * Attaches event listeners to detect clicks outside of given elements and pressing the escape key.
 *
 * @param refs - An array of React ref objects that point to the elements to detect clicks outside of.
 * @param callback - A function to be called when detected close interaction.
 */
export function useCloseTriggers(refs: React.RefObject<HTMLElement>[], callback: Function) {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!refs.some((ref) => ref.current && ref.current.contains(event.target as Node))) {
        callback();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callback();
      }
    };

    document.addEventListener("mouseup", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [refs, callback]);
}

/**
 * A hook that provides list navigation functionality for accessibility purposes.
 *
 * @template T The type of the items in the list.
 * @param list The list of items to navigate.
 * @param isNavigationEnabled Whether or not list navigation is enabled.
 * @param onSelectCallback A callback function to be called when the enter key is pressed.
 * @param onChangeCallback A callback function to be called when an arrow key is pressed.
 * @returns An object containing the currently selected index and a function to set the selected index.
 */
export function useListNavigationOLD<T>(
  list: T[],
  isNavigationEnabled: boolean,
  callback: { onSelect: (selectedItem: T, index: number) => void; onChange?: (selectedItem: T, index: number) => void }
) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const enterPressed = useKeyPress(Key.Enter);
  const spacePressed = useKeyPress(Key.Space);
  const arrowUpPressed = useKeyPress(Key.ArrowUp, isNavigationEnabled);
  const arrowDownPressed = useKeyPress(Key.ArrowDown, isNavigationEnabled);
  const homePressed = useKeyPress(Key.Home, isNavigationEnabled);
  const endPressed = useKeyPress(Key.End, isNavigationEnabled);

  useEffect(() => {
    if (!isNavigationEnabled) return;

    /**
     * Handles arrow key presses by updating the selected index and calling the onArrowPressCallback.
     * @param direction The direction of the arrow key press.
     */
    const handleArrowPress = (direction: Key.ArrowUp | Key.ArrowDown) => {
      let nextIndex = selectedIndex;

      if (selectedIndex !== -1) {
        nextIndex = (direction === Key.ArrowUp ? -1 + selectedIndex + list.length : 1 + selectedIndex) % list.length;
      } else {
        nextIndex = direction === Key.ArrowUp ? list.length - 1 : 0;
      }

      setSelectedIndex(nextIndex);
      if (callback.onChange) callback.onChange(list[nextIndex], nextIndex);
    };
    const handleHomeEndPress = (direction: Key.Home | Key.End) => {
      const nextIndex = direction === Key.Home ? 0 : list.length - 1;

      setSelectedIndex(nextIndex);
      if (callback.onChange) callback.onChange(list[nextIndex], nextIndex);
    };

    if (arrowUpPressed) handleArrowPress(Key.ArrowUp);
    else if (arrowDownPressed) handleArrowPress(Key.ArrowDown);
    else if (homePressed) handleHomeEndPress(Key.Home);
    else if (endPressed) handleHomeEndPress(Key.End);
  }, [isNavigationEnabled, arrowUpPressed, arrowDownPressed, homePressed, endPressed]); // eslint-disable-line

  useEffect(() => {
    if (!isNavigationEnabled) return;
    if (enterPressed || spacePressed) callback.onSelect(list[selectedIndex], selectedIndex);
  }, [isNavigationEnabled, enterPressed, spacePressed, callback, list, selectedIndex]);

  useEffect(() => {
    if (list.length <= selectedIndex) setSelectedIndex(0);
  }, [list, selectedIndex]);

  return [selectedIndex, setSelectedIndex] as const;
}

type UseListNavigationProps = {
  onChangeCallback?: (index: number) => void;
  hasFocus?: false | "trigger" | "popover";
  setFocus?: React.Dispatch<React.SetStateAction<false | "trigger" | "popover">>;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
  listItemsRef: React.MutableRefObject<(HTMLButtonElement | HTMLLIElement | null)[]>;
  listLength: number;
  initialIndex: number;
  placement: Placement;
  enabled: boolean;
  loop: boolean;
};
/**
 * A hook that provides dropdown navigation functionality for accessibility purposes.
 *
 * @returns An object containing the currently selected index and a function to set the selected index.
 */
export function useListNavigation({
  onChangeCallback,
  hasFocus,
  setFocus,
  triggerRef,
  listItemsRef,
  listLength,
  initialIndex,
  placement,
  enabled,
  loop,
}: UseListNavigationProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const [arrowUpPressed] = useKeyPress(Key.ArrowUp, enabled);
  const [arrowDownPressed] = useKeyPress(Key.ArrowDown, enabled);
  const [arrowLeftPressed] = useKeyPress(Key.ArrowLeft, enabled);
  const [arrowRightPressed] = useKeyPress(Key.ArrowRight, enabled);

  const [homePressed] = useKeyPress(Key.Home, enabled);
  const [endPressed] = useKeyPress(Key.End, enabled);

  const [tabPressed, tabEvent] = useKeyPress(Key.Tab);

  // todo - add printable character navigation (e.g. type "a" to select the first option that starts with "a")
  // todo - add support for disabled options in the keyboard navigation
  // todo - add arrow key navigation for nested dropdowns

  // Handle arrow key press events for navigating within or to a list.
  useEffect(() => {
    if (!enabled) return;

    const handleArrowPress = (direction: Key.ArrowUp | Key.ArrowDown | Key.ArrowLeft | Key.ArrowRight) => {
      let nextIndex = activeIndex;

      if (direction === Key.ArrowUp || direction === Key.ArrowDown) {
        if (activeIndex < 0 || hasFocus === "trigger") {
          nextIndex = direction === Key.ArrowUp ? listLength - 1 : 0;
        } else if (loop) {
          nextIndex = (direction === Key.ArrowUp ? activeIndex + listLength - 1 : activeIndex + 1) % listLength;
        } else {
          nextIndex = direction === Key.ArrowUp ? Math.max(activeIndex - 1, 0) : Math.min(activeIndex + 1, listLength - 1);
        }
      } else if (hasFocus === "trigger" && (direction === Key.ArrowLeft || direction === Key.ArrowRight)) {
        const [side, alignment] = parsePlacement(placement);

        if (side === "top" || side === "bottom") return;

        if (side === "left") {
          nextIndex =
            alignment !== "end" ? (direction === Key.ArrowLeft ? 0 : listLength - 1) : direction === Key.ArrowLeft ? listLength - 1 : 0;
        } else if (side === "right") {
          nextIndex =
            alignment !== "end" ? (direction === Key.ArrowRight ? 0 : listLength - 1) : direction === Key.ArrowRight ? listLength - 1 : 0;
        }
      }

      // Focus on the list item at the nextIndex if it exists,
      // update the activeIndex with the new value, and trigger the onChangeCallback if available.
      listItemsRef.current[nextIndex]?.focus({ preventScroll: true });
      setActiveIndex(nextIndex);
      if (onChangeCallback) onChangeCallback(nextIndex);
    };

    if (arrowUpPressed) handleArrowPress(Key.ArrowUp);
    else if (arrowDownPressed) handleArrowPress(Key.ArrowDown);
    else if (arrowLeftPressed) handleArrowPress(Key.ArrowLeft);
    else if (arrowRightPressed) handleArrowPress(Key.ArrowRight);
  }, [arrowUpPressed, arrowDownPressed, arrowLeftPressed, arrowRightPressed]); // eslint-disable-line

  // Handles Home and End key press events for navigating to the first or last list item.
  useEffect(() => {
    const handleHomeEndPress = (direction: Key.Home | Key.End) => {
      const nextIndex = direction === Key.Home ? 0 : listLength - 1;

      // Focus on the list item at the nextIndex if it exists,
      // update the activeIndex with the new value, and trigger the onChangeCallback if available.
      listItemsRef.current[nextIndex]?.focus({ preventScroll: true });
      setActiveIndex(nextIndex);
      if (onChangeCallback) onChangeCallback(nextIndex);
    };

    if (homePressed) handleHomeEndPress(Key.Home);
    else if (endPressed) handleHomeEndPress(Key.End);
  }, [homePressed, endPressed]); // eslint-disable-line

  // Handles Tab key press events for managing focus transitions in different scenarios.
  useEffect(() => {
    const handleTabPress = () => {
      if (hasFocus === "trigger" && !tabEvent?.shiftKey) {
        tabEvent?.preventDefault();

        let nextIndex = activeIndex < 0 ? 0 : activeIndex;

        // Focus on the list item at the nextIndex if it exists,
        // update the activeIndex with the new value, and call the onChangeCallback if available.
        listItemsRef.current[nextIndex]?.focus();
        setActiveIndex(nextIndex);
        if (onChangeCallback) onChangeCallback(nextIndex);
      } else if (hasFocus === "popover") {
        if (tabEvent?.shiftKey) {
          tabEvent?.preventDefault();
          triggerRef.current?.focus();
        } else if (activeIndex < 0) {
          tabEvent?.preventDefault();

          // Focus on the first list item (at index 0),
          // reset the activeIndex to 0, and call the onChangeCallback if available.
          listItemsRef.current[0]?.focus();
          setActiveIndex(0);
          if (onChangeCallback) onChangeCallback(0);
        } else setFocus && setFocus(false);
      } else setFocus && setFocus(false);
    };

    if (tabPressed) handleTabPress();
  }, [tabPressed]); // eslint-disable-line

  useEffect(() => {
    if (activeIndex > listLength - 1) setActiveIndex(0);
  }, [listLength, activeIndex]);

  return [activeIndex, setActiveIndex] as const;
}
