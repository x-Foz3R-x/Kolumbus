import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

type Props = {
  selector?: string;
  skipSSRCheck?: boolean;
  children?: React.ReactNode;
};
export default function Portal({ selector, skipSSRCheck, children }: Props) {
  const ref = useRef<Element>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector || "body") || document.body;
    setMounted(true);
  }, [selector]);

  if (skipSSRCheck) return createPortal(children, document.querySelector(selector || "body") || document.body);
  return mounted && ref.current ? createPortal(children, ref.current) : null;
}
