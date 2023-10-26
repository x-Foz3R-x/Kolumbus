export type Alignment = "start" | "end";
export type Side = "top" | "right" | "bottom" | "left";
export type AlignedPlacement = `${Side}-${Alignment}`;
export type Placement = Side | AlignedPlacement;
export type Axis = "x" | "y";
export type Length = "width" | "height";
export type Coords = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };
export type Inset = { top: number; right: number; bottom: number; left: number };

export type Dimensions = {
  top: number;
  bottom: number;
  left: number;
  right: number;

  documentTop: number;
  documentBottom: number;
  documentLeft: number;
  documentRight: number;

  width: number;
  height: number;
  totalWidth: number;
  totalHeight: number;
};

export type PopoverData = {
  coords: { x: number; y: number };
  arrowCoords: { x: number; y: number };
  maxWidth?: number;
  maxHeight?: number;
  transformOrigin?: string;
  isPositioned?: boolean;
};
export type Container = {
  selector: string;
  margin: number | [number, number, number, number];
  padding: number | [number, number, number, number];
};
export type Extensions = (Offset | Position | Flip | Arrow | Backdrop | Prevent)[];
export type MountedExtensions = {
  offset?: Offset;
  position?: Position;
  flip?: Flip;
  arrow?: Arrow;
  backdrop?: Backdrop;
  prevent?: Prevent;
};

//#region extensions
export type Offset = { name: "offset"; value: number };
export type Position = {
  name: "position";
  position: { top?: number; bottom?: number; left?: number; right?: number };
  transformOrigin: string;
};
export type Flip = { name: "flip" };
export type Arrow = { name: "arrow"; size: number; className?: { arrow?: string; backdrop?: string } };
export type Backdrop = { name: "backdrop"; type: "opaque" | "blur"; className?: string };
export type Prevent = { name: "prevent"; scroll: boolean };
//#endregion
