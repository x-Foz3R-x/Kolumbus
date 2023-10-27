import { useEffect, useState } from "react";
import useKeyPress from "./use-key-press";
import { Key } from "@/types";

/**
 * Attaches event listeners to detect clicks outside of given elements and pressing the escape key.
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
 * @template T The type of the items in the list.
 * @param list The list of items to navigate.
 * @param isNavigationEnabled Whether or not list navigation is enabled.
 * @param onArrowPressCallback A callback function to be called when an arrow key is pressed.
 * @param onEnterSelectCallback A callback function to be called when the enter key is pressed.
 * @returns An object containing the currently selected index and a function to set the selected index.
 */
export function useListNavigation<T>(
  list: T[],
  isNavigationEnabled: boolean,
  onArrowPressCallback: (selectedItem: T) => void,
  onEnterSelectCallback: (selectedItem: T) => void
) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const enterPressed = useKeyPress(Key.Enter);
  const arrowUpPressed = useKeyPress(Key.ArrowUp);
  const arrowDownPressed = useKeyPress(Key.ArrowDown);

  useEffect(() => {
    /**
     * Handles arrow key presses by updating the selected index and calling the onArrowPressCallback.
     * @param direction The direction of the arrow key press.
     */
    const handleArrowPress = (direction: Key.ArrowUp | Key.ArrowDown) => {
      const nextIndex = (direction === Key.ArrowUp ? -1 + selectedIndex + list.length : 1 + selectedIndex) % list.length;
      setSelectedIndex(nextIndex);
      onArrowPressCallback(list[nextIndex]);
    };

    if (!isNavigationEnabled) return;
    if (arrowUpPressed) handleArrowPress(Key.ArrowUp);
    else if (arrowDownPressed) handleArrowPress(Key.ArrowDown);
  }, [arrowUpPressed, arrowDownPressed]); // eslint-disable-line

  useEffect(() => {
    if (!isNavigationEnabled) return;
    if (enterPressed) onEnterSelectCallback(list[selectedIndex]);
  }, [enterPressed]); // eslint-disable-line

  return { selectedIndex, setSelectedIndex };
}
