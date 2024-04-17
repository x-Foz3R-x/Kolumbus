"use client";

import { Toaster as Sonner } from "sonner";
import { Spinner } from "./spinner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: Omit<ToasterProps, "pauseWhenPageIsHidden">) => {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          toast: "flex gap-2 font-inter text-gray-700",
          icon: "size-5",
        },
      }}
      icons={{
        loading: <Spinner.default size="sm" className="fill-slate-900/70" />,
      }}
      richColors
      {...props}
    />
  );
};

export { Toaster };
