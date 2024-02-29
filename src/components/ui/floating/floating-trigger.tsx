import { cloneElement, isValidElement } from "react";
import { useMergeRefs } from "@floating-ui/react";

import { useFloatingContext } from "./floating-context";

import { Button, ButtonProps } from "../button";

export type FloatingTriggerProps = ButtonProps & {
  triggerRef?: React.RefObject<HTMLElement>;
  asChild?: boolean;
};
export function FloatingTrigger({ triggerRef, asChild, children, ...props }: FloatingTriggerProps) {
  const context = useFloatingContext();
  const childrenRef = (children as any)?.ref;
  const ref = useMergeRefs([context.refs.setReference, triggerRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
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
