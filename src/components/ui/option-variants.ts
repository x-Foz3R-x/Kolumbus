import { cva } from "class-variance-authority";

export const OptionVariants = cva(
  "group relative z-10 select-none bg-transparent fill-gray-400 tracking-tight text-gray-800 font-medium before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:opacity-0 before:shadow-button before:duration-250 before:ease-kolumb-flow duration-250 ease-kolumb-flow before:focus:scale-100 before:focus:opacity-100 before:focus-visible:scale-100 before:focus-visible:opacity-100 dark:fill-gray-600 dark:text-white",
  {
    variants: {
      variant: {
        default:
          "before:bg-black/5 focus:fill-gray-800 dark:before:bg-white/10 dark:focus:fill-white",
        primary: "before:bg-kolumblue-500 focus:fill-kolumblue-100 focus:text-white",
        danger: "fill-red-500 text-red-600 before:bg-red-200 focus:fill-red-700 focus:text-red-800",
        critical: "fill-red-500 text-red-500 before:bg-red-500 focus:fill-white focus:text-white",
        unset: null,
      },
      size: {
        sm: "text-xs before:rounded",
        md: "text-[13px] before:rounded-md",
        unset: null,
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);
