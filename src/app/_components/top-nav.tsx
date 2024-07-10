import { SignedIn, SignedOut } from "@clerk/nextjs";

import Logo from "./logo";
import TopNavMenu from "./top-nav-menu";
import SlideAnimation from "./slide-animation";
import ProfileButton from "~/components/profile-button";
import { Link } from "~/components/ui";

export default function TopNav() {
  return (
    <nav className="apply-custom-cursor fixed inset-x-0 top-0 z-50 flex h-16 items-center px-8 font-belanosima">
      <Logo />

      {/* Unraveled menu */}
      <SlideAnimation
        direction="out"
        threshold={100}
        className="relative flex h-16 w-full items-center justify-end gap-6 pl-[224px]"
      >
        <div className="flex items-center gap-4">
          <Link.Arrow href="/contact" size="sm" className="fill-gray-600 text-gray-600">
            Contact
          </Link.Arrow>
          <Link.Arrow href="/contact" size="sm" className="fill-gray-600 text-gray-600">
            About
          </Link.Arrow>
          <Link.Arrow href="/contact" size="sm" className="fill-gray-600 text-gray-600">
            Pricing
          </Link.Arrow>

          <SignedIn>
            <Link.Arrow href="/library" theme="outline" size="md">
              Library
            </Link.Arrow>
            <ProfileButton />
          </SignedIn>

          <SignedOut>
            <Link.Arrow href="/signin" theme="outline" size="md">
              Sign in
            </Link.Arrow>
            <Link.Arrow href="/signup" theme="primary" size="md" className="font-semibold">
              Start Your Adventure
            </Link.Arrow>
          </SignedOut>
        </div>
      </SlideAnimation>

      <TopNavMenu />
    </nav>
  );
}
