import { createContext, useContext } from "react";
import type { useFloating, useInteractions } from "@floating-ui/react";

type FloatingContext = ReturnType<typeof useFloating> &
  ReturnType<typeof useInteractions> & { open: boolean; setOpen: (open: boolean) => void };
export const FloatingContext = createContext<FloatingContext | null>(null);
export const useFloatingContext = () => {
  const context = useContext(FloatingContext);
  if (context == null) throw new Error("Floating components must be wrapped in <Floating />");
  return context;
};
