"use client";

import { FloatingTree, useFloatingParentNodeId } from "@floating-ui/react";
import { memo } from "react";
import { MenuComponent } from "./menu-component";
import { MenuProps } from "./types";

export const Menu = memo(function Menu(props: MenuProps) {
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <MenuComponent {...props} />
      </FloatingTree>
    );
  }

  return <MenuComponent {...props} />;
});
