import { memo, useCallback, useEffect, useState } from "react";
import { useListItem } from "@floating-ui/react";
import type { VariantProps } from "class-variance-authority";
import { useSelectContext } from "./select-context";
import { OptionVariants } from "../option-variants";
import { cn } from "~/lib/utils";

type SelectOptionProps = VariantProps<typeof OptionVariants> & {
  label: string;
  onClick?: () => void;
  onHover?: (isHovered: boolean) => void;
  className?: { base?: string; active?: string; selected?: string };
  children?: React.ReactNode;
};
export const SelectOption = memo(function SelectOption({
  label,
  onClick,
  onHover,
  variant,
  size,
  className,
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

  const handleMouseEnter = useCallback(() => {
    onHover?.(true);
  }, [onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover?.(false);
  }, [onHover]);

  const [node, setNode] = useState<HTMLElement | null>(null);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      item.ref(node);
      setNode(node);
    },
    [item],
  );

  useEffect(() => {
    if (isSelected && node) {
      setTimeout(() => {
        node.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
    }
  }, [isSelected, node]);

  return (
    <button
      ref={ref}
      role="option"
      tabIndex={isActive ? 0 : -1}
      aria-selected={isActive && isSelected}
      className={cn(OptionVariants({ variant, size }))}
      {...getItemProps({
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
      data-selected={isSelected}
    >
      <div
        className={cn(
          "flex h-[34px] w-full cursor-default select-none items-center gap-4 px-3 duration-200 ease-kolumb-overflow group-focus:translate-x-1.5",
          className?.base,
          isActive && className?.active,
          isSelected && className?.selected,
        )}
      >
        {children ?? label}
      </div>
    </button>
  );
});
