"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useClerk, useUser } from "@clerk/nextjs";

import { TRANSITION } from "@/lib/framer-motion";

import Icon from "./icons";
import { Dropdown, DropdownLink, DropdownOption } from "./ui/dropdown";
import { Divider } from "./ui";
import Link from "next/link";

export default function ProfileButton({ dark = false }: { dark?: boolean }) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [isOpen, setOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  // TODO: hover effect on profile picture

  return (
    <Dropdown
      isOpen={isOpen}
      setOpen={setOpen}
      listLength={5}
      skipIndexes={[1, 2, 3]}
      placement="bottom-end"
      strategy="fixed"
      offset={4}
      motion={TRANSITION.fadeToPosition}
      preventFlip
      dark={dark}
      className="w-60 translate-x-2 rounded-xl p-2"
      buttonProps={{
        variant: "unstyled",
        size: "unstyled",
        className:
          "relative h-8 w-8 overflow-hidden rounded-full shadow-borderXS outline-none duration-500 ease-kolumb-flow hover:shadow-lg focus-visible:border-kolumblue-500",
        children: (
          <>
            <span className="pointer-events-none absolute h-10 w-1 -translate-x-4 -translate-y-4 rotate-45 rounded-full bg-white/30 duration-200 ease-in-out group-hover:translate-x-4 group-hover:translate-y-4" />
            <span className="pointer-events-none absolute h-5 w-0.5 -translate-x-5 -translate-y-5 rotate-45 rounded-full bg-white/30 duration-300 ease-in-out group-hover:translate-x-5 group-hover:translate-y-5" />

            {user && <Image src={user.imageUrl} alt="Profile picture" loading="lazy" sizes="32px" fill />}
          </>
        ),
      }}
    >
      <div className="flex w-full select-none flex-col items-center gap-1 p-2.5 pb-1">
        <Link
          href={
            process.env.NODE_ENV === "production"
              ? "https://accounts.kolumbus.app/user/profile"
              : "https://tender-gelding-62.accounts.dev/user/profile"
          }
          className="relative h-14 w-14 overflow-hidden rounded-full shadow-borderXS duration-500 ease-kolumb-flow hover:shadow-2xl"
        >
          {user && <Image src={user.imageUrl} alt="Profile picture" loading="lazy" sizes="56px" fill />}
        </Link>
        <div className="flex select-text flex-col justify-center overflow-hidden text-center">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">{user?.fullName}</span>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
            {user?.primaryEmailAddress?.emailAddress}
          </span>
        </div>
      </div>

      <Divider className="my-2 border-x-2 border-white bg-gray-100 dark:border-gray-900 dark:bg-gray-800" />

      <DropdownLink
        index={0}
        href={process.env.NODE_ENV === "production" ? "https://accounts.kolumbus.app/user" : "https://tender-gelding-62.accounts.dev/user"}
        className="gap-4"
      >
        <Icon.userSettings className="ml-2 w-4" />
        My account
      </DropdownLink>
      <DropdownOption index={1} className="gap-4">
        <Icon.userSwitch className="ml-2 w-4" />
        Switch account
        <Icon.chevron className="ml-auto mr-1 w-3 -rotate-90" />
      </DropdownOption>
      <DropdownOption index={2} className="gap-4">
        <Icon.appearance className="ml-2 w-4" />
        Appearance
        <Icon.chevron className="ml-auto mr-1 w-3 -rotate-90" />
      </DropdownOption>
      <DropdownOption index={3} className="gap-4">
        <Icon.globe className="ml-2 w-4" />
        English
        <Icon.chevron className="ml-auto mr-1 w-3 -rotate-90" />
      </DropdownOption>

      <Divider className="my-2 border-x-2 border-white bg-gray-100 dark:border-gray-900 dark:bg-gray-800" />

      <DropdownOption index={4} onClick={handleSignOut} className="gap-4">
        <Icon.signOut className="ml-2 w-4" />
        Sign out
      </DropdownOption>
    </Dropdown>
  );
}
