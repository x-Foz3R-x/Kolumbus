"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

import { ButtonVariants } from "@/components/ui";
import ProfileButton from "@/components/profile-button";

export default function Actions() {
  const { user } = useUser();

  return user ? (
    <>
      <Link href="/library" className={cn(ButtonVariants({ variant: "scale", size: "lg" }), "before:bg-gray-100")}>
        Library
      </Link>
      <ProfileButton />
    </>
  ) : (
    <>
      <Link href="/sign-in" className={cn(ButtonVariants({ variant: "scale", size: "lg" }), "flex items-center gap-2 before:bg-gray-100")}>
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="block w-fit select-none text-nowrap rounded-xl bg-kolumblue-500 px-4.5 py-2 font-belanosima font-semibold text-white shadow-lg"
      >
        Start Your Adventure
      </Link>
    </>
  );
}
