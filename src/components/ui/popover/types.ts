import { Variants } from "framer-motion";

export type Side = "top" | "right" | "bottom" | "left";
export type Alignment = "start" | "end";
export type Placement = Side | `${Side}-${Alignment}`;
export type Axis = "x" | "y";
export type Length = "width" | "height";
export type Coords = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };
export type Inset = { top: number; right: number; bottom: number; left: number };

export type Strategy = "absolute" | "fixed";
export type Container = { selector: string; padding?: number | [number, number, number, number] };
export type Extensions = (Flip | Offset | Arrow | Backdrop | Motion | Prevent)[] | (Position | Backdrop | Motion | Prevent)[];
export type MountedExtensions = {
  position?: Position;

  flip?: Flip;
  arrow?: Arrow;
  offset?: Offset;

  backdrop?: Backdrop;
  motion?: Motion;
  prevent?: Prevent;
};

// Extensions
export type Position = { name: "position"; x: string | number; y: string | number; transformOrigin: string };

export type Flip = { name: "flip" };
export type Offset = { name: "offset"; value: number | { mainAxis?: number; crossAxis?: number } };
export type Arrow = { name: "arrow"; size: number; className?: { arrow?: string; backdrop?: string } };

export type Backdrop = { name: "backdrop"; type: BackdropType; className?: string };
export type Motion = { name: "motion"; transition: Variants | { top: Variants; bottom: Variants; left: Variants; right: Variants } };
export type Prevent = {
  name: "prevent";
  autofocus?: boolean;
  closeTriggers?: boolean;
  hide?: boolean;
  pointer?: boolean;
  scroll?: boolean;
};

export type BackdropType = "opaque" | "opaque-white" | "blur" | "blur-white";
