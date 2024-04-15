export * from "./db";
export * from "./google";
export * from "./library";
export * from "./appdata";

export type SvgProps = React.SVGAttributes<HTMLOrSVGElement>;

export enum LANGUAGES {
  English = "en",
  Polish = "pl",
}

export enum USER_ROLES {
  Admin = "ADMIN",
  Tester = "TESTER",
  FleetCommander = "FLEET_COMMANDER",
  Captain = "CAPTAIN",
  Navigator = "NAVIGATOR",
  Explorer = "EXPLORER",
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
