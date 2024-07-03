import NextLink from "next/link";
import { cn } from "~/lib/utils";
import { Icons } from ".";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  className?: string;
  children?: React.ReactNode;
};

export const Link = {
  arrow(props: LinkProps) {
    return (
      <NextLink
        {...props}
        className={cn(
          "group relative flex w-fit items-center rounded-xl bg-kolumblue-500 px-5 py-2 text-lg font-semibold text-white duration-400 ease-kolumb-flow hover:rounded lg:px-8 lg:py-3 lg:text-2xl",
          props.className,
        )}
      >
        <Icons.arrowRight className="absolute left-px w-4 fill-white opacity-0 duration-400 ease-kolumb-flow group-hover:left-2 group-hover:opacity-100 lg:left-1 lg:w-5 lg:group-hover:left-4" />

        <div className="w-fit duration-400 ease-kolumb-flow group-hover:translate-x-2.5 lg:group-hover:translate-x-4">
          {props.children}
        </div>
      </NextLink>
    );
  },
};
