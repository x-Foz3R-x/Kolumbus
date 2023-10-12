import { useEffect, useState } from "react";
import { Key } from "@/types";

export default function useKeyPress(targetKey: Key) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => event.key === targetKey && setKeyPressed(true);
    const upHandler = (event: KeyboardEvent) => event.key === targetKey && setKeyPressed(false);

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}
