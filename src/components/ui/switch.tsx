"use client";

import { cn } from "~/lib/utils";
import { Button } from "./button";
// import { cva } from "class-variance-authority";

// const switchVariants = cva(
//   "relative h-6 w-11 rounded-full border-2 border-transparent duration-250 ease-kolumb-flow",
//   {
//     variants: {
//       variant: {
//         default: "shadow-border focus:shadow-focus",
//         unset: null,
//       },
//       size: {
//         default: "h-6 w-11",
//         sm: "h-6 w-11",
//         unset: null,
//       },
//     },
//     defaultVariants: { variant: "default", size: "default" },
//   },
// );

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};
export default function Switch(props: SwitchProps) {
  return (
    <Button
      variant="unset"
      size="unset"
      onClick={() => props.onChange(!props.checked)}
      className={cn(
        "relative h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent shadow-sm duration-150 ease-kolumb-flow",
        props.checked ? "bg-kolumblue-500" : "bg-gray-200",
      )}
    >
      <span
        className={cn(
          "absolute inset-y-0 aspect-square rounded-full bg-white duration-150 ease-kolumb-flow",
          props.checked ? "left-4" : "left-0",
        )}
      />
    </Button>
  );
}
