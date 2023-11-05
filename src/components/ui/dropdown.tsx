import { SetStateAction, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { motion } from "framer-motion";
import cuid2 from "@paralleldrive/cuid2";

import { Popover, Placement, Flip, Offset, Prevent, Motion, Container } from "./popover";
import { useListNavigation } from "@/hooks/use-accessibility-features";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

export type DropdownOption = { onSelect: () => void; index: number };
export type DropdownList = DropdownOption[];

// Style variants
const ButtonVariants = cva("group", {
  variants: {
    buttonVariant: {
      default: "rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-gray-100 focus-visible:shadow-focus",
      unstyled: "",
    },
  },
  defaultVariants: { buttonVariant: "default" },
});
const DropdownVariants = cva("group/dropdown flex flex-col shadow-borderXL backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter", {
  variants: {
    dropdownVariant: {
      default: "rounded-xl bg-gray-700/80 p-1.5 text-gray-100",
      unstyled: "",
    },
  },
  defaultVariants: { dropdownVariant: "default" },
});
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
      default: "gap-3 rounded px-3 py-1.5 text-sm group-first/dropdown:rounded-t-xl group-last/dropdown:rounded-b-xl",
    },
  },
  defaultVariants: { optionVariant: "default", optionSize: "default" },
});

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
export default function Dropdown({
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
  const [activationType, setActivationType] = useState<"mouse" | "keyboard">("mouse");
  const [activeIndex, setActiveIndex] = useListNavigation({
    hasFocus,
    setFocus,
    triggerRef: buttonRef,
    listItemsRef,
    listLength: list.length,
    initialIndex: activationType === "keyboard" ? 0 : -1,
    placement: dropdownRef.current?.getAttribute("data-placement") as Placement,
    enabled: isOpen,
    loop: false,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpen(!isOpen);
    setActivationType(e.detail === 0 ? "keyboard" : "mouse");
  };
  const handleClose = useCallback(() => {
    setOpen(false), [setOpen];
    buttonRef.current?.focus({ preventScroll: true });
  }, [buttonRef, setOpen]);

  useEffect(() => {
    isOpen && setActiveIndex(activationType === "keyboard" ? 0 : -1);
  }, [isOpen, activationType, setActiveIndex]);

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
          Prevent({ scroll: preventScroll, autofocus: activationType !== "keyboard" }),
          Motion(TRANSITION.fadeInScale),
        ]}
      >
        <ul
          id={dropdownId.current}
          role="menu"
          aria-labelledby={buttonRef.current?.id}
          onFocus={() => setFocus("popover")}
          className={cn(DropdownVariants({ dropdownVariant, className: className?.dropdown }))}
        >
          <DropdownContext.Provider value={{ list, listItemsRef, activeIndex, setActiveIndex, handleClose }}>
            {children}
          </DropdownContext.Provider>
        </ul>
      </Popover>
    </div>
  );
}

type DropdownGroupProps = {
  title: string;
  className?: string;
  children?: React.ReactNode;
};
export function DropdownGroup({ title, className, children }: DropdownGroupProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="px-1 text-xs text-gray-300">{title}</span>
      <ul className={`${className}`}>{children}</ul>
    </div>
  );
}

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
      className="overflow-hidden bg-black"
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
