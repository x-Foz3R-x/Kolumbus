import { useEffect, useState } from "react";
import useKeyPress from "./use-key-press";
import { Key } from "@/types";
import { DropdownList } from "@/components/ui/dropdown";
import { Placement } from "@/components/ui/popover";
import { parsePlacement } from "@/components/ui/popover/use-popover";

/**
 * Attaches event listeners to detect clicks outside of given elements and pressing the escape key.
 *
 * @param refs - An array of React ref objects that point to the elements to detect clicks outside of.
 * @param callback - A function to be called when a click outside of any of the elements or the escape key is pressed.
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
export function useListNavigation<T>(
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

type UseDropdownNavigationProps = {
  list: DropdownList;
  listItemsRef: React.MutableRefObject<(HTMLButtonElement | HTMLLIElement | null)[]>;
  placement: Placement;
  initialIndex: number;
  enabled: boolean;
  loop: boolean;
  hasFocus: false | "button" | "dropdown";
  setFocus: React.Dispatch<React.SetStateAction<false | "button" | "dropdown">>;
};
/**
 * A hook that provides dropdown navigation functionality for accessibility purposes.
 *
 * @param DropdownList The list of items to navigate.
 * @param listItemsRef A React ref object that points to the list items.
 * @param enabled Whether or not dropdown navigation is enabled.
 * @param loop Whether or not the navigation should loop.
 * @param startAt The index to start at.
 * @returns An object containing the currently selected index and a function to set the selected index.
 */
export function useDropdownNavigation({
  list,
  listItemsRef,
  placement,
  initialIndex,
  enabled,
  loop,
  hasFocus,
  setFocus,
}: UseDropdownNavigationProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const [enterPressed] = useKeyPress(Key.Enter);
  const [spacePressed] = useKeyPress(Key.Space);
  const [arrowUpPressed] = useKeyPress(Key.ArrowUp, enabled);
  const [arrowDownPressed] = useKeyPress(Key.ArrowDown, enabled);
  const [arrowLeftPressed] = useKeyPress(Key.ArrowLeft, enabled);
  const [arrowRightPressed] = useKeyPress(Key.ArrowRight, enabled);
  const [homePressed] = useKeyPress(Key.Home, enabled);
  const [endPressed] = useKeyPress(Key.End, enabled);
  const [tabPressed, tabEvent] = useKeyPress(Key.Tab);

  useEffect(() => {
    if (!enabled) return;

    const handleVerticalArrowPress = (direction: Key.ArrowUp | Key.ArrowDown) => {
      let nextIndex = activeIndex;

      if (activeIndex < 0 || hasFocus === "button") {
        nextIndex = direction === Key.ArrowUp ? list.length - 1 : 0;
      } else if (loop) {
        nextIndex = (direction === Key.ArrowUp ? activeIndex + list.length - 1 : activeIndex + 1) % list.length;
      } else {
        nextIndex = direction === Key.ArrowUp ? Math.max(activeIndex - 1, 0) : Math.min(activeIndex + 1, list.length - 1);
      }

      // Focus on the list item at the nextIndex if it exists.
      listItemsRef.current[nextIndex]?.focus({ preventScroll: true });

      // Update the activeIndex with the new value.
      setActiveIndex(nextIndex);
    };

    const handleHorizontalArrowPress = (direction: Key.ArrowLeft | Key.ArrowRight) => {
      if (hasFocus !== "button") return;

      const [side, alignment] = parsePlacement(placement);
      let nextIndex = activeIndex;

      if (side === "top" || side === "bottom") return;

      if (side === "left") {
        nextIndex =
          alignment !== "end" ? (direction === Key.ArrowLeft ? 0 : list.length - 1) : direction === Key.ArrowLeft ? list.length - 1 : 0;
      } else if (side === "right") {
        nextIndex =
          alignment !== "end" ? (direction === Key.ArrowRight ? 0 : list.length - 1) : direction === Key.ArrowRight ? list.length - 1 : 0;
      }

      // Focus on the list item at the nextIndex if it exists.
      listItemsRef.current[nextIndex]?.focus({ preventScroll: true });

      // Update the activeIndex with the new value.
      setActiveIndex(nextIndex);
    };

    const handleHomeEndPress = (direction: Key.Home | Key.End) => {
      const nextIndex = direction === Key.Home ? 0 : list.length - 1;

      // Focus on the list item at the nextIndex if it exists.
      listItemsRef.current[nextIndex]?.focus({ preventScroll: true });

      // Update the activeIndex with the new value.
      setActiveIndex(nextIndex);
    };

    const handleTabPress = () => {
      if ((hasFocus === "button" && !tabEvent?.shiftKey) || (hasFocus === "dropdown" && tabEvent?.shiftKey)) return;
      setFocus(false);
    };

    if (arrowUpPressed) handleVerticalArrowPress(Key.ArrowUp);
    else if (arrowDownPressed) handleVerticalArrowPress(Key.ArrowDown);
    else if (arrowLeftPressed) handleHorizontalArrowPress(Key.ArrowLeft);
    else if (arrowRightPressed) handleHorizontalArrowPress(Key.ArrowRight);
    else if (homePressed) handleHomeEndPress(Key.Home);
    else if (endPressed) handleHomeEndPress(Key.End);
    else if (tabPressed) handleTabPress();
  }, [enabled, arrowUpPressed, arrowDownPressed, arrowLeftPressed, arrowRightPressed, homePressed, endPressed, tabPressed]); // eslint-disable-line

  useEffect(() => {
    if (list.length <= activeIndex) setActiveIndex(0);
  }, [list, activeIndex]);

  return [activeIndex, setActiveIndex, { enter: enterPressed, space: spacePressed }] as const;
}
