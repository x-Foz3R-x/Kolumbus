import { useFloating, useInteractions } from "@floating-ui/react";
import { createContext, useContext } from "react";

type ModalContext = ReturnType<typeof useFloating> &
  ReturnType<typeof useInteractions> & {
    open: boolean;
    setOpen: (open: boolean) => void;
    setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
  };
export const ModalContext = createContext<ModalContext | null>(null);
export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModalContext must be used within the <Modal />");
  return context;
}
