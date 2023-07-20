/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import useKeyPress from "./use-key-press";
import Key from "@/config/keys";

export default function useArrowNavigation(
  selectList: { value: string }[],
  selectedIndex: number,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  onEnter: Function
) {
  const enterPressed = useKeyPress(Key.enter);
  const arrowUpPressed = useKeyPress(Key.upArrow);
  const arrowDownPressed = useKeyPress(Key.downArrow);

  const handleArrowPress = (direction: "up" | "down") => {
    const nextIndex =
      (direction === "up"
        ? -1 + selectedIndex + selectList.length
        : 1 + selectedIndex) % selectList.length;
    setSelectedIndex(nextIndex);
    setValue(selectList[nextIndex].value);
  };

  useEffect(() => {
    if (arrowUpPressed) handleArrowPress("up");
    else if (arrowDownPressed) handleArrowPress("down");
  }, [arrowUpPressed, arrowDownPressed]);

  useEffect(() => {
    if (enterPressed) onEnter(selectList[selectedIndex].value);
  }, [enterPressed]);
}
