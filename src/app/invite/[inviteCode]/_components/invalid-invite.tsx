"use client";

import Link from "next/link";
import { cn } from "~/lib/utils";
import { inviteError } from "~/lib/constants";
import { ButtonVariants } from "~/components/ui";
import X from "~/components/ui/icons/x";

export default function InvalidInvite({ code }: { code: 0 | 1 | 2 }) {
  return (
    <>
      <X size={72} strokeWidth={8} className="text-gray-600" />

      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-center text-xs font-bold">YOU RECEIVED INVITE, BUT...</p>
        <h1 className="text-2xl font-semibold text-red-500">{inviteError.title[code]}</h1>
        <p className="whitespace-pre-line text-center text-sm">{inviteError.message[code]}</p>
      </div>

      <div className="mt-2 flex w-full flex-col gap-2">
        <Link
          href="/library"
          className={cn(
            ButtonVariants({ size: "lg" }),
            "hover:bg-kolumblue-550 block w-full rounded-lg bg-kolumblue-500 py-2.5 text-center font-medium text-white",
          )}
        >
          Continue to library
        </Link>
        <Link
          href="/invite/invalid"
          target="_blank"
          className="text-[13px] font-medium text-kolumblue-500 hover:underline"
        >
          Why is my invite invalid?
        </Link>
      </div>
    </>
  );
}
