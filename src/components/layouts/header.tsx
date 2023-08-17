import Link from "next/link";

import { AuthProvider } from "@/context/auth";

import ProfileButton from "@/components/profile-button";
// import FullLogo from "@/assets/kolumbus/full-logo.svg";
import Icon from "@/components/icons";

export default function Header() {
  const linkStyle =
    "flex h-9 flex-none items-center gap-3 rounded-lg fill-tintedGray-400 px-4 font-medium hover:bg-kolumblue-100 hover:fill-kolumblue-500 ";
  const linkSvgStyle = "h-4 w-4 flex-none ";

  return (
    <header className="relative z-50 flex h-14 w-full select-none items-center justify-between  font-normal">
      <nav className="h-14 w-56 flex-none">
        <Link href="/" className="m-auto my-4 flex w-fit justify-center hover:animate-bounce">
          <Icon.logo className="h-6 fill-kolumblue-500" />
        </Link>
      </nav>

      <nav className="flex h-full w-full items-center justify-center px-3 font-normal">
        <Link href={"/start"} className={linkStyle}>
          <Icon.explore className={linkSvgStyle} />
          <p>Explore</p>
        </Link>

        <div className="m-3 h-5 border-r border-gray-200"></div>

        <Link href={"/start"} className={linkStyle}>
          <Icon.library className={linkSvgStyle} />
          <p>Library</p>
        </Link>

        <div className="m-3 h-5 border-r border-gray-200"></div>

        <Link href={"/start"} className={linkStyle}>
          <Icon.market className={linkSvgStyle} />
          <p>Market</p>
        </Link>

        <div className="m-3 h-5 border-r border-gray-200"></div>

        <Link href={"/start"} className={linkStyle}>
          <Icon.showcase className={linkSvgStyle} />
          <p>Showcase</p>
        </Link>
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
