import { SetStateAction, createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { VariantProps, cva } from "class-variance-authority";
import { motion } from "framer-motion";

import { Popover, Placement, Flip, Offset, Prevent, Motion, Container } from "./popover";
import { useListNavigation } from "@/hooks/use-accessibility-features";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

import Divider from "./divider";
import Button, { Props } from "./button";

type DropdownOption = { index: number; onSelect?: () => void; skip?: boolean };
export type DropdownList = DropdownOption[];

//#region Context
const DropdownContext = createContext<{
  list: DropdownList;
  listItemsRef: React.MutableRefObject<(HTMLButtonElement | HTMLAnchorElement | HTMLLIElement | null)[]>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  handleClose: () => void;
} | null>(null);
export function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("useDropdownContext must be used within a DropdownContext.Provider");
  return context;
}
//#endregion

type DropdownProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  list: DropdownList;
  placement?: Placement;
  container?: Container;
  offset?: number;
  preventScroll?: boolean;
  className?: string;
  buttonProps?: Props;
  children?: React.ReactNode;
};
export function Dropdown({
  isOpen,
  setOpen,
  list,
  placement = "right-start",
  container = { selector: "body", margin: 0, padding: 0 },
  offset = 6,
  preventScroll = false,
  className,
  buttonProps,
  children,
}: DropdownProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listItemsRef = useRef<HTMLButtonElement[]>([]);

  const buttonId = useId();
  const listId = useId();

  const [hasFocus, setFocus] = useState<false | "trigger" | "popover">(false);
  const [inputType, setInputType] = useState<"mouse" | "keyboard">("mouse");
  const [skipIndexes, setSkipIndexes] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useListNavigation({
    hasFocus,
    setFocus,
    triggerRef: buttonRef,
    listItemsRef,
    listLength: list.length,
    skipIndexes,
    initialIndex: inputType === "keyboard" ? 0 : -1,
    placement: dropdownRef.current?.getAttribute("data-placement") as Placement,
    enabled: isOpen,
    loop: false,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpen(!isOpen);
    setInputType(e.detail === 0 ? "keyboard" : "mouse");
  };
  const handleClose = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  }, [buttonRef, setOpen]);

  useEffect(() => {
    isOpen && setActiveIndex(inputType === "keyboard" ? 0 : -1);
  }, [isOpen, inputType, setActiveIndex]);

  useEffect(() => {
    !hasFocus && setOpen(false);
  }, [hasFocus, setOpen]);

  useEffect(() => {
    // Find indexes with skip value as true
    setSkipIndexes(list.map((item, index) => (item.skip === true ? index : undefined)).filter((index) => index !== undefined) as number[]);
  }, [list]);

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        id={buttonId}
        onClick={handleClick}
        onFocus={() => setFocus("trigger")}
        aria-haspopup="menu"
        aria-controls={listId}
        {...(isOpen && { "aria-expanded": true })}
        {...buttonProps}
      />

      <Popover
        popoverRef={dropdownRef}
        triggerRef={buttonRef}
        isOpen={isOpen}
        setOpen={setOpen}
        placement={placement}
        container={container}
        extensions={[
          Flip(),
          Offset(offset),
          Motion(TRANSITION.fadeInScale),
          Prevent({ autofocus: inputType !== "keyboard", scroll: preventScroll }),
        ]}
      >
        <DropdownContext.Provider value={{ list, listItemsRef, activeIndex, setActiveIndex, handleClose }}>
          <ul
            id={listId}
            role="menu"
            aria-labelledby={buttonRef.current?.id}
            onFocus={() => setFocus("popover")}
            className={cn(
              "flex flex-col rounded-lg bg-gray-700/80 p-1 shadow-border2XL backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter",
              className,
            )}
          >
            {children}
          </ul>
        </DropdownContext.Provider>
      </Popover>
    </div>
  );
}

type DropdownGroupTitleProps = {
  title: string;
  divider?: boolean;
  className?: string;
};
export function DropdownGroupTitle({ title, divider = false, className }: DropdownGroupTitleProps) {
  return (
    <div className="pb-0.5">
      {divider && <Divider className="mt-1 bg-white/25" />}
      <div className={cn("px-1 pt-1 text-xs text-gray-300", className)}>{title}</div>
    </div>
  );
}

const OptionVariants = cva("z-10 flex w-full cursor-default items-center text-left focus-visible:shadow-none", {
  variants: {
    variant: {
      default: "fill-gray-100 text-gray-100 focus:bg-white/20 focus:shadow-select",
      primary: "fill-gray-100 text-gray-100 focus:bg-kolumblue-500 focus:shadow-select",
      danger: "fill-gray-100 text-gray-100 focus:bg-red-500 focus:shadow-select",
      unstyled: "",
    },
    size: {
      sm: "gap-2 rounded px-2 py-1 text-xs",
      default: "gap-3 rounded-[5px] px-3 py-1.5 text-sm",
      unstyled: "",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
type DropdownOptionProps = VariantProps<typeof OptionVariants> & {
  index: number;
  className?: string;
  children?: React.ReactNode;
};
export function DropdownOption({ index, variant, size, className, children }: DropdownOptionProps) {
  const { list, listItemsRef, activeIndex, setActiveIndex, handleClose } = useDropdownContext();

  const handleClick = () => {
    const onSelect = list[index]?.onSelect;
    if (onSelect) onSelect();

    handleClose();
  };
  const handleMouseMove = () => {
    // on mouse move is used because safari has some problems with detecting mouse enter
    setActiveIndex(index);
    if (listItemsRef.current[index]) listItemsRef.current[index]?.focus({ preventScroll: true });
  };
  const handleMouseLeave = () => {
    setActiveIndex(-1);
    if (listItemsRef.current[index]) listItemsRef.current[index]?.blur();
  };

  return (
    <motion.li role="menuitem" initial="initial" animate="animate" exit="exit" className="group/option">
      <Button
        ref={(node) => (listItemsRef.current[index] = node)}
        onClick={!list[index].skip ? handleClick : () => {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        variant="appear"
        size="unstyled"
        className={cn("w-full", OptionVariants({ variant, size, className }), list[index].skip && "opacity-40")}
        tabIndex={activeIndex === index ? 0 : -1}
        disabled={list[index].skip}
      >
        {children}
      </Button>
    </motion.li>
  );
}

type DropdownLinkProps = VariantProps<typeof OptionVariants> & {
  index: number;
  href?: string | null;
  className?: string;
  children?: React.ReactNode;
};
export function DropdownLink({ index, href, variant, size, className, children }: DropdownLinkProps) {
  const { list, listItemsRef, activeIndex, setActiveIndex, handleClose } = useDropdownContext();

  const handleMouseMove = () => {
    // on mouse move is used because safari has some problems with detecting mouse enter
    setActiveIndex(index);
    if (listItemsRef.current[index]) listItemsRef.current[index]?.focus({ preventScroll: true });
  };
  const handleMouseLeave = () => {
    setActiveIndex(-1);
    if (listItemsRef.current[index]) listItemsRef.current[index]?.blur();
  };

  const disabled = href === null || list[index].skip ? true : false;

  return (
    <motion.li role="menuitem" initial="initial" animate="animate" exit="exit" className="group/option">
      <Link
        href={href ?? ""}
        target="_blank"
        ref={(node) => (listItemsRef.current[index] = node)}
        onClick={!disabled ? handleClose : () => {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn("w-full", OptionVariants({ variant, size, className }), disabled && "pointer-events-none opacity-40")}
        tabIndex={activeIndex === index ? 0 : -1}
      >
        {children}
      </Link>
    </motion.li>
  );
}
