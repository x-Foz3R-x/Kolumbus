import { memo, useCallback } from "react";
import { useListItem } from "@floating-ui/react";
import { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useSelectContext } from "./select-context";
import { OptionVariants } from "../option-variants";

type SelectOptionProps = VariantProps<typeof OptionVariants> & {
  label: string;
  onClick?: () => void;
  className?: string;
  activeClassName?: string;
  selectedClassName?: string;
  children?: React.ReactNode;
};
export const SelectOption = memo(function SelectOption({
  onClick,
  label,
  variant,
  size,
  className,
  activeClassName,
  selectedClassName,
  children,
}: SelectOptionProps) {
  const { activeIndex, selectedIndex, getItemProps, handleSelect } = useSelectContext();
  const item = useListItem({ label });

  const isActive = activeIndex === item.index;
  const isSelected = selectedIndex === item.index;

  const handleClick = useCallback(() => {
    onClick?.();
    handleSelect(item.index);
  }, [onClick, handleSelect, item.index]);

  return (
    <button
      ref={item.ref}
      role="option"
      tabIndex={isActive ? 0 : -1}
      aria-selected={isActive && isSelected}
      className={cn(OptionVariants({ variant, size }))}
      {...getItemProps({ onClick: handleClick })}
    >
      <div
        className={cn(
          "flex h-[34px] w-full cursor-default select-none items-center gap-4 px-3 duration-200 ease-kolumb-overflow group-focus:translate-x-1.5",
          className,
          isActive && activeClassName,
          isSelected && selectedClassName,
        )}
      >
        {children ?? label}
      </div>
    </button>
  );
});
