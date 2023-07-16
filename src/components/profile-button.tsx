"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useAuth } from "@/context/auth";

import {
  Dropdown,
  DropdownButton,
  DropdownProfile,
  DropdownSeparator,
} from "./ui/dropdown";

import SwitchAccountSVG from "@/assets/svg/SwitchAccount.svg";
import AppearanceSVG from "@/assets/svg/Appearance.svg";
import GlobeSVG from "@/assets/svg/Globe.svg";
import AccountSettingsSVG from "@/assets/svg/AccountSettings.svg";
import SignOutSVG from "@/assets/svg/SignOut.svg";
import UserSVG from "@/assets/svg/User.svg";

export default function ProfileButton() {
  const { currentUser, signout } = useAuth();

  const isUser: boolean = currentUser == null ? true : false;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const handleSignOut = () => {
    signout();
    router.push("/signin");
  };

  const className =
    "mr-4 w-4 fill-tintedGray-500 group-hover:fill-kolumblue-500";
  return currentUser ? (
    <div className="relative w-fit">
      <button
        onClick={() => setIsModalOpen(true)}
        className="relative h-14 w-14 rounded-full p-3 outline-none after:absolute after:left-3 after:top-3 after:hidden after:h-8 after:w-8 after:rounded-full after:border-2 after:border-kolumblue-500 focus:shadow-none focus:after:inline"
      >
        <Image
          src="/images/default-avatar.png"
          alt="default avatar picture"
          width={32}
          height={32}
          draggable={false}
          className="rounded-full"
        />
      </button>

      <Dropdown
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        className="fixed right-4 top-11 w-60 p-2"
      >
        <DropdownProfile
          username={currentUser?.displayName}
          email={currentUser?.email}
        />

        <DropdownSeparator />

        <DropdownButton className="h-9 w-full px-4">
          <SwitchAccountSVG className={className} />
          Switch account
        </DropdownButton>

        <DropdownButton className="h-9 w-full px-4">
          <AppearanceSVG className={className} />
          Light theme
        </DropdownButton>

        <DropdownButton className="h-9 w-full px-4">
          <GlobeSVG className={className} />
          English (us)
        </DropdownButton>

        <DropdownSeparator />

        <DropdownButton className="h-9 w-full px-4">
          <AccountSettingsSVG className={className} />
          Account settings
        </DropdownButton>

        <DropdownButton onClick={handleSignOut} className="h-9 w-full px-4">
          <SignOutSVG className={className} />
          Sign out
        </DropdownButton>
      </Dropdown>
    </div>
  ) : (
    <section className="flex h-14 w-fit flex-none items-center px-2 font-medium">
      <span className="flex flex-none cursor-default items-center gap-1 px-2">
        <UserSVG className="h-4 w-4" />
        <span className="w-10 text-center text-xs leading-3">Guest Mode</span>
      </span>

      <div className="m-2 h-5 border-r border-kolumbGray-200"></div>

      <button
        onClick={handleSignOut}
        className="rounded-lg px-2 py-1 text-sm duration-200 ease-kolumb-flow hover:scale-110 hover:bg-kolumblue-100 hover:fill-kolumblue-500"
      >
        Sign in
      </button>
    </section>
  );
}
