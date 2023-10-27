import { createPortal } from "react-dom";
import useIsSSR from "@/hooks/use-is-ssr";

export default function Portal({ containerSelector, children }: { containerSelector?: string; children: React.ReactNode }) {
  const isSSR = useIsSSR();

  const portalContainer = !isSSR ? (!containerSelector ? document.body : document.querySelector(containerSelector)) : null;

  return portalContainer ? createPortal(children, portalContainer) : null;
}
