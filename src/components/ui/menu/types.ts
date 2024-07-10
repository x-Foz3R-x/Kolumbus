import type { Variants } from "framer-motion";
import type {
  FlipOptions,
  OffsetOptions,
  Placement,
  ShiftOptions,
  SizeOptions,
} from "@floating-ui/react";
import type { TRANSITION } from "~/lib/motion";
import type { ButtonProps } from "../button";

export type MenuProps = {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  placement?: Placement;
  offset?: OffsetOptions | false;
  shift?: ShiftOptions | false;
  flip?: FlipOptions | false;
  size?: SizeOptions | false;
  scrollItemIntoView?: ScrollIntoViewOptions;
  loop?: boolean;
  animation?: keyof typeof TRANSITION | null;
  customAnimation?: Variants;
  zIndex?: number;
  className?: string;
  rootSelector?: string;
  darkMode?: boolean;
  buttonProps?: ButtonProps;
  children?: React.ReactNode;
};
