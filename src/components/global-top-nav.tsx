import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "~/lib/utils";

import { ButtonVariants, Icon } from "~/components/ui";
import ProfileButton from "~/components/profile-button";

export default function GlobalTopNav() {
  return (
    <nav className="sticky inset-x-0 top-0 z-50 h-14 bg-white bg-white/80 font-belanosima backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
      <div className="relative z-50 mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between px-8">
        <section className="z-50 hidden flex-1 items-center sm:flex">
          <Link
            href="/contact"
            className={cn(ButtonVariants({ variant: "scale", size: "lg" }), "before:bg-gray-100")}
          >
            Contact
          </Link>
          <p className="ml-3 rounded bg-red-100 px-1 py-0.5 text-xs font-normal text-gray-400">
            Beta v0.3.0
          </p>
        </section>

        <Link href="/" title="Homepage" aria-label="Homepage" className="hidden sm:block">
          <Icon.logoVertical className="m-auto h-12 fill-gray-800" />
        </Link>

        {/* logo when sm */}
        <Link href="/" title="Homepage" aria-label="Homepage" className="sm:hidden">
          <Icon.logo className="m-auto h-6 fill-gray-800" />
        </Link>

        <section className="flex flex-1 items-center justify-end gap-4">
          <SignedIn>
            <Link
              href="/library"
              className={cn(ButtonVariants({ variant: "scale", size: "lg" }), "before:bg-gray-100")}
            >
              Library
            </Link>
            <ProfileButton />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className={cn(
                ButtonVariants({ variant: "scale", size: "lg" }),
                "flex items-center gap-2 before:bg-gray-100",
              )}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="block w-fit select-none text-nowrap rounded-xl bg-kolumblue-500 px-4 py-2 font-belanosima font-semibold text-white shadow-lg"
            >
              Start Your Adventure
            </Link>
          </SignedOut>
        </section>
      </div>
    </nav>
  );
}
