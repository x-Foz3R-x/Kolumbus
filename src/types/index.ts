export * from "./appdata";
export * from "./google";

export type SvgProps = React.SVGAttributes<HTMLOrSVGElement>;

export enum LANGUAGE {
  English = "en",
  Polish = "pl",
}

export enum USER_ROLE {
  Admin = "ADMIN",
  Tester = "TESTER",
  Premium = "PREMIUM",
  User = "USER",
}

export enum KEY {
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
