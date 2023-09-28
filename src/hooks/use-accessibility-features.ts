/* eslint-disable */

import { useEffect, useState } from "react";
import useKeyPress from "./use-key-press";
import { Key } from "@/types";

export const useAnyCloseActions = (ref: React.MutableRefObject<any>, callback: Function) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) callback();
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === Key.Escape) callback();
    };

    const handleScroll = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target)) callback();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [ref, callback]);
};

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

  const handleArrowPress = (direction: Key.ArrowUp | Key.ArrowDown) => {
    const nextIndex =
      (direction === Key.ArrowUp ? -1 + selectedIndex + list.length : 1 + selectedIndex) % list.length;
    setSelectedIndex(nextIndex);
    onArrowPressCallback(list[nextIndex]);
  };

  const handleCursor = () => {
    document.body.style.cursor = "";
  };

  useEffect(() => {
    if (!isNavigationEnabled) return;
    if (arrowUpPressed) handleArrowPress(Key.ArrowUp);
    else if (arrowDownPressed) handleArrowPress(Key.ArrowDown);

    document.body.style.cursor = "none";
    document.addEventListener("mousemove", handleCursor);
    return () => document.removeEventListener("mousemove", handleCursor);
  }, [arrowUpPressed, arrowDownPressed]);

  useEffect(() => {
    if (!isNavigationEnabled) return;
    if (enterPressed) onEnterSelectCallback(list[selectedIndex]);
  }, [enterPressed]);

  return { selectedIndex, setSelectedIndex };
}
