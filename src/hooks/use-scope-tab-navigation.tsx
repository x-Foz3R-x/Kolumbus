import { useEffect, useState } from "react";
import useKeyPress from "./use-key-press";
import { Key } from "@/types";

/**
 * Custom hook for scoping tab navigation.
 *
 * @param elementRef - The ref object for the element to apply tab navigation to.
 * @param enabled - A boolean indicating whether the tab navigation is enabled.
 */
export default function useScopeTabNavigation(elementRef: React.MutableRefObject<HTMLElement | null>, enabled: boolean) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);

  const [tabPressed, tabEvent] = useKeyPress(Key.Tab);

  // Updates the focusable elements based on the current element ref and enabled state.
  useEffect(() => {
    if (!elementRef.current || !enabled) {
      setFocusableElements([]);
      return;
    }

    const elements = Array.from(
      elementRef.current.querySelectorAll<HTMLElement>("a, area, button, input, object, select, textarea, [tabindex]:not([tabindex='-1'])"),
    );
    setFocusableElements(elements);
  }, [elementRef, enabled]);

  // Handles the tab key press event and prevents the default tab behavior.
  useEffect(() => {
    if (!tabPressed || !enabled || focusableElements.length === 0) return;

    tabEvent?.preventDefault();

    const nextIndex = (tabEvent?.shiftKey ? activeIndex + focusableElements.length - 1 : activeIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
    setActiveIndex(nextIndex);
  }, [tabPressed]); // eslint-disable-line
}
