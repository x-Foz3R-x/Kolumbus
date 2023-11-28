import Link from "next/link";
import ProfileButton from "@/components/profile-button";
import Icon from "@/components/icons";

export default function Header() {
  const linkStyle =
    "h-9 flex-none flex items-center gap-3 rounded-md fill-tintedGray-400 px-4 font-medium hover:bg-gray-100 hover:fill-tintedGray-500";
  const linkSvgStyle = "h-4 w-4 flex-none";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between bg-white">
      <div className="h-14 w-56 flex-none">
        <Link href="/" title="Home page" aria-label="Home page" className="m-auto my-4 flex w-fit justify-center">
          <Icon.logo className="h-6" />
        </Link>
      </div>

      <div className="flex h-full w-full items-center justify-center px-3">
        {/* <Link href="/" className={linkStyle}>
          <Icon.market className={linkSvgStyle} />
          Market
        </Link> */}

        <Link href="/library" className={linkStyle}>
          <Icon.library className={linkSvgStyle} />
          Library
        </Link>

        {/* <Link href="/" className={linkStyle}>
          <Icon.showcase className={linkSvgStyle} />
          Showcase
        </Link> */}
      </div>

      <section className="flex h-14 w-56 flex-none items-center justify-end gap-4 pr-8">
        <ProfileButton />
      </section>
    </nav>
  );
}
