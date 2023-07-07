"use client";

import Link from "next/link";
import { CheckCurrentPathname } from "@/lib/utils";

interface Props {
  link: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}

export default function ToolLink({ link, label, className, children }: Props) {
  return (
    <Link
      href={link}
      className={
        "h-[5.5rem] w-full rounded-lg hover:bg-kolumblue-100 hover:fill-kolumblue-500 hover:shadow-kolumblueHover " +
        (CheckCurrentPathname(link)
          ? "bg-kolumblue-200 fill-kolumblue-500 text-kolumblue-500 shadow-kolumblueSelected "
          : "bg-kolumblue-50 fill-tintedGray-500 shadow-kolumblueInset ") +
        className
      }
    >
      <div
        className={
          "flex h-full w-full flex-col items-center rounded-lg p-2 duration-200 ease-kolumb-overflow hover:scale-110 "
        }
      >
        {children}
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center text-sm font-medium leading-[0.875rem]">
            {label}
          </div>
        </div>
      </div>
    </Link>
  );
}
