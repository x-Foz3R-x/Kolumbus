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

    const handleOriginClick = (e: MouseEvent) => {
      if (refs.some((ref) => ref.current && ref.current.contains(e.target as Node))) insideOrigin = true;
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (!insideOrigin && !refs.some((ref) => ref.current && ref.current.contains(e.target as Node))) callback();
      insideOrigin = false;
    };

    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") callback();
    };

    if (!block) {
      document.body.addEventListener("mousedown", handleOriginClick);
      document.body.addEventListener("mouseup", handleOutsideClick);
      document.body.addEventListener("keydown", handleEscapeKeyPress);
    }

    return () => {
      document.body.removeEventListener("mousedown", handleOriginClick);
      document.body.removeEventListener("mouseup", handleOutsideClick);
      document.body.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [refs, callback, block]);
}
