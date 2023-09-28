import { Key } from "@/types";
import { useEffect, useState } from "react";

export default function useKeyPress(targetKey: string) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === Key.ArrowDown || event.key === Key.ArrowUp) event.preventDefault();

      if (event.key === targetKey) setKeyPressed(true);
    };
    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) setKeyPressed(false);
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}
