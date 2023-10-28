import { useRef, useState } from "react";
import { Popover, Container, Placement, Flip, Offset, Prevent } from "./popover";
import { useListNavigation } from "@/hooks/use-accessibility-features";
import { cn } from "@/lib/utils";

type MenuItem = { title: string; description?: string; fn?: () => void };

type MenuProps = {
  buttonRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuList: MenuItem[];
  placement?: Placement;
  container?: Container;
  className?: string;
};
export default function Dropdown({ buttonRef, isOpen, setOpen, menuList, placement = "right-start", container, className }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const [list, setList] = useState<MenuItem[]>(menuList);
  const [selectedIndex, setSelectedIndex] = useListNavigation<MenuItem>(list, isOpen, () => {});

  return (
    <Popover
      tag="ul"
      role="menu"
      aria-orientation="vertical"
      popoverRef={menuRef}
      targetRef={buttonRef}
      isOpen={isOpen}
      setOpen={setOpen}
      placement={placement}
      container={container}
      extensions={[Flip(), Offset(6), Prevent(true)]}
      className={cn("flex flex-col bg-black", className)}
    >
      {menuList.map((item, index) => (
        <li key={`${item.title}`} role="menuitem" onClick={list[index].fn}>
          {item.title}
        </li>
      ))}
    </Popover>
  );
}
