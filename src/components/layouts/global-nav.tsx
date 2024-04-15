import Link from "next/link";

import { cn } from "@/lib/utils";

import Icon from "../icons";
import { ButtonVariants } from "../ui";
import ScrollAnimation from "../scroll-animation";
import Actions from "./global-nav/actions";

// todo make bigger height for the nav

export default function GlobalNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-12 justify-center font-medium">
      <div className="container relative z-50 flex w-full items-center px-8">
        <section style={{ width: "calc(50% - 48px)" }} className="z-50 flex items-center">
          <Link href="/contact" className={cn(ButtonVariants({ variant: "scale" }), "before:bg-gray-100")}>
            Contact
          </Link>

          <p className="ml-3 rounded bg-red-100 px-1 py-0.5 text-[10px] font-normal text-gray-400">Beta v0.2.10</p>
        </section>

        <ScrollAnimation propertyName="scale" className="origin-top" multiplier={-0.5} offset={1} scrollRange="150px">
          <section className="h-12 w-24 flex-shrink-0 p-1">
            <Link href="/" title="Homepage" aria-label="Homepage">
              <Icon.logoVertical className="group m-auto h-20 fill-gray-900" />
            </Link>
          </section>
        </ScrollAnimation>

        <section style={{ width: "calc(50% - 48px)" }} className="flex items-center justify-end gap-4">
          <Actions />
        </section>
      </div>

      <ScrollAnimation propertyName="opacity" multiplier={1} offset={0} scrollRange="150px">
        <ScrollAnimation
          propertyName="scaleY"
          multiplier={-1}
          offset={2}
          scrollRange="150px"
          className="fixed inset-x-0 top-0 z-40 h-12 origin-top bg-white/80 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter"
        />
      </ScrollAnimation>
    </nav>
  );
}
