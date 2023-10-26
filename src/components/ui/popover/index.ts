import { Arrow, Offset, Prevent, Flip, Position, Backdrop, Coords } from "./types";

export { Popover } from "./popover";

export function Offset(value: number): Offset {
  return { name: "offset", value };
}
export function Position(x: string | number, y: string | number, transformOrigin: string): Position {
  return { name: "position", x, y, transformOrigin };
}
export function Flip(): Flip {
  return { name: "flip" };
}
export function Arrow(value: number, className: { arrow: string; backdrop: string }): Arrow {
  return { name: "arrow", size: value, className };
}
export function Backdrop(type: "opaque" | "blur", className: string): Backdrop {
  return { name: "backdrop", type, className };
}
export function Prevent(scroll: boolean): Prevent {
  return { name: "prevent", scroll };
}
