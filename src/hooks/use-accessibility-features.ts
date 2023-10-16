/* eslint-disable */

import { useEffect, useState } from "react";
import useKeyPress from "./use-key-press";
import { Key } from "@/types";

/**
 * Attaches event listeners to the document to detect when a user clicks outside of a given element,
 * presses the escape key, or scrolls the window. When any of these events occur, the provided callback
 * function is called.
 *
 * @param ref - A React ref object that points to the element that should trigger the callback when clicked outside of.
 * @param callback - The function to call when the user clicks outside of the element, presses the escape key, or scrolls the window.
 */
export function useCloseTriggers(ref: React.RefObject<HTMLElement>, callback: Function) {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) callback();
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === Key.Escape) callback();
    };

    const handleScroll = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) callback();
    };

    document.addEventListener("mouseup", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [ref, callback]);
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
  }, [arrowUpPressed, arrowDownPressed]);

  useEffect(() => {
    if (!isNavigationEnabled) return;
    if (enterPressed) onEnterSelectCallback(list[selectedIndex]);
  }, [enterPressed]);

  return { selectedIndex, setSelectedIndex };
}
