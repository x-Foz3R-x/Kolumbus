import NextLink from "next/link";
import { cn } from "~/lib/utils";
import { Icons } from ".";
import { cva, type VariantProps } from "class-variance-authority";

export const ArrowVariants = cva("", {
  variants: {
    variant: {
      primary:
        "bg-kolumblue-500 outline outline-kolumblue-500 focus:outline-kolumblue-500 text-white fill-white outline-1 outline-offset-1 focus:outline focus:outline-1",
      outline: "border-[1.5px] border-gray-600 text-gray-600 fill-gray-600",
      unset: null,
    },
    size: {
      base: "px-4 py-1 text-base rounded-xl",
      lg: "px-5 py-1 text-lg rounded-[10px]",
      d3xl: "rounded-[clamp(0.9rem,1vw,1.25rem)] leading-[2.25] px-d8 font-bold",
      d4xl: "rounded-[clamp(1.35rem,1.5vw,1.875rem)] leading-[2.25] px-d10 font-bold",
      unset: null,
    },
    arrowSize: {
      base: "left-px w-3 group-hover:left-[7px] group-focus:left-[7px]",
      lg: "left-px w-4 group-hover:left-[9px] group-focus:left-[9px]",
      d3xl: "left-0.5 w-d6 group-hover:translate-x-[calc(clamp(1.35rem,1.5vw,1.875rem)/1.9)] group-focus:translate-x-[calc(clamp(1.35rem,1.5vw,1.875rem)/1.9)]",
      d4xl: "left-0.5 w-d7 group-hover:translate-x-[calc(clamp(1.575rem,1.75vw,2.1875rem)/1.9)] group-focus:translate-x-[calc(clamp(1.575rem,1.75vw,2.1875rem)/1.9)]",
      unset: null,
    },
    shift: {
      base: "group-hover:translate-x-2 group-focus:translate-x-2",
      lg: "group-hover:translate-x-2.5 group-focus:translate-x-2.5",
      d3xl: "mt-1 group-hover:translate-x-[calc(clamp(1.35rem,1.5vw,1.875rem)/1.4)] group-focus:translate-x-[calc(clamp(1.35rem,1.5vw,1.875rem)/1.4)]",
      d4xl: "mt-1.5 group-hover:translate-x-[calc(clamp(1.575rem,1.75vw,2.1875rem)/1.4)] group-focus:translate-x-[calc(clamp(1.575rem,1.75vw,2.1875rem)/1.4)]",
      unset: null,
    },
  },
  defaultVariants: { variant: "unset", size: "unset", arrowSize: "unset", shift: "unset" },
});

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  className?: string;
  children?: React.ReactNode;
};

type ArrowProps = VariantProps<typeof ArrowVariants> & LinkProps;

export const Link = {
  Default(props: LinkProps) {
    const { href, className, ...otherProps } = props;

    return (
      <NextLink href={href} className={cn("group block", className)} {...otherProps}>
        {props.children}
      </NextLink>
    );
  },
  Arrow(props: ArrowProps) {
    const { href, target, variant, size, arrowSize, shift, className, ...otherProps } = props;

    return (
      <NextLink
        href={href}
        target={target}
        className={
          cn(
            "group relative flex w-fit select-none items-center whitespace-nowrap transition-[border-radius,transform] duration-400 ease-kolumb-flow hover:rounded focus:rounded",
            ArrowVariants({ variant, size, className }),
          ) +
          `${size === "d3xl" ? " text-d-3xl" : ""}` +
          `${size === "d4xl" ? " text-d-4xl" : ""}`
        }
        {...otherProps}
      >
        <Icons.arrowRight
          className={cn(
            ArrowVariants({ arrowSize: arrowSize ?? size }),
            "absolute opacity-0 duration-400 ease-kolumb-flow group-hover:opacity-100 group-focus:opacity-100",
            target === "_blank" && "mb-0.5 -rotate-[39deg]",
          )}
        />

        <div
          className={cn(
            "w-fit transition-transform duration-400 ease-kolumb-flow",
            ArrowVariants({ shift: shift ?? size }),
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
          "group relative block w-fit text-gray-600 before:pointer-events-none before:absolute before:inset-x-0 before:-bottom-0.5 before:h-[1.5px] before:bg-current before:opacity-0 before:duration-400 before:ease-kolumb-flow before:hover:bottom-0.5 before:hover:opacity-100",
          className,
        )}
        {...otherProps}
      >
        {props.children}
      </NextLink>
    );
  },
};
