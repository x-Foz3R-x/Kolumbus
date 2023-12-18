import { useEffect, useState } from "react";
import { KEY } from "@/types";

export default function useKeyPress(targetKey: KEY, block?: boolean) {
  const [keyPressed, setKeyPressed] = useState(false);
  const [event, setEvent] = useState<KeyboardEvent | null>(null);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(true);
        setEvent(event);
        if (block) event.preventDefault();
      }
    };
    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
        setEvent(null);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey, block]);

  return [keyPressed, event] as const;
}
