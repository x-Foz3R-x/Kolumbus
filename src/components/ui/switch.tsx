"use client";

import { cn } from "~/lib/utils";
import { Button } from "./button";
import { Spinner } from "./spinner";
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
  loading?: boolean;
  disabled?: boolean;
};
export default function Switch(props: SwitchProps) {
  const disabled = props.loading ?? props.disabled;

  return (
    <Button
      variant="unset"
      size="unset"
      onClick={() => !disabled && props.onChange(!props.checked)}
      className={cn(
        "relative h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent shadow-sm duration-150 ease-kolumb-flow",
        props.checked ? "bg-kolumblue-500" : "bg-gray-200",
        disabled && "pointer-events-none cursor-default opacity-50",
      )}
    >
      <span
        className={cn(
          "absolute inset-y-0 aspect-square  h-4 w-4 rounded-full bg-white duration-150 ease-kolumb-flow",
          props.checked ? "left-4" : "left-0",
        )}
      >
        {props.loading && <Spinner.resize className="h-4 w-4 stroke-kolumblue-500" />}
      </span>
    </Button>
  );
}
