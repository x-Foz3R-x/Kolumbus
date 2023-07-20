import Key from "@/config/keys";
import { useEffect } from "react";

const useAccessibilityFeatures = (
  ref: React.MutableRefObject<any>,
  callback: Function
) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === Key.escape) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [ref, callback]);
};

export default useAccessibilityFeatures;
