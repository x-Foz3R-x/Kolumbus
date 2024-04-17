import { useCallback, useLayoutEffect, useRef, useState } from "react";

type Overflow = { top: boolean; bottom: boolean; left: boolean; right: boolean };

export function useOverflowObserver(ref: React.MutableRefObject<HTMLElement | null>, disable?: boolean): Overflow {
  const [overflow, setOverflow] = useState<Overflow>({ top: false, bottom: false, left: false, right: false });
  const overflowRef = useRef(overflow);

  const checkOverflow = useCallback(() => {
    if (!ref.current) return;

    const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = ref.current;

    const overflowTop = scrollTop > 0;
    const overflowBottom = scrollTop < scrollHeight - clientHeight;
    const overflowLeft = scrollLeft > 0;
    const overflowRight = scrollLeft < scrollWidth - clientWidth;

    if (
      overflowTop !== overflowRef.current.top ||
      overflowBottom !== overflowRef.current.bottom ||
      overflowRight !== overflowRef.current.right ||
      overflowLeft !== overflowRef.current.left
    ) {
      const newOverflow = { top: overflowTop, bottom: overflowBottom, left: overflowLeft, right: overflowRight };
      setOverflow(newOverflow);
      overflowRef.current = newOverflow;
    }
  }, [ref]);

  useLayoutEffect(() => {
    if (disable) return;

    requestAnimationFrame(() => {
      checkOverflow();

      const element = ref.current;
      if (!element) return;

      element.addEventListener("scroll", checkOverflow);
      window.addEventListener("resize", checkOverflow);

      return () => {
        element.removeEventListener("scroll", checkOverflow);
        window.removeEventListener("resize", checkOverflow);
      };
    });
  }, [ref, disable, checkOverflow]);

  return overflow;
}
