"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";

type DialogProps = React.HTMLAttributes<HTMLDialogElement> & {
  isDisplayed: boolean;
};
export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(({ isDisplayed, className, children, ...props }, ref) => {
  return (
    <dialog
      ref={ref}
      className={cn(
        "absolute z-20 rounded-xl bg-white shadow-border3XL backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter",
        className
      )}
      {...props}
    >
      {children}
    </dialog>
  );
});

Dialog.displayName = "Dialog";
