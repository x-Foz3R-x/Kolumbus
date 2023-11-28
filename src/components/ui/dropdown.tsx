import { SetStateAction, createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { VariantProps, cva } from "class-variance-authority";
import { motion } from "framer-motion";

import { Popover, Placement, Flip, Offset, Prevent, Motion, Container, Position, Strategy } from "./popover";
import useListNavigation from "@/hooks/use-list-navigation";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

import Divider from "./divider";
import Button, { Props } from "./button";

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

type DropdownOption = { index: number; onSelect?: () => void; skip?: boolean };
export type DropdownList = DropdownOption[];

type DropdownProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  list: DropdownList;
  placement?: Placement;
  strategy?: Strategy;
  container?: Container;
  position?: { x: string | number; y: string | number; transformOrigin?: string };
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
  strategy = "absolute",
  container,
  position,
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
    initialIndex: inputType === "keyboard" ? 0 : -1,
    skipIndexes,
    placement: dropdownRef.current?.getAttribute("data-placement") as Placement,
    enabled: isOpen,
    preventLoop: true,
    preventArrowDefault: { v: true, h: true },
  });

  const baseExtensions = [Motion(TRANSITION.fadeInScale), Prevent({ autofocus: inputType !== "keyboard", scroll: preventScroll })];
  const extensions = position
    ? [Position(position.x, position.y, position.transformOrigin), ...baseExtensions]
    : [Flip(), Offset(offset), ...baseExtensions];

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
    <>
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
        strategy={strategy}
        container={container}
        extensions={extensions}
      >
        <DropdownContext.Provider value={{ list, listItemsRef, activeIndex, setActiveIndex, handleClose }}>
          <ul
            id={listId}
            role="menu"
            aria-labelledby={buttonRef.current?.id}
            onFocus={() => setFocus("popover")}
            className={cn("flex flex-col rounded-lg bg-white p-1 shadow-border2XL dark:bg-gray-600 dark:shadow-border2XLDark", className)}
          >
            {children}
          </ul>
        </DropdownContext.Provider>
      </Popover>
    </>
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

// const OptionVariants = cva(
//   "z-10 flex w-full cursor-default items-center fill-tintedGray-400 text-left text-gray-900 focus:shadow-select focus-visible:shadow-select dark:fill-gray-400 dark:text-gray-100",
//   {
//     variants: {
//       variant: {
//         default: "focus:bg-black/5 focus:fill-tintedGray-700 dark:focus:bg-white/10 dark:focus:fill-gray-100",
//         primary: "focus:bg-kolumblue-500 focus:fill-kolumblue-100 focus:text-kolumblue-100",
//         danger: "fill-red-500 text-red-500 focus:bg-red-500 focus:fill-red-100 focus:text-red-100",
//         unstyled: "",
//       },
//       size: {
//         sm: "gap-2 rounded px-2 py-1 text-xs",
//         default: "gap-3 rounded-[5px] px-3 py-1.5 text-sm",
//         unstyled: "",
//       },
//     },
//     defaultVariants: { variant: "default", size: "default" },
//   },
// );
const OptionWrapperVariants = cva(
  "relative z-10 bg-transparent before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:opacity-0 before:shadow-select before:duration-300 before:ease-kolumb-flow focus-within:before:scale-100 focus-within:before:scale-x-100 focus-within:before:scale-y-100 focus-within:before:opacity-100",
  {
    variants: {
      variant: {
        default: "before:bg-black/5 dark:before:bg-white/10",
        primary: "before:bg-kolumblue-500",
        danger: "before:bg-red-500",
        unstyled: "",
      },
      size: {
        sm: "before:rounded",
        default: "before:rounded-[5px]",
        unstyled: "",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
const OptionVariants = cva("fill-tintedGray-400 text-left text-gray-900 dark:fill-gray-400 dark:text-gray-100", {
  variants: {
    variant: {
      default: "focus:fill-tintedGray-700 dark:focus:fill-gray-100",
      primary: "focus:fill-kolumblue-100 focus:text-kolumblue-100",
      danger: "fill-red-500 text-red-500 focus:fill-red-100 focus:text-red-100",
      unstyled: "",
    },
    size: {
      sm: "gap-2 px-2 py-1 text-xs",
      default: "gap-3 px-3 py-1.5 text-sm",
      unstyled: "",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
type DropdownOptionProps = VariantProps<typeof OptionVariants> &
  VariantProps<typeof OptionWrapperVariants> & {
    index: number;
    className?: string;
    wrapperClassName?: string;
    children?: React.ReactNode;
  };
export function DropdownOption({ index, variant, size, className, wrapperClassName, children }: DropdownOptionProps) {
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
    <motion.li
      role="menuitem"
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(OptionWrapperVariants({ variant, size }), list[index].skip && "pointer-events-none opacity-40", wrapperClassName)}
    >
      <Button
        ref={(node) => (listItemsRef.current[index] = node)}
        onClick={!list[index]?.skip ? handleClick : () => {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        variant="unstyled"
        size="unstyled"
        className={cn(
          "flex w-full cursor-default items-center duration-300 ease-kolumb-overflow hover:translate-x-1.5",
          OptionVariants({ variant, size, className }),
        )}
        tabIndex={activeIndex === index ? 0 : -1}
        disabled={list[index].skip}
      >
        {children}
      </Button>
    </motion.li>
  );
}

type DropdownLinkProps = VariantProps<typeof OptionVariants> &
  VariantProps<typeof OptionWrapperVariants> & {
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
    <motion.li
      role="menuitem"
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(OptionWrapperVariants({ variant, size, className }), disabled && "pointer-events-none opacity-40")}
    >
      <Link
        href={href ?? ""}
        target="_blank"
        ref={(node) => (listItemsRef.current[index] = node)}
        onClick={!disabled ? handleClose : () => {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "flex w-full cursor-default items-center duration-300 ease-kolumb-overflow hover:translate-x-1.5",
          OptionVariants({ variant, size, className }),
        )}
        tabIndex={activeIndex === index ? 0 : -1}
      >
        {children}
      </Link>
    </motion.li>
  );
}
