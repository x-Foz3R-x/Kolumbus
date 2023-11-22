"use client";

import { HTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { VariantProps, cva } from "class-variance-authority";
import { TargetAndTransition, VariantLabels, motion } from "framer-motion";
import { CompareURLs, cn } from "@/lib/utils";

const AnchorVariants = cva("group peer relative flex select-none items-center outline-0", {
  variants: {
    variant: {
      default: "bg-gray-100 shadow-button focus-visible:shadow-focus",
      scale:
        "z-10 bg-transparent before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:opacity-0 before:shadow-button before:duration-300 before:ease-kolumb-flow before:hover:scale-100 before:hover:opacity-100 before:focus-visible:scale-100 before:focus-visible:opacity-100",
      tile: "h-[5.5rem] w-full rounded-lg hover:bg-gray-100 hover:shadow-kolumblueHover",
      disabled: "pointer-events-none opacity-40 focus-visible:shadow-focus",
      unstyled: "",
    },
    size: {
      default: "rounded-lg px-3 py-1.5 text-sm before:rounded-lg",
      sm: "rounded-md px-2.5 py-1 text-xs before:rounded-md",
      lg: "rounded-xl px-4 py-2 text-base before:rounded-xl",
      icon: "rounded-lg p-1.5 text-base before:rounded-lg",
      unstyled: "",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
export type AnchorProps = HTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof AnchorVariants> & {
    href: string;
    whileTap?: VariantLabels | TargetAndTransition | undefined;
    className?: string;
    animatePress?: boolean;
    children?: React.ReactNode;
  };
/**
 * @property href - url.
 * @property variant - Variant of the button: "default", "appear", "scale", "button", "disabled", "unstyled".
 * @property size - Size of the button: "default", "sm", "lg", "icon", "unstyled".
 * @property whileTap - On tap animation.
 * @property className - Additional CSS classes.
 * @property animatePress - Press animation flag.
 */
const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ href, variant, size, whileTap, className, animatePress = false, children, ...props }, ref) => {
    // For tile variant
    const baseStyle = "bg-gray-50 fill-tintedGray-400 text-gray-900 shadow-kolumblueInset hover:fill-tintedGray-500";
    const selectedStyle = "bg-kolumblue-100 fill-kolumblue-500 text-kolumblue-500 shadow-kolumblueSelected";
    const style = variant === "tile" ? (CompareURLs(href) ? selectedStyle : baseStyle) : undefined;

    return (
      <Link ref={ref} href={href} className={cn(style, AnchorVariants({ variant, size, className }))} {...props}>
        {children}
      </Link>
    );
  },
);
Anchor.displayName = "Anchor";

const A = motion(Anchor);

export default A;
