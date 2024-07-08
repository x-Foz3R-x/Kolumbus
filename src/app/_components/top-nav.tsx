import { SignedIn, SignedOut } from "@clerk/nextjs";
import NextLink from "next/link";
import { cn } from "~/lib/utils";

import { ButtonVariants, Link, Icons } from "~/components/ui";
import ProfileButton from "~/components/profile-button";

export default function TopNav() {
  return (
    <nav className="apply-custom-cursor absolute inset-x-0 top-0 z-50 flex h-16 justify-center font-belanosima">
      <div className="relative z-50 flex h-16 w-full max-w-screen-2xl items-center justify-between px-8">
        <div className="z-50 hidden flex-1 items-center gap-4 sm:flex">
          <NextLink
            href="/"
            title="Homepage"
            aria-label="Homepage"
            className="flex items-center gap-2 text-2xl font-bold leading-[0] text-kolumblue-500"
          >
            <Icons.logo className="m-auto h-8 fill-kolumblue-500" />
            <span className="mt-1">KOLUMBUS</span>
          </NextLink>

          <Link.Arrow href="/contact">Contact</Link.Arrow>
          <p className="rounded bg-red-100 px-1 py-0.5 text-xs font-normal text-gray-400">
            Beta v0.3.0
          </p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <SignedIn>
            <NextLink
              href="/library"
              className={cn(ButtonVariants({ variant: "scale", size: "lg" }), "before:bg-gray-100")}
            >
              Library
            </NextLink>
            <ProfileButton />
          </SignedIn>
          <SignedOut>
            <NextLink
              href="/signin"
              className={cn(
                ButtonVariants({ variant: "scale", size: "lg" }),
                "flex items-center gap-2 before:bg-gray-100",
              )}
            >
              Sign in
            </NextLink>
            <NextLink
              href="/signup"
              className="block w-fit select-none text-nowrap rounded-xl bg-kolumblue-500 px-4 py-2 font-belanosima font-semibold text-white shadow-lg"
            >
              Start Your Adventure
            </NextLink>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
