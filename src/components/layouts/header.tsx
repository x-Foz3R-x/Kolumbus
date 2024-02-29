import Link from "next/link";

import { cn } from "@/lib/utils";

import Icon from "@/components/icons";
import { ButtonVariants } from "../ui";
import ProfileButton from "@/components/profile-button";

export default function Header() {
  return (
    <nav className="fixed inset-x-0 top-0 z-[100] flex h-14 items-center justify-between bg-white font-inter">
      <div className="h-14 w-56 flex-none">
        <Link href="/" title="Homepage" aria-label="Homepage" className="m-auto my-4 flex w-fit justify-center">
          <Icon.logo className="h-6" />
        </Link>
      </div>

      <div className="flex h-full w-full items-center justify-center px-3 font-medium">
        <Link
          href="/library"
          className={cn(
            ButtonVariants({ variant: "scale", size: "unset" }),
            "flex items-center gap-3 fill-gray-400 px-4 py-1.5 duration-150 ease-kolumb-flow before:rounded-lg before:bg-gray-100 hover:fill-gray-900",
          )}
        >
          <Icon.library className="mb-0.5 h-4 w-4" />
          Library
        </Link>

        {/* <Link
          href="/library"
          className={cn(
            ButtonVariants({ variant: "scale", size: "unset" }),
            "flex items-center gap-3 fill-gray-400 px-4 py-1.5 duration-150 ease-kolumb-flow before:rounded-lg before:bg-gray-100 hover:fill-gray-900",
          )}
        >
          <Icon.market className="mb-0.5 h-4 w-4" />
          Market
        </Link>
        
        <Link
          href="/library"
          className={cn(
            ButtonVariants({ variant: "scale", size: "unset" }),
            "flex items-center gap-3 fill-gray-400 px-4 py-1.5 duration-150 ease-kolumb-flow before:rounded-lg before:bg-gray-100 hover:fill-gray-900",
          )}
        >
          <Icon.showcase className="mb-0.5 h-4 w-4" />
          Showcase
        </Link> */}
      </div>

      <section className="flex h-14 w-56 flex-none items-center justify-end gap-4 pr-8">
        <ProfileButton />
      </section>
    </nav>
  );
}
