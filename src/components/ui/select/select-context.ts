import { createContext, useContext } from "react";
import type { useInteractions } from "@floating-ui/react";

type SelectContext = {
  activeIndex: number | null;
  selectedIndex: number | null;
  getItemProps: ReturnType<typeof useInteractions>["getItemProps"];
  handleSelect: (index: number | null) => void;
};
export const SelectContext = createContext<SelectContext | null>(null);
export function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) throw new Error("Option components must be wrapped in <Select />");
  return context;
}
