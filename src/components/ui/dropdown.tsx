import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { motion } from "framer-motion";
import cuid2 from "@paralleldrive/cuid2";

import { Popover, Placement, Flip, Offset, Prevent, Motion } from "./popover";
import { useDropdownNavigation } from "@/hooks/use-accessibility-features";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

export type DropdownOption = { onSelect: () => void; index: number };
export type DropdownList = DropdownOption[];

// Style variants
const DropdownVariants = cva("flex flex-col shadow-borderXL backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter ", {
  variants: {
    variant: {
      default: "text-gray-100 bg-gray-700/80 rounded-md p-1.5 gap-1",
      unstyled: "",
    },
  },
  defaultVariants: { variant: "default" },
});
const OptionVariants = cva("flex w-full items-center z-10 cursor-default text-left whitespace-nowrap", {
  variants: {
    optionVariant: {
      default:
        "gap-2 rounded fill-gray-100 pl-3 pr-10 py-1.5 text-sm text-gray-100 duration-200 ease-kolumb-flow focus:bg-white/20 focus:shadow-select",
      danger:
        "gap-2 rounded fill-gray-100 pl-3 pr-10 py-1.5 text-sm text-gray-100 duration-200 ease-kolumb-flow focus:bg-red-500 focus:shadow-select",
      blue: "gap-2 rounded fill-gray-100 pl-3 pr-10 py-1.5 text-sm text-gray-100 duration-200 ease-kolumb-flow focus:bg-kolumblue-500 focus:shadow-select",
      unstyled: "",
    },
  },
  defaultVariants: { optionVariant: "default" },
});

//#region Context
const DropdownContext = createContext<{
  dropdownList: DropdownList;
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

type MenuProps = VariantProps<typeof DropdownVariants> & {
  list: DropdownList;
  placement?: Placement;
  margin?: number | [number, number, number, number];
  padding?: number | [number, number, number, number];
  offset?: number;
  preventScroll?: boolean;
  className?: { dropdown?: string; button?: string; option?: string };
  buttonChildren?: React.ReactNode;
  children?: React.ReactNode;
};
export default function Dropdown({
  list,
  placement = "right-start",
  margin = 0,
  padding = 0,
  offset = 6,
  preventScroll = false,
  variant,
  className,
  buttonChildren,
  children,
}: MenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listItemsRef = useRef<HTMLButtonElement[]>([]);

  const containerId = useRef(`dropdown-container-${cuid2.init({ length: 3 })()}`);
  const buttonId = useRef(`dropdown-button-${cuid2.init({ length: 3 })()}`);
  const dropdownId = useRef(`dropdown-${cuid2.init({ length: 3 })()}`);

  const [isOpen, setOpen] = useState(false);
  const [hasFocus, setFocus] = useState<false | "button" | "dropdown">(false);
  const [activationType, setActivationType] = useState<"mouse" | "keyboard">("mouse");
  const [activeIndex, setActiveIndex] = useDropdownNavigation({
    list,
    listItemsRef,
    placement: dropdownRef.current?.getAttribute("data-placement") as Placement,
    initialIndex: activationType === "keyboard" ? 0 : -1,
    enabled: isOpen,
    loop: false,
    hasFocus,
    setFocus,
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
  }, [hasFocus]);

  // todo - add printable character navigation (e.g. type "a" to select the first option that starts with "a")

  return (
    <div ref={containerRef} id={containerId.current} className="relative">
      <motion.button
        ref={buttonRef}
        id={buttonId.current}
        onClick={handleClick}
        onFocus={() => setFocus("button")}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-gray-100 focus-visible:shadow-focus",
          className?.button
        )}
        aria-haspopup="menu"
        aria-controls={dropdownRef.current?.id}
        {...(isOpen && { "aria-expanded": true })}
      >
        {buttonChildren}
      </motion.button>

      <Popover
        popoverRef={dropdownRef}
        targetRef={buttonRef}
        isOpen={isOpen}
        setOpen={setOpen}
        placement={placement}
        container={{ selector: `#${containerRef.current?.id}`, margin, padding }}
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
          onFocus={() => setFocus("dropdown")}
          className={cn(DropdownVariants({ variant, className: className?.dropdown }))}
        >
          <DropdownContext.Provider value={{ dropdownList: list, listItemsRef, activeIndex, setActiveIndex, handleClose }}>
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
  className?: string;
  children?: React.ReactNode;
};
export function DropdownOption({ index, optionVariant, className, children }: DropdownOptionProps) {
  const { dropdownList, listItemsRef, activeIndex, setActiveIndex, handleClose } = useDropdownContext();

  const handleClick = () => {
    dropdownList[index].onSelect();
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
    <motion.li role="menuitem" initial="initial" animate="animate" exit="exit" variants={TRANSITION.appearInSequence} custom={{ index }}>
      <button
        ref={(node) => (listItemsRef.current[index] = node)}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(OptionVariants({ optionVariant, className }))}
        tabIndex={activeIndex === index ? 0 : -1}
      >
        {children}
      </button>
    </motion.li>
  );
}
