import Link from "next/link";

import ItinerarySVG from "@/assets/svg/tools/itinerary.svg";
import StructureSVG from "@/assets/svg/tools/structure.svg";
import MapSVG from "@/assets/svg/tools/map.svg";
import CostsSVG from "@/assets/svg/tools/costs.svg";
import PackingListSVG from "@/assets/svg/tools/packingList.svg";

const icon = (name: string) => {
  switch (name) {
    case "Itinerary":
      return <ItinerarySVG className="h-10 w-10 flex-none p-[0.6875rem]" />;
    case "Structure":
      return <StructureSVG className="h-10 w-10 flex-none p-[0.6875rem]" />;
    case "Map":
      return <MapSVG className="h-10 w-10 flex-none p-[0.6875rem]" />;
    case "Costs":
      return <CostsSVG className="h-10 w-10 flex-none p-[0.6875rem]" />;
    case "Packing List":
      return <PackingListSVG className="h-10 w-10 flex-none p-[0.6875rem]" />;
    default:
      return;
  }
};

export default function ToolLink({ link, name, selected }: any) {
  return (
    <Link
      href={link}
      className={
        "h-10 w-full rounded-lg  p-1 " +
        (selected
          ? "bg-tintedGray-100 fill-kolumblue-500 text-kolumblue-500 "
          : "fill-tintedGray-400")
      }
    >
      <div className="flex h-full w-full items-center justify-start duration-200 ease-kolumb-overflow hover:translate-x-2">
        {icon(name)}
        <div className="mx-1 w-full text-base font-medium">{name}</div>
      </div>
    </Link>
  );
}
