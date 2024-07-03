"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { cva } from "class-variance-authority";

import { cn } from "~/lib/utils";
import { accountUrl } from "~/lib/constants";

import { Menu, MenuLink, MenuOption } from "../ui/menu";
import { Divider, Icons } from "../ui";

export const Variants = cva(
  "relative flex h-6 items-center text-[13px] tracking-[-0.2px] before:absolute before:inset-y-0 before:rounded before:hover:bg-black/10",
  {
    variants: {
      variant: {
        default: "px-2.5 font-medium tracking-[-0.2px] before:-left-1 before:-right-1",
        app: "font-bold tracking-normal before:-left-1 before:-right-1 px-2.5",
        icon: "px-2 before:-left-0.5 before:-right-0.5",
        tlCorner: "pl-3.5 pr-2.5 font-medium before:left-0 before:-right-1 before:rounded-tl-xl",
        trCorner: "pr-3.5 pl-2.5 font-medium before:right-0 before:-left-1 before:rounded-tr-xl",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export default function MenuBar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const [currentTime, setCurrentTime] = useState(new Date("2025-01-01"));

  // Update time every minute
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 180000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10 flex h-9 w-full items-center justify-between whitespace-nowrap bg-white/60 fill-gray-800 px-1.5 backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
      <div className="flex items-center">
        <Link href="/" className={Variants({ variant: "tlCorner" })}>
          <Icons.logo className="h-[15px]" />
        </Link>
        <Link href="/signin" className={Variants({ variant: "app" })}>
          {/* Try it yourself */}
          Start Your Adventure
        </Link>
        <Link href="/contact" className={Variants()}>
          Help
        </Link>
      </div>

      <div className="flex items-center">
        <SignedIn>
          <Link href="/library" className={Variants({ variant: "icon" })}>
            <Icons.library className="h-[15px]" />
          </Link>
        </SignedIn>

        {/* Control center */}
        <Menu
          placement="bottom"
          offset={{ mainAxis: 7 }}
          animation="fade"
          className="rounded-lg bg-white/60 shadow-borderSplashXl backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter"
          buttonProps={{
            variant: "unset",
            size: "unset",
            className: Variants({ variant: "icon" }),
            children: <Icons.controlCenter className="h-[15px]" />,
          }}
        >
          <SignedIn>
            <div className="flex w-full select-none items-center gap-2 p-2 pb-1.5">
              <Link href={accountUrl} className="relative size-9 overflow-hidden rounded-full">
                {user && (
                  <Image
                    src={user.imageUrl}
                    alt="Profile picture"
                    loading="lazy"
                    sizes="56px"
                    fill
                  />
                )}
              </Link>

              <div className="pr-2.5">
                <div className="text-[13px] leading-none">{user?.fullName} Knot</div>
                <div className="text-[11px] text-gray-600">
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>
            </div>

            <div className="px-2">
              <Divider className="my-2 bg-gray-200" />
            </div>

            <MenuLink
              label="my account"
              href={accountUrl}
              variant="unset"
              size="unset"
              className="h-fit items-center gap-2 rounded fill-gray-800 px-2 py-0.5 text-[13px] font-medium duration-0 group-focus:translate-x-0 group-focus:bg-kolumblue-500 group-focus:fill-white group-focus:text-white"
              classNames={{ button: "before:hidden" }}
            >
              My account
            </MenuLink>
            <MenuOption
              label="appearance"
              variant="unset"
              size="unset"
              className="h-fit items-center gap-2 rounded fill-gray-800 px-2 py-0.5 text-[13px] font-medium duration-0 group-focus:translate-x-0 group-focus:bg-kolumblue-500 group-focus:fill-white group-focus:text-white"
              classNames={{ button: "before:hidden" }}
              disabled
            >
              Appearance
              <Icons.chevron className="ml-auto h-1.5 -rotate-90" />
            </MenuOption>
            <MenuOption
              label="language"
              variant="unset"
              size="unset"
              className="h-fit items-center gap-2 rounded fill-gray-800 px-2 py-0.5 text-[13px] font-medium duration-0 group-focus:translate-x-0 group-focus:bg-kolumblue-500 group-focus:fill-white group-focus:text-white"
              classNames={{ button: "before:hidden" }}
              disabled
            >
              Language
              <Icons.chevron className="ml-auto h-1.5 -rotate-90" />
            </MenuOption>
            <div className="px-2">
              <Divider className="my-2 bg-gray-200" />
            </div>
            <MenuOption
              label="sign out"
              onClick={handleSignOut}
              variant="unset"
              size="unset"
              className="h-fit items-center gap-2 rounded fill-gray-800 px-2 py-0.5 text-[13px] font-medium duration-0 group-focus:translate-x-0 group-focus:bg-kolumblue-500 group-focus:fill-white group-focus:text-white"
              classNames={{ button: "before:hidden" }}
            >
              Sign out
            </MenuOption>
          </SignedIn>

          <SignedOut>
            <MenuLink
              label="sign in"
              href="signin"
              variant="unset"
              size="unset"
              className="h-fit items-center gap-2 rounded fill-gray-800 px-2 py-0.5 text-[13px] font-medium duration-0 group-focus:translate-x-0 group-focus:bg-kolumblue-500 group-focus:fill-white group-focus:text-white"
              classNames={{ button: "before:hidden" }}
            >
              Sign in
            </MenuLink>
            <MenuLink
              label="sing up"
              href="/signup"
              variant="unset"
              size="unset"
              className="h-fit items-center gap-2 rounded fill-gray-800 px-2 py-0.5 text-[13px] font-medium duration-0 group-focus:translate-x-0 group-focus:bg-kolumblue-500 group-focus:fill-white group-focus:text-white"
              classNames={{ button: "before:hidden" }}
            >
              Sign up
            </MenuLink>
          </SignedOut>
        </Menu>

        {/* Clock */}
        <div
          className={cn(Variants({ variant: "trCorner" }), "flex gap-[5px] pr-3 before:-left-0.5")}
        >
          <span>{format(currentTime, "E")}</span>
          <span>{format(currentTime, "d")}</span>
          <span>{format(currentTime, "MMM")}</span>
          <span>{format(currentTime, "h:mm a")}</span>
        </div>
      </div>
    </div>
  );
}
