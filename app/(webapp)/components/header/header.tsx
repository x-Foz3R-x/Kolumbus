import Link from "next/link";
import HeaderLink from "./header-link";

import ProfileButton from "@/components/ui/profile-button";
import FullLogo from "@/assets/logo/full-logo.svg";

export default function Header() {
  return (
    <header className="relative z-50 flex h-14 w-full select-none items-center justify-between font-normal shadow-kolumbus">
      <nav className="h-14 w-56 flex-none">
        <Link href="/">
          <FullLogo className="m-auto my-4 h-6 w-[10.5rem] fill-kolumblue-500 duration-300 ease-kolumb-flow hover:scale-110" />
        </Link>
      </nav>
      <nav className="flex h-full w-full items-center justify-center px-3 font-normal">
        <HeaderLink link="/start" name="Start" />
        <div className="m-3 h-5 border-r"></div>
        <HeaderLink link="/start" name="Library" />
        <div className="m-3 h-5 border-r"></div>
        <HeaderLink link="/start" name="Store" />
        <div className="m-3 h-5 border-r"></div>
        <HeaderLink link="/start" name="Showcase" />
      </nav>
      <section className="flex h-14 w-56 min-w-fit justify-end">
        {/* <button>DARKMODE button</button> */}
        <ProfileButton />
      </section>
    </header>
  );
}
