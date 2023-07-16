import { useEffect } from "react";
import Key from "@/config/keys";

export default function useKeyboardNavigation(
  itemsRef: React.RefObject<HTMLButtonElement | HTMLInputElement>[]
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === Key.arrowDown || event.key === Key.arrowUp) {
        event.preventDefault();

        const currentIndex = itemsRef.findIndex(
          (ref: any) => ref === document.activeElement
        );
        console.log(currentIndex);

        if (currentIndex > -1) {
          const direction = event.key === "ArrowDown" ? 1 : -1;
          const nextIndex =
            (currentIndex + direction + itemsRef.length) % itemsRef.length;

          itemsRef[nextIndex]?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [itemsRef]);
}
