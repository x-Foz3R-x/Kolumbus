import NextLink from "next/link";
import { cn } from "~/lib/utils";
import { Icons } from ".";
import { cva, type VariantProps } from "class-variance-authority";

export const ArrowVariants = cva(
  "group relative flex w-fit items-center duration-500 ease-kolumb-flow leading-[0.8] hover:rounded transition-[border-radius,transform] active:translate-y-[min(max(0.2625rem,0.3vw),0.375rem)]",
  {
    variants: {
      theme: {
        default: "bg-kolumblue-500 text-white fill-white active:translate-y-[3px]",
        unset: null,
      },
      size: {
        default: "px-4 py-1 text-[15px] rounded-lg",
        xl: "rounded-[min(max(0.7rem,0.8vw),1rem)] px-[min(max(1.75rem,2vw),2.5rem)] py-[min(max(1.05rem,1.2vw),1.5rem)] text-scale-sm font-bold active:translate-y-[min(max(0.2625rem,0.3vw),0.375rem)]",
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
