"use client";

import { createContext, useContext } from "react";

type MenuContext = {
  isOpen: boolean;
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
};
export const MenuContext = createContext<MenuContext | null>(null);
export function useMenuContext() {
  return useContext(MenuContext);
}
