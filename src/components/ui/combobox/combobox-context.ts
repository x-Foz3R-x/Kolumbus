import { createContext, useContext } from "react";
import type { useFloating, useInteractions } from "@floating-ui/react";

type ComboboxContext = ReturnType<typeof useFloating> &
  ReturnType<typeof useInteractions> & {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    activeIndex: number | null;
    setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
    activeItemRef: React.MutableRefObject<unknown>;
    list: { value: string; [data: string]: unknown }[];
    listRef: React.RefObject<Array<HTMLLIElement | null>>;
  };
export const ComboboxContext = createContext<ComboboxContext | null>(null);
export const useComboboxContext = () => {
  const context = useContext(ComboboxContext);
  if (context == null) throw new Error("Combobox components must be wrapped in <Combobox.Root />");
  return context;
};
