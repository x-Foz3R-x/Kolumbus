import { useEffect, useId, useRef } from "react";
import { VariantProps, cva } from "class-variance-authority";

import Button from "./button";
import { Backdrop, Motion, Popover, Position, Prevent } from "./popover";
import { cn } from "@/lib/utils";
import useKeyPress from "@/hooks/use-key-press";
import { Key } from "@/types";
import { TRANSITION } from "@/lib/framer-motion";
import { BackdropType } from "./popover/types";

const ModalVariants = cva("mx-3 min-w-min overflow-hidden", {
  variants: {
    modalVariant: {
      default: "bg-white shadow-borderXL backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter",
      unstyled: "",
    },
    modalSize: {
      default: "max-w-lg rounded-xl",
      sm: "max-w-md rounded-md",
      lg: "max-w-xl rounded-2xl",
      unstyled: "",
    },
  },
  defaultVariants: { modalVariant: "default", modalSize: "default" },
});
type ModalProps = VariantProps<typeof ModalVariants> & {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  backdrop?: { type: BackdropType; className?: string };
  buttonVariant?: "default" | "appear" | "scale" | "button" | "disabled" | "unstyled" | null;
  buttonSize?: "default" | "sm" | "lg" | "icon" | "unstyled" | null;
  className?: { button?: string; modal?: string };
  buttonChildren: React.ReactNode;
  children: React.ReactNode;
};
export default function Modal({
  isOpen,
  setOpen,
  backdrop,
  buttonVariant,
  buttonSize,
  modalVariant,
  modalSize,
  className,
  buttonChildren,
  children,
}: ModalProps) {
  const ButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const buttonId = useId();
  const contentId = useId();

  const [_, tabEvent] = useKeyPress(Key.Tab);
  useEffect(() => {
    isOpen && tabEvent?.preventDefault();
  }, [isOpen]); // eslint-disable-line

  const handleClick = () => setOpen(!isOpen);

  return (
    <div className="relative">
      <Button
        ref={ButtonRef}
        id={buttonId}
        onClick={handleClick}
        aria-haspopup="menu"
        aria-controls={contentId}
        {...(isOpen && { "aria-expanded": true })}
        variant={buttonVariant}
        size={buttonSize}
        className={className?.button}
      >
        {buttonChildren}
      </Button>

      <Popover
        popoverRef={modalRef}
        triggerRef={ButtonRef}
        isOpen={isOpen}
        setOpen={setOpen}
        extensions={[
          Position(0, 0, "center"),
          Motion(TRANSITION.scaleInOut),
          Prevent({ scroll: true, closeTriggers: backdrop?.type !== "none" }),
          backdrop ? Backdrop(backdrop?.type, backdrop?.className) : Backdrop("none"),
        ]}
        // className="flex h-screen w-screen items-center justify-center duration-300 ease-kolumb-overflow"
      >
        <div id={contentId} className={cn(ModalVariants({ modalVariant, modalSize, className: className?.modal }))}>
          {children}
        </div>
      </Popover>
    </div>
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
  children: React.ReactNode;
};
export function ModalBodyWithIcon({ variant, icon, children }: ModalBodyWithIconProps) {
  return (
    <div className="flex gap-4 px-6 pb-3 pt-6">
      <div className={cn(ModalBodyWithIconVariants({ variant }))}>{icon}</div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

export function ModalTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-base font-semibold text-gray-800">{children}</h1>;
}

export function ModalMessage({ children }: { children: React.ReactNode }) {
  return <p className="my-2 text-sm font-normal text-gray-500">{children}</p>;
}

export function ModalActionSection({ children }: { children: React.ReactNode }) {
  return <section className="flex justify-end gap-3 bg-gray-50 px-6 py-3 text-sm font-medium">{children}</section>;
}
