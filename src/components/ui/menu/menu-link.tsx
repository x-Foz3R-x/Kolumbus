"use client";

import { HTMLAttributeAnchorTarget, memo } from "react";
import Link from "next/link";
import { useFloatingTree, useListItem } from "@floating-ui/react";
import { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useMenuContext } from "./menu-context";
import { OptionVariants } from "../option-variants";

type MenuLinkProps = VariantProps<typeof OptionVariants> & {
  label: string;
  href?: string | null;
  target?: HTMLAttributeAnchorTarget;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  activeClassName?: string;
  children?: React.ReactNode;
};
export const MenuLink = memo(function MenuLink({
  label,
  href,
  target,
  onClick,
  variant,
  size,
  className,
  activeClassName,
  children,
}: MenuLinkProps) {
  const disabled = href ? false : true;

  const menu = useMenuContext();
  const item = useListItem({ label: disabled ? null : label });
  const tree = useFloatingTree();

  const isActive = item.index === menu?.activeIndex;

  if (disabled) return null;

  return (
    <Link
      ref={item.ref}
      role="menuitem"
      href={href ?? ""}
      target={target}
      tabIndex={isActive ? 0 : -1}
      className={cn(OptionVariants({ variant, size }))}
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
    </Link>
  );
});
