import { cva } from "class-variance-authority";

export { Button } from "./button";
export type { ButtonProps } from "./button";

export const ButtonVariants = cva("group peer select-none text-gray-900 outline-0 dark:text-white", {
  variants: {
    variant: {
      default: "bg-gray-100 shadow-button focus-visible:shadow-focus",
      appear: "bg-transparent duration-300 ease-kolumb-flow focus-visible:shadow-focus",
      baseScale:
        "relative z-10 bg-transparent before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:opacity-0 before:shadow-button before:duration-250 before:ease-kolumb-flow",
      scale:
        "relative z-10 bg-transparent before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:opacity-0 before:shadow-button before:duration-250 before:ease-kolumb-flow before:hover:scale-100 before:hover:opacity-100 before:focus-visible:scale-100 before:focus-visible:opacity-100",
      button:
        "rounded-xl border-b-[3px] border-gray-200 bg-gray-100 shadow-button duration-200 ease-kolumb-flow focus-visible:shadow-focus active:translate-y-0.5 active:border-b",
      disabled: "pointer-events-none opacity-40 focus-visible:shadow-focus",
      unset: null,
    },
    size: {
      default: "rounded-lg px-3 py-1.5 text-sm before:rounded-lg",
      sm: "rounded-md px-2.5 py-1 text-xs before:rounded-md",
      lg: "rounded-xl px-4 py-2 text-base before:rounded-xl",
      icon: "aspect-square rounded-lg p-1.5 text-base before:rounded-lg",
      unset: null,
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
