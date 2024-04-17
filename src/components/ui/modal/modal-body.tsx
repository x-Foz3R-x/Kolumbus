import { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

type ModalBodyIconDesignProps = VariantProps<typeof ModalBodyIconDesignVariants> & {
  icon: React.ReactNode;
  children?: React.ReactNode;
};
const ModalBodyIconDesignVariants = cva("h-10 w-10 flex-shrink-0 rounded-full p-2.5", {
  variants: {
    variant: {
      primary: "bg-kolumblue-100 fill-kolumblue-500",
      success: "bg-green-100 fill-green-500",
      danger: "bg-red-100 fill-red-500",
      warning: "bg-orange-100 fill-orange-500",
      unset: null,
    },
  },
  defaultVariants: { variant: "primary" },
});

export const ModalBody = {
  default: memo(function ModalBody({ children }: { children?: React.ReactNode }) {
    return (
      <div className="px-6 pb-3 pt-6">
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    );
  }),

  iconDesign: memo(function ModalIconDesign({ variant, icon, children }: ModalBodyIconDesignProps) {
    return (
      <div className="flex gap-4 px-6 pb-3 pt-6">
        <div className={cn(ModalBodyIconDesignVariants({ variant }))}>{icon}</div>
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    );
  }),
};
