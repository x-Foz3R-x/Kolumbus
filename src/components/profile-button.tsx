"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, useClerk, useUser } from "@clerk/nextjs";

import { Divider, Icon } from "./ui";
import { Menu, MenuLink, MenuOption } from "./ui/menu";
import { accountUrl } from "~/lib/constants";

type ProfileButtonProps = {
  size?: number;
  dark?: boolean;
};
export default function ProfileButton({ size = 32, dark }: ProfileButtonProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <SignedIn>
      <Menu
        placement="bottom-end"
        offset={4}
        animation="fadeToPosition"
        zIndex={50}
        className="w-60 origin-top-right translate-x-2 rounded-xl p-2"
        rootSelector="nav"
        darkMode={dark}
        buttonProps={{
          variant: "unset",
          size: "unset",
          style: { width: `${size}px`, height: `${size}px` },
          className:
            "relative overflow-hidden rounded-full shadow-borderXS outline-none duration-500 ease-kolumb-flow hover:shadow-lg focus-visible:border-kolumblue-500",
          children: (
            <>
              <span className="pointer-events-none absolute h-10 w-1 -translate-x-4 -translate-y-4 rotate-45 rounded-full bg-white/30 duration-200 ease-in-out group-hover:translate-x-4 group-hover:translate-y-4" />
              <span className="pointer-events-none absolute h-5 w-0.5 -translate-x-5 -translate-y-5 rotate-45 rounded-full bg-white/30 duration-300 ease-in-out group-hover:translate-x-5 group-hover:translate-y-5" />

              {user && (
                <Image
                  src={user.imageUrl}
                  alt="Profile picture"
                  loading="lazy"
                  sizes={`${size}px`}
                  fill
                />
              )}
            </>
          ),
        }}
      >
        <div className="flex w-full select-none flex-col items-center gap-1 p-2.5 pb-1">
          <Link
            href={accountUrl}
            className="relative h-14 w-14 overflow-hidden rounded-full shadow-borderXS duration-500 ease-kolumb-flow hover:shadow-2xl"
          >
            {user && (
              <Image src={user.imageUrl} alt="Profile picture" loading="lazy" sizes="56px" fill />
            )}
          </Link>
          <div className="flex select-text flex-col justify-center overflow-hidden text-center">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
              {user?.fullName}
            </span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>

        <Divider className="my-2 bg-gray-100 dark:bg-gray-800" />

        <MenuLink label="my account" href={accountUrl}>
          <Icon.userSettings className="ml-2 h-4 w-4" />
          My account
        </MenuLink>
        {/* <MenuOption label="switch account" disabled>
        <Icon.userSwitch className="ml-2 h-4 w-4" />
        Switch account
        <Icon.chevron className="ml-auto mr-1 w-3 -rotate-90" />
      </MenuOption> */}
        <MenuOption label="appearance" disabled>
          <Icon.appearance className="ml-2 h-4 w-4" />
          Appearance
          <Icon.chevron className="ml-auto mr-1 w-3 -rotate-90" />
        </MenuOption>
        <MenuOption label="language" disabled>
          <Icon.globe className="ml-2 h-4 w-4" />
          Language
          <Icon.chevron className="ml-auto mr-1 w-3 -rotate-90" />
        </MenuOption>

        <Divider className="my-2 bg-gray-100 dark:bg-gray-800" />

        <MenuOption label="sign out" onClick={handleSignOut}>
          <Icon.signOut className="ml-2 h-4 w-4" />
          Sign out
        </MenuOption>
      </Menu>
    </SignedIn>
  );
}
