import { useEffect, useId, useRef } from "react";
import { VariantProps, cva } from "class-variance-authority";

import { Backdrop, BackdropType, Motion, Popover, PopoverTrigger, Position, Prevent } from "./popover";
import useScopeTabNavigation from "@/hooks/use-scope-tab-navigation";
import useKeyPress from "@/hooks/use-key-press";
import { TRANSITION } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";
import { KEY } from "@/types";

import { ButtonProps } from ".";

const ModalVariants = cva("mx-3 overflow-hidden rounded-xl bg-white shadow-borderXL", {
  variants: {
    size: {
      default: "max-w-lg",
      sm: "max-w-md",
      lg: "max-w-xl",
      fit: "min-w-min",
      unset: "",
    },
  },
  defaultVariants: { size: "default" },
});

type Props = VariantProps<typeof ModalVariants> & {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
  removeButton?: boolean;
  backdrop?: { type: BackdropType; className?: string };
  className?: string;
  buttonProps?: ButtonProps;
  children?: React.ReactNode;
};
export function Modal({ isOpen, setOpen, onClose: handleClose, removeButton, backdrop, size, className, buttonProps, children }: Props) {
  const ButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const buttonId = useId();
  const contentId = useId();

  const [_, tabEvent] = useKeyPress(KEY.Tab);
  useEffect(() => {
    isOpen && tabEvent?.preventDefault();
  }, [isOpen]); // eslint-disable-line

  useScopeTabNavigation(modalRef, isOpen);

  return (
    <>
      {!removeButton && (
        <PopoverTrigger
          ref={ButtonRef}
          id={buttonId}
          isOpen={isOpen}
          setOpen={setOpen}
          aria-haspopup="dialog"
          aria-controls={contentId}
          {...buttonProps}
        />
      )}

      <Popover
        popoverRef={modalRef}
        triggerRef={ButtonRef}
        isOpen={isOpen}
        setOpen={setOpen}
        onClose={handleClose}
        strategy="fixed"
        extensions={[
          Position("50%", "50%", "top left"),
          Motion(TRANSITION.scaleInOut),
          Prevent({ closeTriggers: !!backdrop, hide: true, scroll: true }),
          ...(backdrop ? [Backdrop(backdrop.type, backdrop.className)] : []),
        ]}
        className="-translate-x-1/2 -translate-y-1/2"
      >
        <div id={contentId} role="dialog" aria-modal className={cn(ModalVariants({ size, className }))}>
          {children}
        </div>
      </Popover>
    </>
  );
}

const ModalBodyWithIconVariants = cva("h-10 w-10 flex-shrink-0 rounded-full p-2.5", {
  variants: {
    variant: {
      default: "",
      primary: "bg-kolumblue-100 fill-kolumblue-500",
      success: "bg-green-100 fill-green-500",
      danger: "bg-red-100 fill-red-500",
      warning: "bg-orange-100 fill-orange-500",
    },
  },
  defaultVariants: { variant: "default" },
});
type ModalBodyWithIconProps = VariantProps<typeof ModalBodyWithIconVariants> & {
  icon: React.ReactNode;
  children?: React.ReactNode;
};
export function ModalBodyWithIcon({ variant, icon, children }: ModalBodyWithIconProps) {
  return (
    <div className="flex gap-4 px-6 pb-3 pt-6">
      <div className={cn(ModalBodyWithIconVariants({ variant }))}>{icon}</div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

export function ModalBody({ children }: { children?: React.ReactNode }) {
  return (
    <div className="px-6 pb-3 pt-6">
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

export function ModalTitle({ children }: { children?: React.ReactNode }) {
  return <h1 className="text-base font-semibold text-gray-700">{children}</h1>;
}

export function ModalMessage({ children }: { children?: React.ReactNode }) {
  return <p className="my-2 text-sm font-normal text-gray-500">{children}</p>;
}

export function ModalActionSection({ children }: { children?: React.ReactNode }) {
  return <section className="flex justify-end gap-3 bg-gray-50 px-6 py-3 text-sm font-medium">{children}</section>;
}
