import { useEffect } from "react";

/**
 * Custom hook that attaches event listeners to close triggers and invokes a callback when necessary.
 *
 * @param refs - An array of React ref objects representing the elements that act as close triggers.
 * @param callback - The function to be called when a close trigger event occurs.
 * @param block - Optional boolean flag indicating whether the event listeners should be blocked.
 * @returns A cleanup function to remove the event listeners.
 */
export default function useCloseTriggers(refs: React.RefObject<HTMLElement>[], callback: Function, block: boolean = false) {
  useEffect(() => {
    let insideOrigin = false;

    const handleOriginClick = (event: MouseEvent) => {
      if (refs.some((ref) => ref.current && ref.current.contains(event.target as Node))) insideOrigin = true;
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (!insideOrigin && !refs.some((ref) => ref.current && ref.current.contains(event.target as Node))) callback();
      insideOrigin = false;
    };

    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") callback();
    };

    if (!block) {
      document.addEventListener("mousedown", handleOriginClick);
      document.addEventListener("mouseup", handleOutsideClick);
      document.addEventListener("keydown", handleEscapeKeyPress);
    }

    return () => {
      document.removeEventListener("mousedown", handleOriginClick);
      document.removeEventListener("mouseup", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [refs, callback, block]);
}
