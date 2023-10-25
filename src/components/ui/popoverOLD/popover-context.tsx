import { createContext, useContext } from "react";
import { Arrow, Container, Modifiers, Placement } from ".";

export const PopoverContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement>;
  popoverRef: React.RefObject<HTMLDivElement>;
  placement: Placement;
  container: Container;
  arrow: Arrow;
  modifiers: Modifiers;
} | null>(null);

export function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("usePopoverContext must be used within a PopoverContext.Provider");
  return context;
}
