import { forwardRef } from "react";
import { Button, ButtonProps } from "../button";

type Props = ButtonProps & {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setInputType?: React.Dispatch<React.SetStateAction<"keyboard" | "mouse">>;
  id: string;
  "aria-haspopup": boolean | "dialog" | "menu" | "true" | "false" | "grid" | "listbox" | "tree" | undefined;
  "aria-controls": string;
};
export const PopoverTrigger = forwardRef<HTMLButtonElement, Props>(({ isOpen, setOpen, setInputType, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      onClick={(e) => {
        setOpen(!isOpen);
        setInputType?.(e.detail === 0 ? "keyboard" : "mouse");
      }}
      {...(isOpen && { "aria-expanded": true })}
      {...props}
    />
  );
});
PopoverTrigger.displayName = "PopoverTrigger";
