import { Variants } from "framer-motion";

export type Alignment = "start" | "end";
export type Side = "top" | "right" | "bottom" | "left";
export type Placement = Side | `${Side}-${Alignment}`;
export type Axis = "x" | "y";
export type Length = "width" | "height";
export type Coords = { x: number; y: number };
export type PositionCoords = { x: number | string; y: number | string };
export type Rect = { x: number; y: number; width: number; height: number };
export type Inset = { top: number; right: number; bottom: number; left: number };

export type Container = {
  selector: string;
  margin: number | [number, number, number, number];
  padding: number | [number, number, number, number];
};
export type Extensions = (Offset | Flip | Arrow | Backdrop | Motion | Prevent)[] | (Position | Backdrop | Motion | Prevent)[];
export type MountedExtensions = {
  offset?: Offset;
  position?: Position;
  flip?: Flip;
  arrow?: Arrow;
  backdrop?: Backdrop;
  prevent?: Prevent;
};

// Extensions
export type Position = { name: "position"; x: string | number; y: string | number; transformOrigin: string };

export type Flip = { name: "flip" };
export type Offset = { name: "offset"; value: number };
export type Arrow = { name: "arrow"; size: number; className?: { arrow?: string; backdrop?: string } };

export type Backdrop = { name: "backdrop"; type: "opaque" | "opaque-white" | "blur" | "blur-white"; className?: string };
export type Motion = { name: "motion"; transition: Variants | { top: Variants; bottom: Variants; left: Variants; right: Variants } };
export type Prevent = { name: "prevent"; scroll: boolean };
