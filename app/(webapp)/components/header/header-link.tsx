import Link from "next/link";

import StartSVG from "@/assets/svg/Home.svg";
import LibrarySVG from "@/assets/svg/Library.svg";
import TripStoreSVG from "@/assets/svg/TripStore.svg";
import ShowcaseSVG from "@/assets/svg/Showcase.svg";

const ICON = (name: string) => {
  const ClassName = "h-4 w-4 flex-none ";

  switch (name) {
    case "Start":
      return <StartSVG className={ClassName} />;
    case "Library":
      return <LibrarySVG className={ClassName} />;
    case "Store":
      return <TripStoreSVG className={ClassName} />;
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
      className="flex h-10 flex-none items-center gap-3 rounded-lg fill-tintedGray-400 px-4 hover:bg-gray-100 hover:fill-kolumblue-500"
    >
      {ICON(name)}
      {name}
    </Link>
  );
}
