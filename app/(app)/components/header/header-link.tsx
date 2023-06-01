import Link from "next/link";

import StartSVG from "@/assets/svg/Home.svg";
import ExploreSVG from "@/assets/svg/Explore.svg";
import LibrarySVG from "@/assets/svg/Library.svg";
import MarketSVG from "@/assets/svg/Market.svg";
import ShowcaseSVG from "@/assets/svg/Showcase.svg";

const ICON = (name: string) => {
  const ClassName = "h-4 w-4 flex-none ";

  switch (name) {
    case "Start":
      return <StartSVG className={ClassName} />;
    case "Explore":
      return <ExploreSVG className={ClassName} />;
    case "Library":
      return <LibrarySVG className={ClassName} />;
    case "Market":
      return <MarketSVG className={ClassName} />;
    case "Showcase":
      return <ShowcaseSVG className={ClassName} />;
    default:
      return;
  }
};

export default function HeaderLink({ link, name }: any) {
  return (
    <Link
      href={link}
      className={
        "flex h-9 flex-none items-center gap-3 rounded-lg fill-tintedGray-400 px-4 font-medium hover:bg-kolumblue-100 hover:fill-kolumblue-500 "
      }
    >
      {ICON(name)}
      {name}
    </Link>
  );
}
