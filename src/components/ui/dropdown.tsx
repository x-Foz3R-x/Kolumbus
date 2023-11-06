import { SetStateAction, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { motion } from "framer-motion";
import cuid2 from "@paralleldrive/cuid2";

import { Popover, Placement, Flip, Offset, Prevent, Motion, Container } from "./popover";
import { useListNavigation } from "@/hooks/use-accessibility-features";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";
import Divider from "./divider";

export type DropdownOption = { onSelect: () => void; index: number };
export type DropdownList = DropdownOption[];

//#region Context
const DropdownContext = createContext<{
  list: DropdownList;
  listItemsRef: React.MutableRefObject<(HTMLButtonElement | HTMLLIElement | null)[]>;
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

const ButtonVariants = cva("group", {
  variants: {
    buttonVariant: {
      default: "rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-gray-100 focus-visible:shadow-focus",
      unstyled: "",
    },
  },
  defaultVariants: { buttonVariant: "default" },
});
const DropdownVariants = cva("flex flex-col shadow-borderXL backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter", {
  variants: {
    dropdownVariant: {
      default: "rounded-xl bg-gray-700/80 p-1.5 text-gray-100",
      unstyled: "",
    },
  },
  defaultVariants: { dropdownVariant: "default" },
});
type MenuProps = VariantProps<typeof DropdownVariants> &
  VariantProps<typeof ButtonVariants> & {
    isOpen: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    list: DropdownList;
    placement?: Placement;
    container?: Container;
    offset?: number;
    preventScroll?: boolean;
    className?: { container?: string; button?: string; dropdown?: string; option?: string };
    buttonChildren?: React.ReactNode;
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
  dropdownVariant,
  buttonVariant,
  className,
  buttonChildren,
  children,
}: MenuProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listItemsRef = useRef<HTMLButtonElement[]>([]);

  const buttonId = useRef(`dropdown-button-${cuid2.init({ length: 3 })()}`);
  const dropdownId = useRef(`dropdown-${cuid2.init({ length: 3 })()}`);

  const [hasFocus, setFocus] = useState<false | "trigger" | "popover">(false);
  const [inputType, setInputType] = useState<"mouse" | "keyboard">("mouse");
  const [activeIndex, setActiveIndex] = useListNavigation({
    hasFocus,
    setFocus,
    triggerRef: buttonRef,
    listItemsRef,
    listLength: list.length,
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
    setOpen(false), [setOpen];
    buttonRef.current?.focus({ preventScroll: true });
  }, [buttonRef, setOpen]);

  useEffect(() => {
    isOpen && setActiveIndex(inputType === "keyboard" ? 0 : -1);
  }, [isOpen, inputType, setActiveIndex]);

  useEffect(() => {
    if (hasFocus === false) setOpen(false);
  }, [hasFocus, setOpen]);

  return (
    <div className={cn("relative", className?.container)}>
      <motion.button
        ref={buttonRef}
        id={buttonId.current}
        onClick={handleClick}
        onFocus={() => setFocus("trigger")}
        className={cn(ButtonVariants({ buttonVariant, className: className?.button }))}
        aria-haspopup="menu"
        aria-controls={dropdownRef.current?.id}
        {...(isOpen && { "aria-expanded": true })}
      >
        {buttonChildren}
      </motion.button>

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
          Prevent({ scroll: preventScroll, autofocus: inputType !== "keyboard" }),
          Motion(TRANSITION.fadeInScale),
        ]}
      >
        <DropdownContext.Provider value={{ list, listItemsRef, activeIndex, setActiveIndex, handleClose }}>
          <ul
            id={dropdownId.current}
            role="menu"
            aria-labelledby={buttonRef.current?.id}
            onFocus={() => setFocus("popover")}
            className={cn(DropdownVariants({ dropdownVariant, className: className?.dropdown }))}
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

const OptionVariants = cva("z-10 flex w-full cursor-default items-center text-left duration-200 ease-kolumb-flow", {
  variants: {
    optionVariant: {
      default: "fill-gray-100 text-gray-100 focus:bg-white/20 focus:shadow-select",
      danger: "fill-gray-100 text-gray-100 focus:bg-red-500 focus:shadow-select",
      blue: "fill-gray-100 text-gray-100 focus:bg-kolumblue-500 focus:shadow-select",
      unstyled: "",
    },
    optionSize: {
      small: "gap-2 rounded px-2 py-1 text-xs",
      default: "gap-3 rounded px-3 py-1.5 text-sm group-first/option:rounded-t-lg group-last/option:rounded-b-lg",
    },
  },
  defaultVariants: { optionVariant: "default", optionSize: "default" },
});
type DropdownOptionProps = VariantProps<typeof OptionVariants> & {
  index: number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};
export function DropdownOption({ index, disabled = false, optionVariant, optionSize, className, children }: DropdownOptionProps) {
  const { list, listItemsRef, activeIndex, setActiveIndex, handleClose } = useDropdownContext();

  const handleClick = () => {
    list[index].onSelect();
    handleClose();
  };
  const handleMouseEnter = () => {
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
      variants={TRANSITION.appearInSequence}
      custom={{ index }}
      className="group/option"
    >
      <button
        ref={(node) => (listItemsRef.current[index] = node)}
        onClick={!disabled ? handleClick : () => {}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(OptionVariants({ optionVariant, optionSize, className }), disabled && "opacity-50")}
        tabIndex={activeIndex === index ? 0 : -1}
        disabled={disabled}
      >
        {children}
      </button>
    </motion.li>
  );
}
