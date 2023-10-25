import Popover from "./popover";
import PopoverTrigger from "./popover-trigger";
import PopoverContent from "./popover-content";

// export components
export { Popover, PopoverTrigger, PopoverContent };

export type Placement =
  | "top"
  | "bottom"
  | "right"
  | "left"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end";
export type Container = {
  selector: string;
  margin: number | [number, number, number, number];
  padding: number | [number, number, number, number];
};
export type Arrow = { enabled: true; size: number } | { enabled: false };
export type Modifiers = {
  backdrop: "transparent" | "opaque" | "blur";
  offset: number;
  preventFlip: boolean;
  preventOutsideFocus: boolean;
  preventScroll: boolean;
};
