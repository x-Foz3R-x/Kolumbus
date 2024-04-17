import { cloneElement, isValidElement } from "react";
import { useMergeRefs } from "@floating-ui/react";

import { useFloatingContext } from "./floating-context";

import { Button, type ButtonProps } from "../button";

export type FloatingTriggerProps = ButtonProps & {
  triggerRef?: React.RefObject<HTMLElement>;
  asChild?: boolean;
};
export function FloatingTrigger({ triggerRef, asChild, children, ...props }: FloatingTriggerProps) {
  const context = useFloatingContext();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const childrenRef = (children as any)?.ref;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const ref = useMergeRefs([context.refs.setReference, triggerRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      context.getReferenceProps({
        ref,
        ...children.props,
        ...props,
      }),
    );
  }

  return (
    <Button ref={ref} {...context.getReferenceProps()} {...props}>
      {children}
    </Button>
  );
}
