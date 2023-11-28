"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useClerk, useUser } from "@clerk/nextjs";
import Icon from "./icons";
import { Dropdown, DropdownList, DropdownOption } from "./ui/dropdown";
import { DropdownButton, DropdownOld, DropdownProfile, DropdownSeparator } from "./ui/dropdown-old";
import Divider from "./ui/divider";

export default function ProfileButton() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [isOpen, setOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const list = useRef<DropdownList>([
    { index: 0, skip: true },
    { index: 1, skip: true },
    { index: 2, skip: true },
    {
      index: 3,
      onSelect: () => {
        router.push("https://accounts.kolumbus.app/user");
      },
    },
    { index: 4, onSelect: handleSignOut },
  ]);

  return true ? (
    <Dropdown
      isOpen={isOpen}
      setOpen={setOpen}
      list={list.current}
      placement="bottom-end"
      strategy="fixed"
      position={{ x: "calc(100% - 244px)", y: "48px" }}
      className="w-56 rounded-xl p-1.5"
      buttonProps={{
        variant: "unstyled",
        size: "unstyled",
        className:
          "relative h-8 w-8 overflow-hidden rounded-full shadow-xs outline-none duration-500 ease-kolumb-flow after:absolute after:inset-0 after:z-10 after:rounded-full after:border after:border-gray-200 hover:shadow-lg focus:after:border-kolumblue-500",
        children: (
          <>
            <span className="pointer-events-none absolute h-10 w-1 -translate-x-4 -translate-y-4 rotate-45 rounded-full bg-white/30 duration-200 ease-in-out group-hover:translate-x-4 group-hover:translate-y-4" />
            <span className="pointer-events-none absolute h-5 w-0.5 -translate-x-5 -translate-y-5 rotate-45 rounded-full bg-white/30 duration-300 ease-in-out group-hover:translate-x-5 group-hover:translate-y-5" />

            <Image src={user ? user?.imageUrl : "/images/default-avatar.png"} alt="Profile picture" width={32} height={32} />
          </>
        ),
      }}
    >
      <div className="flex w-full select-none flex-col items-center gap-1 p-3 pb-1">
        <div className="overflow-hidden rounded-full shadow-xs duration-500 ease-kolumb-flow hover:shadow-lg">
          <Image src={user ? user?.imageUrl : "/images/default-avatar.png"} alt="Profile picture" width={48} height={48} />
        </div>
        <div className="flex w-48 flex-none select-text flex-col justify-around text-center">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">{user?.username || "Guest"}</span>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500">
            {user?.primaryEmailAddress?.emailAddress || ""}
          </span>
        </div>
      </div>

      <Divider className="my-2" />

      <DropdownOption index={0} className="gap-5">
        <Icon.x className="w-4" />
        Switch Account
      </DropdownOption>
      <DropdownOption index={1} className="gap-5">
        <Icon.x className="w-4" />
        Appearance: Light
      </DropdownOption>
      <DropdownOption index={2} className="gap-5">
        <Icon.x className="w-4" />
        Language: English
      </DropdownOption>

      <Divider className="my-2" />

      <DropdownOption index={3} className="gap-5">
        <Icon.x className="w-4" />
        Account settings
      </DropdownOption>
      <DropdownOption index={4} className="gap-5" wrapperClassName="before:rounded-b-lg">
        <Icon.signOut className="w-4" />
        Sign out
      </DropdownOption>
    </Dropdown>
  ) : (
    <section className="flex h-14 w-fit flex-none items-center px-2 font-medium">
      <span className="flex flex-none cursor-default items-center gap-1 px-2">
        <Icon.x className="h-4 w-4" />
        <span className="w-10 text-center text-xs leading-3">Guest Mode</span>
      </span>

      <div className="m-2 h-5 border-r border-gray-200"></div>

      <button
        onClick={handleSignOut}
        className="rounded-lg px-2 py-1 text-sm duration-200 ease-kolumb-flow hover:scale-110 hover:bg-kolumblue-100 hover:fill-kolumblue-500"
      >
        Sign in
      </button>
    </section>
  );
}
