/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Key } from "@/types";
import useKeyPress from "./use-key-press";

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

enum ArrowKey {
  Up = "up",
  Down = "down",
}
export function useArrowNavigation(
  list: {}[],
  enableNavigation: boolean,
  onArrowPress: (item: {}) => void,
  onEnterShow: (show: boolean) => void,
  onEnterSelect: (items: any[], selectedIndex: number) => void
) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const enterPressed = useKeyPress(Key.Enter);
  const arrowUpPressed = useKeyPress(Key.UpArrow);
  const arrowDownPressed = useKeyPress(Key.DownArrow);

  const handleArrowPress = (direction: ArrowKey) => {
    const nextIndex =
      (direction === ArrowKey.Up ? -1 + selectedIndex + list.length : 1 + selectedIndex) % list.length;
    setSelectedIndex(nextIndex);
    onArrowPress(list[nextIndex]);
  };

  useEffect(() => {
    if (!enableNavigation) return;
    if (arrowUpPressed) handleArrowPress(ArrowKey.Up);
    else if (arrowDownPressed) handleArrowPress(ArrowKey.Down);
  }, [arrowUpPressed, arrowDownPressed]);

  useEffect(() => {
    if (!enableNavigation) return;
    if (enterPressed && selectedIndex !== 0) {
      setSelectedIndex(0);
      onEnterSelect(list.slice(1), selectedIndex - 1);
      return;
    }
    onEnterShow(false);
  }, [enterPressed]);

  return { selectedIndex, setSelectedIndex };
}
