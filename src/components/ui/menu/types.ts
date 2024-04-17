import type {
  FlipOptions,
  OffsetOptions,
  Placement,
  ShiftOptions,
  SizeOptions,
} from "@floating-ui/react";
import type { TRANSITION } from "~/lib/framer-motion";
import type { ButtonProps } from "../button";

export type MenuProps = {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  placement?: Placement;
  offset?: OffsetOptions | false;
  shift?: ShiftOptions | false;
  flip?: FlipOptions | false;
  size?: SizeOptions | false;
  loop?: boolean;
  animation?: keyof typeof TRANSITION | null;
  zIndex?: number;
  className?: string;
  rootSelector?: string;
  darkMode?: boolean;
  buttonProps?: ButtonProps;
  children?: React.ReactNode;
};
