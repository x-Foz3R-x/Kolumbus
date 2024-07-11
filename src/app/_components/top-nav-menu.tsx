"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";

import { accountUrl } from "~/lib/constants";
import { EASING } from "~/lib/motion";

import SlideAnimation from "./slide-animation";
import { Menu, MenuLink, MenuOption } from "~/components/ui/menu";
import { Divider, Icons } from "~/components/ui";

export default function TopNavMenu() {
  const { signOut } = useClerk();
  const router = useRouter();

  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="absolute right-8 h-16 overflow-hidden py-3.5 pl-0.5">
      <SlideAnimation direction="in" threshold={100} className="mr-0.5">
        <Menu
          isOpen={isMenuOpen}
          setIsOpen={setMenuOpen}
          placement="bottom-end"
          rootSelector="nav"
          offset={({ rects }) => ({ mainAxis: -rects.reference.height })}
          className="whitespace-nowrap rounded bg-kolumblue-500 p-0 font-belanosima outline outline-1 outline-offset-1 outline-kolumblue-500 duration-400 ease-kolumb-flow"
          customAnimation={{
            initial: {
              backgroundColor: "#4999e9",
              width: "80px",
              height: "36px",
              borderRadius: "4px",
            },
            animate: {
              backgroundColor: "white",
              width: "150px",
              height: "176px",
              borderRadius: "12px",
              transition: { ease: EASING.kolumbFlow, duration: 0.4 },
            },
            exit: {
              backgroundColor: "#4999e9",
              width: "80px",
              height: "36px",
              borderRadius: "16px",
              transition: { ease: EASING.kolumbFlow, duration: 0.4 },
            },
          }}
          buttonProps={{
            variant: "unset",
            size: "unset",
            animate: { opacity: isMenuOpen ? 0 : 1 },
            transition: { duration: 0, delay: isMenuOpen ? 0 : 0.4 },
            className:
              "text-lg w-20 py-1 rounded-2xl bg-kolumblue-500 text-white outline outline-1 hover:rounded focus:rounded ease-kolumb-flow duration-400 outline-offset-1 outline-kolumblue-500 focus:outline-kolumblue-500 focus:outline focus:outline-1",
            children: "Menu",
          }}
        >
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="ml-auto h-8 w-20 flex-shrink-0 overflow-hidden py-1 text-lg"
          >
            <motion.div
              animate={{ translateY: -28 }}
              exit={{ translateY: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white"
            >
              Menu
            </motion.div>
            <motion.div
              animate={{ translateY: -28 }}
              exit={{ translateY: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600"
            >
              Close
            </motion.div>
          </button>

          <div className="px-1.5">
            <SignedIn>
              <MenuLink href="/library" label="library" className="text-base text-gray-600">
                <Icons.library className="ml-2 h-4 w-4" />
                Library
              </MenuLink>

              <Divider className="my-2 bg-kolumblue-400" />

              <MenuLink label="my account" href={accountUrl} className="text-base text-gray-600">
                <Icons.userSettings className="ml-2 h-4 w-4" />
                My account
              </MenuLink>
              <MenuOption
                label="sign out"
                onClick={handleSignOut}
                className="text-base text-gray-600"
              >
                <Icons.signOut className="ml-2 h-4 w-4" />
                Sign out
              </MenuOption>
            </SignedIn>

            <SignedOut>
              <MenuLink href="/about-me" label="about me" className="text-base text-gray-600">
                About me
              </MenuLink>
              <MenuLink href="/contact" label="contact" className="text-base text-gray-600">
                Contact
              </MenuLink>
              <MenuLink href="/signin" label="sign in" className="text-base text-gray-600">
                Sign in
              </MenuLink>
              <MenuLink href="/signup" label="sign up" className="text-base text-gray-600">
                Sign up
              </MenuLink>
            </SignedOut>
          </div>
        </Menu>
      </SlideAnimation>
    </div>
  );
}
