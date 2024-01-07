import {
  HTMLAttributeAnchorTarget,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { VariantProps, cva } from "class-variance-authority";
import { Variants, motion } from "framer-motion";
import Link from "next/link";

import { Popover, Placement, Flip, Offset, Prevent, Motion, Container, Strategy } from "./popover";
import useListNavigation from "@/hooks/use-list-navigation";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

import { Divider, Button, ButtonProps } from "./";
import { PopoverTrigger } from "./popover/popover-trigger";

//#region Context
const DropdownContext = createContext<{
  skipIndexes?: number[];
  listItemsRef: React.MutableRefObject<(HTMLButtonElement | HTMLAnchorElement | HTMLLIElement | null)[]>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  handleClose: () => void;
} | null>(null);
function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("useDropdownContext must be used within a DropdownContext.Provider");
  return context;
}
//#endregion

type Props = {
  isOpen: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  listLength: number;
  skipIndexes?: number[];
  placement?: Placement;
  strategy?: Strategy;
  container?: Container;
  offset?: number | { mainAxis?: number; crossAxis?: number };
  motion?: Variants | { top: Variants; right: Variants; bottom: Variants; left: Variants };
  preventFlip?: boolean;
  preventScroll?: boolean;
  dark?: boolean;
  className?: string;
  buttonProps?: ButtonProps;
  children?: React.ReactNode;
};
export function Dropdown({
  isOpen,
  setOpen,
  listLength,
  skipIndexes,
  placement = "right-start",
  strategy = "absolute",
  container,
  offset = 6,
  motion = TRANSITION.fadeInScale,
  preventFlip = false,
  preventScroll = false,
  dark = false,
  className,
  buttonProps,
  children,
}: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listItemsRef = useRef<HTMLButtonElement[]>([]);

  const buttonId = useId();
  const listId = useId();

  const [inputType, setInputType] = useState<"mouse" | "keyboard">("mouse");
  const [activeIndex, setActiveIndex, setFocus] = useListNavigation({
    isOpen,
    setOpen,
    triggerRef: buttonRef,
    listItemsRef,
    listLength,
    skipIndexes,
    selectFirstIndex: inputType === "keyboard",
    preventLoop: true,
    preventArrowDefault: { v: true, h: true },
  });

  const handleClose = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  }, [buttonRef, setOpen]);

  return (
    <>
      <PopoverTrigger
        ref={buttonRef}
        id={buttonId}
        isOpen={isOpen}
        setOpen={setOpen}
        setInputType={setInputType}
        onFocus={() => setFocus("trigger")}
        aria-haspopup="menu"
        aria-controls={listId}
        {...(isOpen && { "aria-expanded": true })}
        {...buttonProps}
      />

      <Popover
        popoverRef={useRef(null)}
        triggerRef={buttonRef}
        isOpen={isOpen}
        setOpen={setOpen}
        placement={placement}
        strategy={strategy}
        container={container}
        extensions={[
          ...(!preventFlip ? [Flip()] : []),
          Offset(offset),
          Motion(motion),
          Prevent({ autofocus: inputType !== "keyboard", scroll: preventScroll }),
        ]}
        className={dark ? "dark" : ""}
      >
        <DropdownContext.Provider value={{ skipIndexes, listItemsRef, activeIndex, setActiveIndex, handleClose }}>
          <ul
            id={listId}
            role="menu"
            aria-labelledby={buttonRef.current?.id}
            onFocus={() => setFocus("popover")}
            className={cn(
              "flex flex-col rounded-xl bg-white p-1.5 shadow-border2XL dark:bg-gray-900 dark:text-gray-100 dark:shadow-border2XLDark",
              className,
            )}
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
      <div className={cn("cursor-default select-none px-1 pt-1 text-xs font-medium text-gray-500", className)}>{title}</div>
    </div>
  );
}

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
        default: "before:rounded-md",
        unstyled: "",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
const OptionVariants = cva("fill-gray-400 text-left font-medium tracking-tight text-gray-650 dark:fill-gray-600 dark:text-gray-300", {
  variants: {
    variant: {
      default: "focus:fill-gray-700 dark:focus:fill-gray-300",
      primary: "focus:fill-kolumblue-100 focus:text-kolumblue-100",
      danger: "fill-red-500 text-red-500 focus:fill-red-100 focus:text-red-100",
      unstyled: "",
    },
    size: {
      sm: "h-6 gap-2 px-2 text-xs",
      default: "h-[34px] gap-4 px-3 text-sm",
      unstyled: "",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
type DropdownOptionProps = VariantProps<typeof OptionVariants> &
  VariantProps<typeof OptionWrapperVariants> & {
    index: number;
    onClick?: () => void;
    className?: string;
    wrapperClassName?: string;
    children?: React.ReactNode;
  };
export function DropdownOption({ index, onClick, variant, size, className, wrapperClassName, children }: DropdownOptionProps) {
  const { skipIndexes, listItemsRef, activeIndex, setActiveIndex, handleClose } = useDropdownContext();

  const handleClick = () => {
    onClick?.();
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
      className={cn(
        OptionWrapperVariants({ variant, size }),
        skipIndexes?.includes(index) && "pointer-events-none opacity-50",
        wrapperClassName,
      )}
    >
      <Button
        ref={(node) => (listItemsRef.current[index] = node)}
        onClick={!skipIndexes?.includes(index) ? handleClick : () => {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        variant="unstyled"
        size="unstyled"
        className={cn(
          "flex w-full cursor-default items-center duration-300 ease-kolumb-overflow hover:translate-x-1.5",
          OptionVariants({ variant, size, className }),
        )}
        tabIndex={activeIndex === index ? 0 : -1}
        disabled={skipIndexes?.includes(index)}
      >
        {children}
      </Button>
    </motion.li>
  );
}

type DropdownLinkProps = VariantProps<typeof OptionVariants> &
  VariantProps<typeof OptionWrapperVariants> & {
    index: number;
    href?: string;
    target?: HTMLAttributeAnchorTarget;
    className?: string;
    wrapperClassName?: string;
    children?: React.ReactNode;
  };
export function DropdownLink({ index, href, target, variant, size, className, wrapperClassName, children }: DropdownLinkProps) {
  const { skipIndexes, listItemsRef, activeIndex, setActiveIndex, handleClose } = useDropdownContext();

  const handleMouseMove = () => {
    // on mouse move is used because safari has some problems with detecting mouse enter
    setActiveIndex(index);
    if (listItemsRef.current[index]) listItemsRef.current[index]?.focus({ preventScroll: true });
  };
  const handleMouseLeave = () => {
    setActiveIndex(-1);
    if (listItemsRef.current[index]) listItemsRef.current[index]?.blur();
  };

  const disabled = href === undefined || skipIndexes?.includes(index) ? true : false;

  return (
    <motion.li
      role="menuitem"
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(OptionWrapperVariants({ variant, size, className: wrapperClassName }), disabled && "pointer-events-none opacity-50")}
    >
      <Link
        href={href ?? ""}
        target={target}
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
