import { SignedIn, SignedOut } from "@clerk/nextjs";

import { accountUrl } from "~/lib/constants";

import Logo from "./logo";
import SlideAnimation from "./slide-animation";
import ProfileButton from "~/components/profile-button";
import { Menu, MenuLink, MenuOption } from "~/components/ui/menu";
import { Link, Icons, Divider } from "~/components/ui";

export default function TopNav() {
  return (
    <nav className="apply-custom-cursor fixed inset-x-0 top-0 z-50 flex h-16 items-center px-8 font-belanosima">
      <Logo />

      <SlideAnimation
        direction="out"
        threshold={100}
        className="relative flex h-16 w-full items-center justify-between gap-6 pl-[224px]"
      >
        <Link.Arrow href="/contact" theme="outline" size="md">
          Contact
        </Link.Arrow>

        <div className="flex items-center gap-4">
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

      <SlideAnimation direction="in" threshold={100} className="absolute right-8">
        <Menu
          placement="bottom-end"
          rootSelector="nav"
          animation="appear"
          className="bg-kolumblue-500 font-belanosima outline outline-[0.75px] outline-offset-1 outline-kolumblue-500"
          buttonProps={{
            variant: "unset",
            size: "unset",
            className:
              "text-lg px-5 py-1 rounded-2xl bg-kolumblue-500 text-white font-semibold outline outline-1 hover:rounded focus:rounded ease-kolumb-flow duration-500 outline-offset-1 outline-kolumblue-500 focus:outline-kolumblue-500 focus:outline focus:outline-1",
            children: "Menu",
          }}
        >
          <SignedIn>
            <MenuLink
              href="/library"
              label="library"
              className="h-10 fill-white pr-8 text-base font-semibold text-white"
              classNames={{ button: "before:bg-kolumblue-400/50" }}
            >
              <Icons.library className="ml-2 h-4 w-4" />
              Library
            </MenuLink>

            <Divider className="my-2 bg-kolumblue-400" />

            <MenuLink
              label="my account"
              href={accountUrl}
              className="h-10 fill-white pr-8 text-base font-semibold text-white"
              classNames={{ button: "before:bg-kolumblue-400/50" }}
            >
              <Icons.userSettings className="ml-2 h-4 w-4" />
              My account
            </MenuLink>
            <MenuOption
              label="sign out"
              className="h-10 fill-white pr-8 text-base font-semibold text-white"
              classNames={{ button: "before:bg-kolumblue-400/50" }}
            >
              <Icons.signOut className="ml-2 h-4 w-4" />
              Sign out
            </MenuOption>
          </SignedIn>

          <SignedOut>
            <MenuLink
              href="/signin"
              label="sign in"
              className="h-10 pr-8 text-base font-semibold text-white"
              classNames={{ button: "before:bg-kolumblue-400/50" }}
            >
              Sign in
            </MenuLink>
            <MenuLink
              href="/signup"
              label="sign up"
              className="h-10 pr-8 text-base font-semibold text-white"
              classNames={{ button: "before:bg-kolumblue-400/50" }}
            >
              Sign up
            </MenuLink>
          </SignedOut>
        </Menu>
      </SlideAnimation>
    </nav>
  );
}
