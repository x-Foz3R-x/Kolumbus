import { cva } from "class-variance-authority";

export const OptionVariants = cva(
  "group relative z-10 select-none bg-transparent fill-gray-400 tracking-tight text-gray-900 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:opacity-0 before:shadow-select before:duration-250 before:ease-kolumb-flow before:focus:scale-100 before:focus:opacity-100 before:focus-visible:scale-100 before:focus-visible:opacity-100 dark:fill-gray-600 dark:text-white",
  {
    variants: {
      variant: {
        default: "before:bg-black/5 focus:fill-gray-900 dark:before:bg-white/10 dark:focus:fill-white",
        primary: "before:bg-kolumblue-500 focus:fill-kolumblue-100 focus:text-white",
        danger: "fill-red-500 text-red-500 before:bg-red-500 focus:fill-white focus:text-white",
        unset: null,
      },
      size: {
        sm: "text-xs before:rounded",
        md: "text-sm before:rounded-md",
        unset: null,
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);
