export * from "./appdata";
export * from "./google";

export type SvgProps = React.SVGAttributes<HTMLOrSVGElement>;

export enum Language {
  English = "en",
  Polish = "pl",
}

export enum UserRole {
  ADMIN = "ADMIN",
  TESTER = "TESTER",
  PREMIUM = "PREMIUM",
  USER = "USER",
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
  Space = "Space",
  End = "End",
  Home = "Home",
  ArrowLeft = "ArrowLeft",
  ArrowUp = "ArrowUp",
  ArrowRight = "ArrowRight",
  ArrowDown = "ArrowDown",
  Insert = "Insert",
  Delete = "Delete",
}
