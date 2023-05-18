import Link from "next/link";

import ItinerarySVG from "@/assets/svg/tools/itinerary.svg";
import StructureSVG from "@/assets/svg/tools/structure.svg";
import MapSVG from "@/assets/svg/tools/map.svg";
import CostsSVG from "@/assets/svg/tools/costs.svg";
import PackingListSVG from "@/assets/svg/tools/packingList.svg";

const ICON = (name: string) => {
  const ClassName = "h-6 w-6 flex-none ";

  switch (name) {
    case "Itinerary":
      return <ItinerarySVG className={ClassName} />;
    case "Structure":
      return <StructureSVG className={ClassName} />;
    case "Map":
      return <MapSVG className={ClassName} />;
    case "Costs":
      return <CostsSVG className={ClassName} />;
    case "Packing List":
      return <PackingListSVG className={ClassName} />;
    default:
      return;
  }
};

export default function ToolLink({
  link,
  name,
  isLongName = false,
  isSelected = false,
}: any) {
  return (
    <Link
      href={link}
      className={
        "h-[5.5rem] w-full rounded-lg hover:bg-kolumblue-100 hover:fill-kolumblue-500 hover:shadow-kolumbus " +
        (isSelected
          ? "bg-gray-200 fill-kolumblue-500 text-kolumblue-500 shadow-kolumbus "
          : "bg-kolumblue-50 fill-tintedGray-400 shadow-inner")
      }
    >
      <div
        className={
          "flex h-full w-full flex-col items-center justify-center rounded-lg p-2 duration-200 ease-kolumb-overflow hover:scale-110 " +
          (isLongName ? "gap-2" : "gap-3")
        }
      >
        {ICON(name)}
        <div className="text-center text-sm font-medium leading-[1.125rem]">
          {name}
        </div>
      </div>
    </Link>
  );
}
