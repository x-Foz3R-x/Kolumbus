"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import ProfileButton from "@/components/profile-button";
import Icon from "@/components/icons";

export default function Actions() {
  const { user } = useUser();

  return user ? (
    <>
      <Link
        href="/library"
        className="relative flex items-center gap-1 rounded-lg bg-transparent fill-gray-100 px-3 py-1.5 text-sm before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:rounded-lg before:bg-gray-100 before:opacity-0 before:shadow-button before:duration-300 before:ease-kolumb-flow hover:fill-gray-900 hover:text-gray-900 before:hover:scale-100 before:hover:opacity-100 focus-visible:fill-gray-900 focus-visible:text-gray-900 before:focus-visible:scale-100 before:focus-visible:opacity-100"
      >
        Library
      </Link>
      <ProfileButton dark />
    </>
  ) : (
    <>
      {/* <Link
        href="/t/guest"
        className="relative rounded-lg bg-transparent px-3 py-1.5 text-sm before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:rounded-lg before:bg-gray-100 before:opacity-0 before:shadow-button before:duration-300 before:ease-kolumb-flow hover:text-gray-900 before:hover:scale-100 before:hover:opacity-100 focus-visible:fill-gray-900 before:focus-visible:scale-100 before:focus-visible:opacity-100"
      >
        continue as guest
      </Link> */}
      <Link
        href="/signin"
        className="relative flex items-center gap-2 rounded-lg bg-transparent fill-gray-100 px-3 py-1.5 text-sm before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:rounded-lg before:bg-gray-100 before:opacity-0 before:shadow-button before:duration-300 before:ease-kolumb-flow hover:fill-gray-900 hover:text-gray-900 before:hover:scale-100 before:hover:opacity-100 focus-visible:fill-gray-900 focus-visible:text-gray-900 before:focus-visible:scale-100 before:focus-visible:opacity-100"
      >
        <Icon.user className="h-3.5 w-3.5" />
        Sign in
      </Link>
    </>
  );
}
