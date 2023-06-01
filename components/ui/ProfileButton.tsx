"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Modal from "./modal/Modal";
import ModalButton from "./modal/ModalButton";
import ModalProfile from "./modal/ModalProfile";
import ModalSeparator from "./modal/ModalSeparator";

import SwitchAccountSVG from "@/assets/svg/SwitchAccount.svg";
import AppearanceSVG from "@/assets/svg/Appearance.svg";
import GlobeSVG from "@/assets/svg/Globe.svg";
import AccountSettingsSVG from "@/assets/svg/AccountSettings.svg";
import SignOutSVG from "@/assets/svg/SignOut.svg";

export default function ProfileButton() {
  const { currentUser, signout } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const handleSignOut = () => {
    signout();
    router.push("/signin");
  };

  console.log(currentUser);

  const className =
    "mr-4 w-4 fill-tintedGray-400 group-hover:fill-kolumblue-500";
  return (
    <div className="relative">
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

      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        className="fixed right-4 top-11 w-60 p-2"
      >
        <ModalProfile
          username={currentUser?.displayName}
          email={currentUser?.email}
        />

        <ModalSeparator />

        <ModalButton className="h-9 w-full px-4">
          <SwitchAccountSVG className={className} />
          Switch account
        </ModalButton>

        <ModalButton className="h-9 w-full px-4">
          <AppearanceSVG className={className} />
          Light theme
        </ModalButton>

        <ModalButton className="h-9 w-full px-4">
          <GlobeSVG className={className} />
          English (us)
        </ModalButton>

        <ModalSeparator />

        <ModalButton className="h-9 w-full px-4">
          <AccountSettingsSVG className={className} />
          Account settings
        </ModalButton>

        <ModalButton onClick={handleSignOut} className="h-9 w-full px-4">
          <SignOutSVG className={className} />
          Sign out
        </ModalButton>
      </Modal>
    </div>
  );
}
