import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  FloatingFocusManager,
  FloatingPortal,
  FloatingOverlay,
} from "@floating-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { ModalContext } from "./modal-context";
import { TRANSITION } from "~/lib/framer-motion";
import { cn } from "~/lib/utils";

import { Button, type ButtonProps } from "../button";

const ModalVariants = cva(
  "mx-3 overflow-hidden rounded-xl border bg-white font-inter shadow-floating dark:border-gray-700 dark:bg-gray-900 dark:text-white",
  {
    variants: {
      size: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        fit: "min-w-min",
        unset: null,
      },
    },
    defaultVariants: { size: "md" },
  },
);

type ModalProps = VariantProps<typeof ModalVariants> & {
  initialOpen?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  animation?: Exclude<keyof typeof TRANSITION, "fadeToPosition"> | null;
  className?: string;
  zIndex?: number;
  dismissible?: boolean;
  rootSelector?: string;
  buttonProps?: ButtonProps;
  children?: React.ReactNode;
};
export function Modal({
  initialOpen = false,
  open: controlledOpen,
  setOpen: setControlledOpen,
  animation,
  size,
  className,
  zIndex = 999,
  dismissible = false,
  rootSelector,
  buttonProps,
  children,
}: ModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const [isMounted, setIsMounted] = useState(false);
  const [labelId, setLabelId] = useState<string | undefined>();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  //#region Floating UI
  const data = useFloating({ open: open, onOpenChange: setOpen });

  const click = useClick(data.context, { enabled: controlledOpen == null });
  const dismiss = useDismiss(data.context, {
    enabled: dismissible,
    outsidePressEvent: "mousedown",
  });
  const role = useRole(data.context);

  const { getFloatingProps, getItemProps, getReferenceProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);
  //#endregion

  const variants = useMemo(() => {
    if (animation === null) return undefined;
    if (animation) return TRANSITION[animation];

    return TRANSITION.scaleInOut;
  }, [animation]);
  const tooltipProps = useMemo(() => {
    return open
      ? undefined
      : rootSelector && buttonProps?.tooltip
        ? { ...buttonProps.tooltip, rootSelector }
        : buttonProps?.tooltip;
  }, [open, rootSelector, buttonProps]);
  const ButtonComponent = useMemo(
    () => (
      <Button
        ref={data.refs.setReference}
        tabIndex={0}
        {...getReferenceProps()}
        {...buttonProps}
        tooltip={tooltipProps}
      />
    ),
    [data.refs, getReferenceProps, buttonProps, tooltipProps],
  );

  const modalContext = useMemo(
    () => ({
      open,
      setOpen,
      getFloatingProps,
      getItemProps,
      getReferenceProps,
      setLabelId,
      ...data,
    }),
    [open, setOpen, getFloatingProps, getItemProps, getReferenceProps, data],
  );

  // Set isMounted to true when open becomes true
  useEffect(() => {
    open && setIsMounted(true);
  }, [open]);

  return (
    <ModalContext.Provider value={modalContext}>
      {controlledOpen == null && ButtonComponent}

      {isMounted && (
        <FloatingPortal
          root={
            rootSelector
              ? (document.querySelector(rootSelector) as HTMLElement | undefined)
              : undefined
          }
        >
          <FloatingOverlay
            style={{ zIndex }}
            className={cn("relative grid place-items-center")}
            lockScroll
          >
            <FloatingFocusManager context={data.context}>
              <AnimatePresence onExitComplete={() => setIsMounted(false)}>
                {open && (
                  <>
                    <motion.div
                      ref={data.refs.setFloating}
                      aria-labelledby={labelId}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={variants}
                      className={cn(ModalVariants({ size }), className)}
                      {...getFloatingProps()}
                    >
                      {children}
                    </motion.div>

                    <motion.span
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={TRANSITION.fade}
                      className={cn(
                        "pointer-events-none absolute inset-0 -z-10",
                        !dismissible && "bg-black/20",
                      )}
                    />
                  </>
                )}
              </AnimatePresence>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </ModalContext.Provider>
  );
}
