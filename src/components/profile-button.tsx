"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useClerk, useUser } from "@clerk/nextjs";
import { Dropdown, DropdownButton, DropdownProfile, DropdownSeparator } from "./ui/dropdown";
import Icon from "./icons";

export default function ProfileButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();

  const router = useRouter();
  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const className = "mr-4 w-4 fill-tintedGray-400 group-hover:fill-kolumblue-500";
  return true ? (
    <div className="relative w-fit">
      <button
        onClick={() => setIsModalOpen(true)}
        className="group relative m-3 h-8 w-8 overflow-hidden rounded-full shadow-xs outline-none duration-500 ease-kolumb-flow after:absolute after:inset-0 after:z-10 after:rounded-full after:border after:border-gray-200 hover:shadow-lg focus:after:border-kolumblue-500"
      >
        <span className="pointer-events-none absolute h-10 w-1 -translate-x-4 -translate-y-4 rotate-45 rounded-full bg-white/30 duration-200 ease-in-out group-hover:translate-x-4 group-hover:translate-y-4"></span>
        <span className="pointer-events-none absolute h-5 w-0.5 -translate-x-5 -translate-y-5 rotate-45 rounded-full bg-white/30 duration-300 ease-in-out group-hover:translate-x-5 group-hover:translate-y-5"></span>

        <Image
          src={user ? user?.imageUrl : "/images/default-avatar.png"}
          alt="Avatar"
          width={32}
          height={32}
          draggable={false}
          className="rounded-full"
        />
      </button>

      <Dropdown
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        className="fixed right-4 top-11 w-56 p-2"
      >
        <DropdownProfile
          username={user?.username || "Guest"}
          email={user?.primaryEmailAddress?.emailAddress || ""}
        />

        <DropdownSeparator />

        <DropdownButton className="h-8 w-full px-3">
          <Icon.x className={className} />
          Switch account
        </DropdownButton>

        <DropdownButton className="h-8 w-full px-3">
          <Icon.x className={className} />
          Light theme
        </DropdownButton>

        <DropdownButton className="h-8 w-full px-3">
          <Icon.x className={className} />
          English (us)
        </DropdownButton>

        <DropdownSeparator />

        <DropdownButton className="h-8 w-full px-3">
          <Icon.x className={className} />
          Account settings
        </DropdownButton>

        <DropdownButton onClick={handleSignOut} className="h-8 w-full px-3">
          <Icon.signOut className={className} />
          Sign out
        </DropdownButton>
      </Dropdown>
    </div>
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
