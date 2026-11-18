"use client";

import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";

import { Divider, Icons, Link } from "~/components/ui";
import { MenuLink, MenuOption } from "~/components/ui/menu";
import { startLink } from "~/config/site";
import { accountUrl } from "~/lib/constants";
import ProfileButton from "~/components/profile-button";
import TopNav from "./top-nav";
import { PublicLinks } from "./top-nav-menu";

export default function AccountTopNav() {
  return <TopNav actions={<AccountActions />} menu={<AccountLinks />} />;
}

function AccountActions() {
  return (
    <>
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
        <Link.Arrow href={startLink.href} variant="primary" size="lg" className="font-semibold">
          {startLink.label}
        </Link.Arrow>
      </SignedOut>
    </>
  );
}

function AccountLinks() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      <SignedIn>
        <MenuLink href="/library" label="library" className="text-base text-gray-600">
          <Icons.library className="ml-2 h-4 w-4" />
          Library
        </MenuLink>

        <Divider className="my-2 bg-kolumblue-400" />

        <MenuLink label="my account" href={accountUrl} className="text-base text-gray-600">
          <Icons.userSettings className="ml-2 h-4 w-4" />
          My account
        </MenuLink>
        <MenuOption
          label="sign out"
          onClick={handleSignOut}
          className="text-base text-gray-600"
        >
          <Icons.signOut className="ml-2 h-4 w-4" />
          Sign out
        </MenuOption>
      </SignedIn>
      <SignedOut>
        <PublicLinks />
        <MenuLink href="/signin" label="sign in" className="text-base text-gray-600">
          Sign in
        </MenuLink>
        <MenuLink href="/signup" label="sign up" className="text-base text-gray-600">
          Sign up
        </MenuLink>
      </SignedOut>
    </>
  );
}
