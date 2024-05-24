"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type AnimationProps } from "framer-motion";
import {
  FloatingFocusManager,
  autoUpdate,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from "@floating-ui/react";
import { z } from "zod";

import { EASING, TRANSITION } from "~/lib/motion";
import { cn } from "~/lib/utils";
import { KEYS } from "~/types";

import { ButtonVariants, Input } from "../";
import { ComboboxContext, useComboboxContext } from "./combobox-context";

type ComboboxProps = {
  root: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    activeItemRef: React.MutableRefObject<unknown>;
    list: { value: string; [data: string]: unknown }[];
    scrollItemIntoView?: ScrollIntoViewOptions;
    className?: string;
    children?: React.ReactNode;
  };
  input: {
    placeholder?: string;
    childrenWidth?: number;
    onChange?: (value: string) => void | Promise<void>;
    onEnterPress?: (activeIndex: number | null) => void;
    style?: React.CSSProperties;
    className?: string;
    containerProps?: { style?: React.CSSProperties; className?: string } & Omit<
      AnimationProps,
      "variants"
    >;
    children?: React.ReactNode;
  } & AnimationProps;
  list: {
    width?: { initial: number; target: number };
    height?: { option: number; padding: number; min: number };
    className?: string;
    children?: React.ReactNode;
  };
  option: { index: number; className?: string; children?: React.ReactNode };
};
export const Combobox = {
  Root({
    open,
    setOpen,
    inputValue,
    setInputValue,
    activeItemRef,
    list,
    scrollItemIntoView = { behavior: "smooth", block: "nearest", inline: "nearest" },
    className,
    children,
  }: ComboboxProps["root"]) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const listRef = useRef<Array<HTMLLIElement | null>>([]);

    //#region Floating UI
    const data = useFloating<HTMLInputElement>({
      whileElementsMounted: autoUpdate,
      open,
      onOpenChange: setOpen,
    });

    const role = useRole(data.context, { role: "listbox" });
    const dismiss = useDismiss(data.context);
    const listNavigation = useListNavigation(data.context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      scrollItemIntoView,
      virtual: true,
      loop: true,
      allowEscape: true,
    });

    const interactions = useInteractions([role, dismiss, listNavigation]);
    //#endregion

    const contextValue = useMemo(
      () => ({
        open,
        setOpen,
        inputValue,
        setInputValue,
        activeIndex,
        setActiveIndex,
        activeItemRef,
        list,
        listRef,
        ...interactions,
        ...data,
      }),
      [
        open,
        setOpen,
        inputValue,
        setInputValue,
        activeIndex,
        setActiveIndex,
        activeItemRef,
        list,
        listRef,
        interactions,
        data,
      ],
    );

    return (
      <ComboboxContext.Provider value={contextValue}>
        <motion.div className={cn("relative font-inter font-normal antialiased", className)}>
          {children}
        </motion.div>
      </ComboboxContext.Provider>
    );
  },

  Input({
    placeholder,
    onChange,
    onEnterPress,
    containerProps,
    className,
    children,
    ...animateProps
  }: ComboboxProps["input"]) {
    const combobox = useComboboxContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      combobox.activeItemRef.current = null;

      const value = z.string().default("").parse(e.target.value);
      combobox.setInputValue(value);

      if (value) {
        combobox.setActiveIndex(null);
        combobox.setOpen(true);
        void onChange?.(value);
      } else combobox.setOpen(false);
    };

    const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === (KEYS.Enter as string)) {
        if (combobox.activeIndex !== null) {
          const selectedListItem = combobox.list[combobox.activeIndex];
          if (selectedListItem !== undefined) {
            combobox.activeItemRef.current = combobox.list[combobox.activeIndex];
            combobox.setInputValue(selectedListItem.value);
            combobox.setActiveIndex(null);
            combobox.setOpen(false);
          }
        }

        onEnterPress?.(combobox.activeIndex);
      }
    };

    //#region Transition timeout
    const [initialTransition, setInitialTransition] = useState(true);
    useEffect(() => {
      const timer = setTimeout(() => setInitialTransition(false), 600);
      return () => clearTimeout(timer);
    }, []);
    //#endregion

    return (
      <motion.div
        ref={combobox.refs.setReference}
        style={containerProps?.style}
        className={cn(
          "relative z-10 flex h-full items-center bg-white fill-gray-400 text-sm dark:bg-gray-800 dark:fill-gray-600",
          containerProps?.className,
        )}
        initial={containerProps?.initial}
        animate={{
          transition: initialTransition
            ? containerProps?.transition
            : combobox.open
              ? { ease: EASING.kolumbFlow, duration: 0.4 }
              : { ease: EASING.kolumbOut, duration: 0.3 },
          ...(typeof containerProps?.animate === "object" ? containerProps.animate : {}),
        }}
        exit={containerProps?.exit}
        transition={containerProps?.transition}
      >
        <Input
          variant="unset"
          size="unset"
          className={{ input: cn("bg-transparent py-1", className) }}
          {...animateProps}
          {...combobox.getReferenceProps({
            id: useId(),
            value: combobox.inputValue,
            placeholder,
            onChange: handleChange,
            onKeyDown: handleEnterPress,
            autoComplete: "off",
            autoCorrect: "off",
          })}
        />

        <span className="absolute inset-y-0 right-0 flex h-full items-center">{children}</span>
      </motion.div>
    );
  },

  List({
    width = { initial: 0, target: 0 },
    height = { option: 0, padding: 0, min: 0 },
    className,
    children,
  }: ComboboxProps["list"]) {
    const combobox = useComboboxContext();

    const animateHeight = useMemo(
      () =>
        combobox.list.length === 0
          ? `${height.min}px`
          : `${combobox.list.length * height.option + height.padding}px`,
      [combobox.list.length, height],
    );

    return (
      <motion.div
        className="origin-top"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ ease: EASING.kolumbOut, duration: 0.2 }}
      >
        <AnimatePresence>
          {combobox.open && (
            <FloatingFocusManager
              context={combobox.context}
              initialFocus={-1}
              visuallyHiddenDismiss
            >
              <motion.ul
                ref={combobox.refs.setFloating}
                initial={{
                  scaleY: 0,
                  width: `${width.initial}px`,
                }}
                animate={{
                  scaleY: 1,
                  width: `${width.target}px`,
                  height: animateHeight,
                  transition: {
                    ease: EASING.kolumbFlow,
                    duration: 0.4,
                    height: { ease: EASING.anticipate, duration: 0.6 },
                  },
                }}
                exit={{
                  scaleY: 0,
                  width: `${width.initial}px`,
                  transition: { ease: EASING.kolumbOut, duration: 0.3 },
                }}
                className={cn(
                  "mx-auto flex w-full origin-top flex-col overflow-hidden bg-white p-1.5 pt-2 text-sm shadow-smoothBorderBottom dark:bg-gray-800",
                  className,
                )}
                {...combobox.getFloatingProps()}
              >
                {children}
              </motion.ul>
            </FloatingFocusManager>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },

  Option({ index, className, children }: ComboboxProps["option"]) {
    const combobox = useComboboxContext();

    const active = combobox.activeIndex === index;

    const handleClick = () => {
      (
        combobox.refs.domReference.current?.querySelector("input, textarea") as
          | HTMLElement
          | undefined
      )?.focus({
        preventScroll: true,
      });

      combobox.activeItemRef.current = combobox.list[index];
      combobox.setInputValue(combobox.list[index]!.value);
      combobox.setOpen(false);
    };

    return (
      <motion.li
        ref={(node) => {
          if (node) combobox.listRef.current![index] = node;
        }}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          ...TRANSITION.appearInSequence,
          exit: {
            ...TRANSITION.appearInSequence.exit,
            scale: 0.5,
            transition: { ease: EASING.kolumbOut, duration: 0.3 },
          },
        }}
        custom={{ index }}
        className={cn(
          ButtonVariants({ variant: "baseScale", size: "unset" }),
          "w-full cursor-default py-2 before:rounded-md before:bg-black/5 before:shadow-button before:dark:bg-white/10",
          active && "before:scale-100 before:scale-x-100 before:scale-y-100 before:opacity-100",
          className,
        )}
        {...combobox.getItemProps({
          id: useId(),
          role: "option",
          "aria-selected": active,
          onClick: handleClick,
        })}
      >
        <div
          className={cn(
            "flex items-center gap-2 duration-200 ease-kolumb-overflow",
            active && "translate-x-1.5",
          )}
        >
          {children}
        </div>
      </motion.li>
    );
  },
};
