import { SignedIn, SignedOut } from "@clerk/nextjs";
import NextLink from "next/link";

import { Link, Icons, Divider } from "~/components/ui";
import ProfileButton from "~/components/profile-button";
import SlideAnimation from "./slide-animation";
import { Menu, MenuLink, MenuOption } from "~/components/ui/menu";
import { accountUrl } from "~/lib/constants";

export default function TopNav() {
  return (
    <nav className="apply-custom-cursor fixed inset-x-0 top-0 z-50 flex h-16 items-center px-8 font-belanosima">
      <NextLink href="/" className="fill-kolumblue-500">
        <Icons.logo className="m-auto h-12 rounded-full bg-white p-px outline-double outline-2 outline-offset-1 outline-kolumblue-500" />
      </NextLink>

      <SlideAnimation
        direction="out"
        threshold={100}
        className="relative flex h-16 w-full items-center justify-between"
      >
        <div className="flex gap-4 text-gray-600">
          <NextLink href="/" className="mt-1 pl-2 text-2xl font-bold">
            KOLUMBUS
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
      </SlideAnimation>

      <SlideAnimation direction="in" threshold={100} className="absolute right-8">
        <Menu
          placement="bottom-end"
          rootSelector="nav"
          buttonProps={{
            variant: "unset",
            size: "unset",
            className:
              "text-scale-md px-4 py-1 rounded-lg bg-kolumblue-500 text-white font-semibold outline-2 outline-double outline-offset-1 outline-kolumblue-500",
            children: "Menu",
          }}
        >
          <SignedIn>
            <MenuLink href="/library" label="library">
              <Icons.library className="ml-2 h-4 w-4" />
              Library
            </MenuLink>

            <Divider className="my-2 bg-gray-100 dark:bg-gray-800" />

            <MenuLink label="my account" href={accountUrl} className="pr-10">
              <Icons.userSettings className="ml-2 h-4 w-4" />
              My account
            </MenuLink>
            <MenuOption label="sign out">
              <Icons.signOut className="ml-2 h-4 w-4" />
              Sign out
            </MenuOption>
          </SignedIn>

          <SignedOut>
            <MenuLink href="/signin" label="sign in">
              Sign in
            </MenuLink>
            <MenuLink href="/signup" label="sign up">
              Sign up
            </MenuLink>
          </SignedOut>
        </Menu>
      </SlideAnimation>
    </nav>
  );
}
