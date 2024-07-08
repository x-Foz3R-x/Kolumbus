import NextLink from "next/link";
import { cn } from "~/lib/utils";
import { Icons } from ".";
import { cva, type VariantProps } from "class-variance-authority";

export const ArrowVariants = cva(
  "group relative flex w-fit select-none items-center duration-500 ease-kolumb-flow hover:rounded transition-[border-radius,transform]",
  {
    variants: {
      theme: {
        default: "bg-kolumblue-500 outline-kolumblue-500 text-white fill-white",
        unset: null,
      },
      size: {
        default: "px-4 py-1 text-[15px] rounded-lg outline-[0.75px] outline-offset-1 outline",
        xl: "rounded-[min(max(0.7rem,0.8vw),1rem)] outline-2 outline-offset-1 outline-double leading-[2.25] px-[min(max(1.75rem,2vw),2.5rem)] text-scale-sm font-bold",
        unset: null,
      },
    },
    defaultVariants: { theme: "default", size: "default" },
  },
);

type ArrowProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof ArrowVariants> & {
    href: string;
    className?: string;
    children?: React.ReactNode;
  };

export const Link = {
  Arrow(props: ArrowProps) {
    const { href, target, theme, size, className, ...otherProps } = props;

    return (
      <NextLink
        href={href}
        target={target}
        className={ArrowVariants({ theme, size, className })}
        {...otherProps}
      >
        {/* <Icons.arrowRight
          className={cn(
            "pointer-events-none absolute bg-kolumblue-500 opacity-100 duration-500 ease-kolumb-flow group-hover:opacity-100",
            (size === "default" || size === undefined) && "left-px w-3 group-hover:left-[7px]",
            size === "xl" &&
              "-left-[calc(min(max(1.25rem,1.4vw),1.75rem)+0.75rem)] h-1/2 w-[calc(min(max(1.25rem,1.4vw),1.75rem)+0.5rem)] skew-y-[30deg] rounded px-1 group-hover:left-[calc(min(max(1.25rem,1.4vw),1.75rem)-8px)] group-hover:skew-y-0",
            target === "_blank" && "mb-0.5 -rotate-[39deg]",
          )}
          // "left-px w-4 group-hover:left-2 lg:left-1 lg:w-5 lg:group-hover:left-4",
        /> */}

        <Icons.arrowRight
          className={cn(
            "absolute opacity-0 duration-500 ease-kolumb-flow group-hover:opacity-100",
            (size === "default" || size === undefined) && "left-px w-3 group-hover:left-[7px]",
            size === "xl" &&
              "left-0.5 w-[min(max(1.25rem,1.4vw),1.75rem)] group-hover:left-[calc(min(max(1.25rem,1.4vw),1.75rem)-8px)]",
            target === "_blank" && "mb-0.5 -rotate-[39deg]",
          )}
          // "left-px w-4 group-hover:left-2 lg:left-1 lg:w-5 lg:group-hover:left-4",
        />

        <div
          className={cn(
            "w-fit transition-transform duration-500 ease-kolumb-flow",
            (size === "default" || size === undefined) && "group-hover:translate-x-2",
            size === "xl" &&
              "mt-1 group-hover:translate-x-[calc(min(max(1.25rem,1.4vw),1.75rem)-4px)]",
          )}
          // "group-hover:translate-x-2.5 lg:group-hover:translate-x-4",
        >
          {props.children}
        </div>
      </NextLink>
    );
  },
};
