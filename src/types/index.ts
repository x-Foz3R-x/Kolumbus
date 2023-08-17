export * from "./app-data";
export * from "./actions";
export * from "./google";

export interface SvgProps extends React.SVGAttributes<HTMLOrSVGElement> {}

export enum Language {
  English = "en",
  Polish = "pl",
}

export enum Key {
  Backspace = "Backspace",
  Tab = "Tab",
  Enter = "Enter",
  Shift = "Shift",
  Ctrl_Control = "Control",
  Alt_Option = "Alt",
  CapsLock = "CapsLock",
  Escape = "Escape",
  Space = "",
  End = "End",
  Home = "Home",
  LeftArrow = "ArrowLeft",
  UpArrow = "ArrowUp",
  RightArrow = "ArrowRight",
  DownArrow = "ArrowDown",
  Insert = "Insert",
  Delete = "Delete",
}
