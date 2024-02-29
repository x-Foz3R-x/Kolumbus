import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

type Props = {
  root?: string | Element | null;
  skipSSRCheck?: boolean;
  children?: React.ReactNode;
};
export default function Portal({ root, skipSSRCheck, children }: Props) {
  const ref = useRef<Element>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof root === "string") ref.current = document.querySelector(root) ?? document.body;
    else if (root instanceof Element) ref.current = root;
    else ref.current = document.body;
    setMounted(true);
  }, [root]);

  if (skipSSRCheck) {
    if (typeof root === "string") return createPortal(children, document.querySelector(root) ?? document.body);
    else if (root instanceof Element) return createPortal(children, root);
    else return createPortal(children, document.body);
  }
  return mounted && ref.current ? createPortal(children, ref.current) : null;
}
