import { SignedIn, SignedOut } from "@clerk/nextjs";

import Logo from "./logo";
import TopNavMenu from "./top-nav-menu";
import SlideAnimation from "./slide-animation";
import ProfileButton from "~/components/profile-button";
import { Link } from "~/components/ui";

export default function TopNav() {
  return (
    <nav className="apply-custom-cursor fixed inset-x-0 top-0 z-50 flex h-16 items-center whitespace-nowrap font-belanosima">
      <Logo />

      {/* Unraveled menu */}
      <SlideAnimation
        direction="out"
        threshold={100}
        className="relative hidden h-16 w-full items-center justify-end gap-6 bg-gradient-to-b from-white via-white to-gray-100/0 px-8 pl-[224px] md:flex"
      >
        <div className="flex items-center gap-4">
          <div className="flex">
            <Link.UnderLine
              href="/about"
              className="fill-gray-600 px-5 text-[17px] text-gray-600 before:inset-x-5"
            >
              About
            </Link.UnderLine>
            <Link.UnderLine
              href="/contact"
              className="fill-gray-600 px-5 text-[17px] text-gray-600 before:inset-x-5"
            >
              Contact
            </Link.UnderLine>
          </div>

          <SignedIn>
            <Link.Arrow href="/library" variant="outline" size="lg">
              Library
            </Link.Arrow>
            <ProfileButton />
          </SignedIn>

          <SignedOut>
            <Link.Arrow href="/signin" variant="outline" size="lg">
              Sign in
            </Link.Arrow>
            <Link.Arrow href="/signup" variant="primary" size="lg" className="font-semibold">
              Start Your Adventure
            </Link.Arrow>
          </SignedOut>
        </div>
      </SlideAnimation>

      <TopNavMenu />
    </nav>
  );
}
