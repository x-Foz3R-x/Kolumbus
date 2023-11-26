"use client";

import { createContext, forwardRef, useCallback, useContext, useEffect, useId, useRef } from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";

import { useCloseTriggers, useListNavigation } from "@/hooks/use-accessibility-features";
import { EASING, TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";
import Button from "./button";
import Input from "./input";

//#region ComboboxContext
const ComboboxContext = createContext<{
  isOpen: boolean;
  list: ComboboxList<unknown>;
  listId: string;
  listHeight?: number;
  listItemsRef: React.MutableRefObject<(HTMLButtonElement | HTMLInputElement | null)[]>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  handleClose: () => void;
} | null>(null);
function useComboboxContext() {
  const context = useContext(ComboboxContext);
  if (!context) throw new Error("useCombobox must be used within a ComboboxContext.Provider");
  return context;
}
//#endregion

type ComboboxOption<T> = { index: number; onSelect?: () => void; data: string | T };
export type ComboboxList<T> = ComboboxOption<T>[];

type ComboboxProps<T extends string | number | readonly string[] | undefined> = {
  root: {
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    list: ComboboxList<unknown>;
    listHeight?: number;
    className?: string;
    children: React.ReactNode;
  };
  input: Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
    setValue: React.Dispatch<React.SetStateAction<T>>;
    children?: React.ReactNode;
  };
  list: { className?: string; children: React.ReactNode };
  option: HTMLMotionProps<"li"> & { index: number; className?: string; children: React.ReactNode };
};
const Combobox = {
  Root({ isOpen, setOpen, list, listHeight, className, children }: ComboboxProps<undefined>["root"]) {
    const ref = useRef<HTMLDivElement>(null);
    const listItemsRef = useRef<(HTMLButtonElement | HTMLInputElement)[]>([]);

    const listId = useId();

    const [activeIndex, setActiveIndex] = useListNavigation({
      triggerRef: ref,
      listItemsRef,
      listLength: list.length,
      initialIndex: 0,
      enabled: isOpen,
      useFocus: false,
    });

    const handleClose = useCallback(() => {
      setOpen(false);
      ref.current?.focus({ preventScroll: true });
    }, [ref, setOpen]);

    useEffect(() => {
      setActiveIndex(0);
    }, [list, setActiveIndex]);

    useCloseTriggers([ref], () => setOpen(false));

    const value = { isOpen, list, listId, listHeight, listItemsRef, activeIndex, setActiveIndex, handleClose };
    return (
      <div ref={ref} className={cn("relative", className)} data-open={isOpen}>
        <ComboboxContext.Provider value={value}>{children}</ComboboxContext.Provider>
      </div>
    );
  },

  Input: <T extends string | number | readonly string[] | undefined>({
    value,
    setValue,
    className,
    children,
    ...props
  }: ComboboxProps<T>["input"]) => {
    const { isOpen, listId, listItemsRef } = useComboboxContext();
    const childrenRef = useRef<HTMLSpanElement>(null);

    return (
      <>
        <Input
          ref={(node) => (listItemsRef.current[0] = node)}
          type="text"
          role="combobox"
          name="combobox-input"
          value={value}
          setValue={setValue}
          aria-controls={listId}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          variant="unstyled"
          size="unstyled"
          style={{ paddingRight: childrenRef.current?.offsetWidth ?? 0 }}
          className={cn("bg-transparent px-2 py-1.5", className)}
          {...props}
        />

        <span ref={childrenRef} className="absolute inset-y-0 right-0 z-30 flex items-center">
          {children}
        </span>
      </>
    );
  },

  /**
   * listHeight = listLength * comboboxOptionHeight + padding
   */
  List({ className, children }: ComboboxProps<undefined>["list"]) {
    const { isOpen, listId, listHeight } = useComboboxContext();

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0.3, scaleY: 0.3, scaleX: 0.95, translateY: -32 }}
            animate={{ opacity: 1, scaleY: 1, scaleX: 1, translateY: 0, transition: { duration: 0.25, ease: EASING.kolumbFlow } }}
            exit={{ opacity: 1, scaleY: 0, scaleX: 0.95, translateY: -32, transition: { duration: 0.15, ease: EASING.kolumbOut } }}
            style={{ height: listHeight && `${listHeight}px` }}
            className={cn(
              "absolute -z-10 flex w-full origin-top flex-col rounded-b-lg bg-white p-1.5 pt-2 shadow-border2XL duration-300 ease-kolumb-flow dark:bg-gray-800",
              className,
            )}
          >
            {children}
          </motion.ul>
        )}
      </AnimatePresence>
    );
  },

  Option: forwardRef<HTMLLIElement, ComboboxProps<undefined>["option"]>(function Option({ index, className, children, ...props }, ref) {
    const { list, listItemsRef, activeIndex, setActiveIndex, handleClose } = useComboboxContext();

    const handleClick = () => {
      const onSelect = list[index]?.onSelect;
      if (onSelect) onSelect();

      handleClose();
    };

    return (
      <motion.li
        ref={ref}
        role="menuitem"
        onClick={() => console.log("clicked")}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={TRANSITION.appearInSequence}
        custom={{ index }}
        className="group/option"
        {...props}
      >
        <Button
          ref={(node) => (listItemsRef.current[index] = node)}
          onClick={handleClick}
          onMouseMove={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(0)}
          variant="baseScale"
          size="unstyled"
          className={cn(
            "z-10 w-full cursor-default p-2 text-left text-sm before:bg-gray-100 before:shadow-select before:dark:bg-gray-700",
            className,
            activeIndex === index && "before:scale-100 before:scale-x-100 before:scale-y-100 before:opacity-100",
          )}
          tabIndex={-1}
          animatePress
        >
          <span className={cn("flex items-center gap-4 duration-200 ease-kolumb-overflow", activeIndex === index && "translate-x-1.5")}>
            {children}
          </span>
        </Button>
      </motion.li>
    );
  }),
};

export default Combobox;
