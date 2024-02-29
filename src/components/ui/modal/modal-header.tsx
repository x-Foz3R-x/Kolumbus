import { memo, useId, useLayoutEffect } from "react";

import { cn } from "@/lib/utils";
import { useModalContext } from "./modal-context";

export const ModalHeader = memo(function ModalHeader({ className, ...props }: React.HTMLProps<HTMLHeadingElement>) {
  const { setLabelId } = useModalContext();
  const id = useId();

  // Only sets `aria-labelledby` on the Dialog root element if this component is mounted inside it.
  useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return <h2 id={id} className={cn("text-base font-semibold text-gray-700", className)} {...props} />;
});
