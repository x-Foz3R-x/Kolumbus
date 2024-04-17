"use client";

import { memo } from "react";
import { useFloatingTree, useListItem } from "@floating-ui/react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { useMenuContext } from "./menu-context";
import { OptionVariants } from "../option-variants";

type MenuOptionProps = VariantProps<typeof OptionVariants> & {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  activeClassName?: string;
  disabled?: boolean;
  children?: React.ReactNode;
};
export const MenuOption = memo(function MenuOption({
  label,
  onClick,
  variant,
  size,
  className,
  activeClassName,
  disabled,
  children,
}: MenuOptionProps) {
  const menu = useMenuContext();
  const item = useListItem({ label: disabled ? null : label });
  const tree = useFloatingTree();

  const isActive = item.index === menu?.activeIndex;

  return (
    <button
      ref={item.ref}
      role="menuitem"
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={cn(
        OptionVariants({ variant, size }),
        "disabled:pointer-events-none disabled:opacity-40 disabled:grayscale-[0.4]",
      )}
      {...menu?.getItemProps({
        onClick(e: React.MouseEvent<HTMLButtonElement>) {
          onClick?.(e);
          tree?.events.emit("click");
        },
      })}
    >
      <div
        className={cn(
          "pointer-events-none flex h-[34px] w-full cursor-default select-none items-center gap-4 px-3 duration-200 ease-kolumb-overflow group-focus:translate-x-1.5",
          className,
          isActive && activeClassName,
        )}
      >
        {children ?? label}
      </div>
    </button>
  );
});
