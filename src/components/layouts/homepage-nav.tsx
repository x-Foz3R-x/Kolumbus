import Link from "next/link";

import { cn } from "@/lib/utils";

import Icon from "../icons";
import { ButtonVariants } from "../ui";
import ScrollAnimation from "../scroll-animation";
import Actions from "./global-nav/actions";

export default function HomepageNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-16 justify-center font-medium">
      <div className="relative z-50 flex w-full max-w-screen-2xl items-center justify-between px-8">
        <div className="z-50 hidden flex-1 items-center sm:flex">
          <Link href="/contact" className={cn(ButtonVariants({ variant: "scale", size: "lg" }), "before:bg-gray-100")}>
            Contact
          </Link>

          <p className="ml-3 rounded bg-red-100 px-1 py-0.5 text-xs font-normal text-gray-400">Beta v0.3.0</p>
        </div>

        {/* logo */}
        <ScrollAnimation
          propertyName="scale"
          multiplier={-0.3}
          offset={1}
          scrollRange="150px"
          className="hidden h-16 flex-shrink-0 origin-top px-2 py-1 sm:block"
        >
          <Link href="/" title="Homepage" aria-label="Homepage">
            <Icon.logoVertical className="m-auto h-20 fill-gray-900" />
          </Link>
        </ScrollAnimation>

        {/* logo when sm */}
        <div className="h-16 flex-shrink-0 px-2 py-5 sm:hidden">
          <Link href="/" title="Homepage" aria-label="Homepage">
            <Icon.logo className="m-auto h-6 fill-gray-900" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <Actions />
        </div>
      </div>

      <ScrollAnimation propertyName="opacity" multiplier={1} offset={0.25} scrollRange="150px">
        <ScrollAnimation
          propertyName="scaleY"
          multiplier={-1}
          offset={2}
          scrollRange="150px"
          className="fixed inset-x-0 top-0 z-40 h-16 origin-top bg-white/80 backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter"
        />
      </ScrollAnimation>
    </nav>
  );
}
