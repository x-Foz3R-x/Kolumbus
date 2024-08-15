"use client";

import { memo } from "react";
import { useFloatingTree, useListItem } from "@floating-ui/react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { useMenuContext } from "./menu-context";
import { OptionVariants } from "../option-variants";

type Props = VariantProps<typeof OptionVariants> & {
  label: string;
  shortcut?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  classNames?: { button?: string; active?: string };
  disabled?: boolean;
  children?: React.ReactNode;
};
export const MenuOption = memo(function MenuOption({
  label,
  shortcut,
  onClick,
  variant,
  size,
  className,
  classNames,
  disabled,
  children,
}: Props) {
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
        classNames?.button,
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
          isActive && classNames?.active,
        )}
      >
        {children ?? label}
        {shortcut && <span className="ml-auto text-xs text-gray-400">{shortcut}</span>}
      </div>
    </button>
  );
});
