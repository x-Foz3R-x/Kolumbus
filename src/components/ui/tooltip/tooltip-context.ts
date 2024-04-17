import { createContext, useContext } from "react";
import type { useFloating, useInteractions } from "@floating-ui/react";

type TooltipContext = ReturnType<typeof useFloating> &
  ReturnType<typeof useInteractions> & {
    open: boolean;
    setOpen: (open: boolean) => void;
    arrowRef: React.RefObject<SVGSVGElement>;
  };
export const TooltipContext = createContext<TooltipContext | null>(null);
export const useTooltipContext = () => {
  const context = useContext(TooltipContext);
  if (context == null) throw new Error("Tooltip components must be wrapped in <Tooltip />");
  return context;
};
