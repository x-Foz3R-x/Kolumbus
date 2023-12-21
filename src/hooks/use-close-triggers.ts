import { useEffect } from "react";

/**
 * Attaches event listeners to detect clicks outside of given elements and pressing the escape key.
 *
 * @param refs - An array of React ref objects that point to the elements to detect clicks outside of.
 * @param callback - A function to be called when detected close interaction.
 */
export default function useCloseTriggers(refs: React.RefObject<HTMLElement>[], callback: Function, block: boolean = false) {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!refs.some((ref) => ref.current && ref.current.contains(event.target as Node))) callback();
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") callback();
    };

    if (!block) document.addEventListener("mouseup", handleOutsideClick);
    if (!block) document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [refs, callback, block]);
}
