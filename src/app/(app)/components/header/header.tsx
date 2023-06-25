import Link from "next/link";

import { AuthProvider } from "@/context/auth";
import HeaderLink from "./header-link";

import ProfileButton from "@/app/(app)/components/header/ProfileButton";
import FullLogo from "@/assets/kolumbus/full-logo.svg";

export default function Header() {
  return (
    <header className="relative z-50 flex h-14 w-full select-none items-center justify-between bg-white font-normal">
      <nav className="h-14 w-56 flex-none">
        <Link
          href="/"
          className="m-auto my-4 flex w-fit justify-center hover:animate-bounce"
        >
          <FullLogo className="h-6 fill-kolumblue-500" />
        </Link>
      </nav>
      <nav className="flex h-full w-full items-center justify-center px-3 font-normal">
        <HeaderLink link="/start" name="Explore" />
        <div className="m-3 h-5 border-r border-kolumbGray-200"></div>
        <HeaderLink link="/start" name="Library" />
        <div className="m-3 h-5 border-r border-kolumbGray-200"></div>
        <HeaderLink link="/start" name="Market" />
        <div className="m-3 h-5 border-r border-kolumbGray-200"></div>
        <HeaderLink link="/start" name="Showcase" />
      </nav>
      <section className="mr-4 flex h-14 w-56 flex-none justify-end">
        {/* <button>DARKMODE button</button> */}
        <AuthProvider>
          <ProfileButton />
        </AuthProvider>
      </section>
    </header>
  );
}
