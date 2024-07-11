import NextLink from "next/link";
import { cn } from "~/lib/utils";
import { Icons } from ".";
import { cva, type VariantProps } from "class-variance-authority";

export const ArrowVariants = cva(
  "group relative flex w-fit select-none items-center duration-400 ease-kolumb-flow hover:rounded transition-[border-radius,transform] focus:rounded",
  {
    variants: {
      theme: {
        primary:
          "bg-kolumblue-500 outline outline-kolumblue-500 focus:outline-kolumblue-500 text-white fill-white outline-1 outline-offset-1 focus:outline focus:outline-1",
        outline: "border-[1.5px] border-gray-600 text-gray-600 fill-gray-600 bg-white",
        unset: null,
      },
      size: {
        sm: "px-4 py-1 text-base rounded-xl",
        md: "px-5 py-1 text-lg rounded-[10px]",
        xl: "rounded-[min(max(0.7rem,0.8vw),1rem)] leading-[2.25] px-[min(max(1.75rem,2vw),2.5rem)] text-d-2xl font-bold",
        unset: null,
      },
    },
    defaultVariants: { theme: "unset", size: "unset" },
  },
);

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  className?: string;
  children?: React.ReactNode;
};

type ArrowProps = VariantProps<typeof ArrowVariants> & LinkProps;

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
        <Icons.arrowRight
          className={cn(
            "absolute opacity-0 duration-400 ease-kolumb-flow group-hover:opacity-100 group-focus:opacity-100",
            size === "sm" && "left-px w-3 group-hover:left-[7px] group-focus:left-[7px]",
            size === "md" && "left-px w-4 group-hover:left-[9px] group-focus:left-[9px]",
            size === "xl" &&
              "left-0.5 w-[min(max(1.25rem,1.4vw),1.75rem)] group-hover:left-[calc(min(max(1.25rem,1.4vw),1.75rem)-8px)] group-focus:left-[calc(min(max(1.25rem,1.4vw),1.75rem)-8px)]",
            target === "_blank" && "mb-0.5 -rotate-[39deg]",
          )}
        />

        <div
          className={cn(
            "w-fit transition-transform duration-400 ease-kolumb-flow",
            size === "sm" && "group-hover:translate-x-2 group-focus:translate-x-2",
            size === "md" && "group-hover:translate-x-2.5 group-focus:translate-x-2.5",
            size === "xl" &&
              "mt-1 group-hover:translate-x-[calc(min(max(1.25rem,1.4vw),1.75rem)-4px)] group-focus:translate-x-[calc(min(max(1.25rem,1.4vw),1.75rem)-4px)]",
          )}
        >
          {props.children}
        </div>
      </NextLink>
    );
  },
  UnderLine(props: LinkProps) {
    const { href, className, ...otherProps } = props;

    return (
      <NextLink
        href={href}
        className={cn(
          "group relative px-5 text-lg text-gray-600 before:pointer-events-none before:absolute before:inset-x-5 before:-bottom-0.5 before:h-[1.5px] before:bg-current before:opacity-0 before:duration-400 before:ease-kolumb-flow before:hover:bottom-0.5 before:hover:opacity-100",
          className,
        )}
        {...otherProps}
      >
        {props.children}
      </NextLink>
    );
  },
};
