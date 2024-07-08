import { SignedIn, SignedOut } from "@clerk/nextjs";
import NextLink from "next/link";

import { Link, Icons } from "~/components/ui";
import ProfileButton from "~/components/profile-button";

export default function TopNav() {
  return (
    <nav className="apply-custom-cursor absolute inset-x-0 top-0 z-50 flex h-16 justify-center font-belanosima">
      <div className="relative z-50 flex h-16 w-full max-w-screen-2xl items-center justify-between px-8">
        <div className="z-50 hidden flex-1 items-center gap-4 sm:flex">
          <NextLink
            href="/"
            className="flex items-center gap-2 fill-kolumblue-500 text-2xl font-bold leading-[0] text-gray-600"
          >
            <Icons.logo className="m-auto h-[min(max(2.62rem,3vw),3.75rem)] bg-white" />
            <span className="mt-1">KOLUMBUS</span>
          </NextLink>

          <Link.Arrow href="/contact">Contact</Link.Arrow>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <SignedIn>
            <Link.Arrow href="/library">Library</Link.Arrow>
            <ProfileButton />
          </SignedIn>
          <SignedOut>
            <Link.Arrow href="/signin">Sign in</Link.Arrow>
            <Link.Arrow href="/signup" theme="primary">
              Start Your Adventure
            </Link.Arrow>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
