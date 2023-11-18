import { SetStateAction, createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { VariantProps, cva } from "class-variance-authority";
import { motion } from "framer-motion";

import { Popover, Placement, Flip, Offset, Prevent, Motion, Container } from "./popover";
import { useListNavigation } from "@/hooks/use-accessibility-features";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

import Divider from "./divider";
import Button, { ButtonProps } from "./button";
import Modal, { ModalActionSection } from "./modal";

export type DropdownOption = { index: number; onSelect: () => void; skip?: boolean };
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

const DropdownVariants = cva("flex flex-col", {
  variants: {
    variant: {
      light: "bg-white/80 shadow-border2XL backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter",
      default: "bg-gray-700/80 shadow-border2XL backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter",
      unstyled: "",
    },
    size: {
      sm: "rounded-md p-1",
      default: "rounded-xl p-1",
      lg: "rounded-2xl p-1.5",
      unstyled: "",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
type DropdownProps = VariantProps<typeof DropdownVariants> & {
  isOpen: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  list: DropdownList;
  placement?: Placement;
  container?: Container;
  offset?: number;
  preventScroll?: boolean;
  className?: string;
  buttonProps?: ButtonProps;
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
  variant,
  size,
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
          Prevent({ scroll: preventScroll, autofocus: inputType !== "keyboard" }),
        ]}
      >
        <DropdownContext.Provider value={{ list, listItemsRef, activeIndex, setActiveIndex, handleClose }}>
          <ul
            id={listId}
            role="menu"
            aria-labelledby={buttonRef.current?.id}
            onFocus={() => setFocus("popover")}
            className={cn(DropdownVariants({ variant, size, className }))}
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
      default: "fill-gray-100 text-gray-100 focus:bg-white/20 focus:shadow-select focus:before:hidden",
      blue: "fill-gray-100 text-gray-100 focus:bg-kolumblue-500 focus:shadow-select focus:before:hidden",
      red: "fill-gray-100 text-gray-100 focus:bg-red-500 focus:shadow-select focus:before:hidden",
      unstyled: "",
    },
    size: {
      sm: "gap-2 rounded px-2 py-1 text-xs",
      default: "gap-3 rounded px-3 py-1.5 text-sm",
      unstyled: "",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
type DropdownOptionProps = VariantProps<typeof OptionVariants> & {
  index: number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};
export function DropdownOption({ index, disabled = false, variant, size, className, children }: DropdownOptionProps) {
  const { list, listItemsRef, activeIndex, setActiveIndex, handleClose } = useDropdownContext();

  const handleClick = () => {
    list[index].onSelect();
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
        onClick={!disabled ? handleClick : () => {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        variant="appear"
        size="unstyled"
        className={cn("w-full", OptionVariants({ variant, size, className }), disabled && "opacity-40")}
        tabIndex={activeIndex === index ? 0 : -1}
        disabled={disabled}
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
  const { listItemsRef, activeIndex, setActiveIndex, handleClose } = useDropdownContext();

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
      <Link
        href={href ?? ""}
        target="_blank"
        ref={(node) => (listItemsRef.current[index] = node)}
        onClick={href ? handleClose : () => {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn("w-full", OptionVariants({ variant, size, className }), !href && "pointer-events-none opacity-40")}
        tabIndex={activeIndex === index ? 0 : -1}
      >
        {children}
      </Link>
    </motion.li>
  );
}

type DropdownModalOptionProps = VariantProps<typeof OptionVariants> & {
  index: number;
  disabled?: boolean;
  className?: string;
  buttonChildren?: React.ReactNode;
  children?: React.ReactNode;
};
export function DropdownModalOption({
  index,
  disabled = false,
  variant,
  size,
  className,
  buttonChildren,
  children,
}: DropdownModalOptionProps) {
  const { list, listItemsRef, activeIndex, setActiveIndex, handleClose } = useDropdownContext();

  const [isOpen, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = () => {
    // on mouse move is used because safari has some problems with detecting mouse enter
    setActiveIndex(index);
    if (listItemsRef.current[index]) listItemsRef.current[index]?.focus({ preventScroll: true });
  };
  const handleMouseLeave = () => {
    setActiveIndex(-1);
    if (listItemsRef.current[index]) listItemsRef.current[index]?.blur();
  };

  useEffect(() => {
    // Assign the ref to the list of refs when the component mounts
    listItemsRef.current[index] = buttonRef.current;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.li role="menuitem" initial="initial" animate="animate" exit="exit" className="group/option">
      <Modal
        isOpen={isOpen}
        setOpen={setOpen}
        buttonRef={buttonRef}
        buttonProps={{
          // onClick: !disabled ? () => setOpen(!isOpen) : () => {},
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
          tabIndex: activeIndex === index ? 0 : -1,
          disabled: disabled,
          variant: "appear",
          size: "unstyled",
          className: cn("w-full", OptionVariants({ variant, size, className }), disabled && "opacity-40"),
          children: buttonChildren,
        }}
      >
        {children}
        <ModalActionSection>
          {/* <Button onClick={handleClose} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }} className="px-5">
            Cancel
          </Button> */}
          <Button
            // onClick={() => {
            //   list[index].onSelect();
            //   handleClose();
            // }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            className="whitespace-nowrap bg-kolumblue-500 text-gray-100"
          >
            Delete
          </Button>
        </ModalActionSection>
      </Modal>
    </motion.li>
  );
}
