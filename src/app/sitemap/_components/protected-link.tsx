"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function ProtectedLink(props: { href: string; children: React.ReactNode }) {
  const user = useAuth();
  if (!user.isSignedIn) return null;

  return (
    <Link href={props.href} className="group flex min-w-56 items-center gap-2">
      <span className="mb-1 font-inconsolata text-5xl font-light text-gray-500 duration-500 ease-kolumb-flow group-hover:-rotate-[25deg] group-hover:text-kolumblue-500">
        /
      </span>
      <span className="text-sm font-medium uppercase text-gray-700 duration-500 ease-kolumb-flow group-hover:text-kolumblue-500">
        {props.children}
      </span>
    </Link>
  );
}
