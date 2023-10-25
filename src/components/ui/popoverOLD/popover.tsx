import { Children, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Arrow, Container, Modifiers, Placement } from ".";
import { PopoverContext } from "./popover-context";
import Portal from "@/components/portal";

type PopoverProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placement?: Placement;
  container?: Container;
  arrow?: Arrow;
  modifiers?: {
    backdrop?: "transparent" | "opaque" | "blur";
    offset?: number;
    preventFlip?: boolean;
    preventOutsideFocus?: boolean;
    preventOverflow?: boolean;
    preventScroll?: boolean;
  };
  children: React.ReactNode;
};
export default function Popover({
  isOpen,
  setIsOpen,
  placement = "bottom",
  container = { selector: "body", margin: 0, padding: 8 },
  arrow = { enabled: false },
  modifiers,
  children,
}: PopoverProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  //#region Setting default props
  (modifiers as Modifiers) = {
    backdrop: modifiers?.backdrop ?? "transparent",
    offset: modifiers?.offset ?? 8,
    preventFlip: modifiers?.preventFlip ?? false,
    preventOutsideFocus: modifiers?.preventOutsideFocus ?? true,
    preventScroll: modifiers?.preventScroll ?? false,
  };
  (modifiers as Modifiers).offset += arrow.enabled ? arrow.size / 2 : 0;
  //#endregion

  useEffect(() => {
    const bodyElements = Array.from(document.body.children);

    if (isOpen) {
      bodyElements.forEach((element) => element !== popoverRef.current && element.setAttribute("aria-hidden", "true"));

      if ((modifiers as Modifiers).preventOutsideFocus) {
        Array.from(document.querySelectorAll("input, textarea, button, select, a"))
          .filter((element) => !popoverRef.current?.contains(element))
          .forEach((element) => element.setAttribute("tabindex", "-1"));
      }
    } else {
      bodyElements.forEach((element) => element.removeAttribute("aria-hidden"));
      triggerRef.current?.focus();

      if ((modifiers as Modifiers).preventOutsideFocus) {
        Array.from(document.querySelectorAll("input, textarea, button, select, a"))
          .filter((element) => !popoverRef.current?.contains(element))
          .forEach((element) => element.removeAttribute("tabindex"));
      }
    }
  }, [isOpen]); // eslint-disable-line

  const [trigger, content] = Children.toArray(children);
  const popover = <Portal containerSelector={(container as Container).selector}>{content}</Portal>;
  const context = {
    isOpen,
    setIsOpen,
    popoverRef,
    triggerRef,
    placement,
    container,
    arrow,
    modifiers: modifiers as Modifiers,
  };

  return (
    <PopoverContext.Provider value={context}>
      {trigger}
      <AnimatePresence>{isOpen ? popover : null}</AnimatePresence>
    </PopoverContext.Provider>
  );
}
