export * from "./db";

export type UserRoles =
  | "explorer"
  | "navigator"
  | "captain"
  | "fleetCommander"
  | "tester"
  | "admin";

export enum LANGUAGES {
  English = "en",
  Polish = "pl",
}

export enum KEYS {
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
