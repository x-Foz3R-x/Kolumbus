import Link from "next/link";

import ItinerarySVG from "@/assets/svg/tools/Itinerary.svg";
import StructureSVG from "@/assets/svg/tools/Structure.svg";
import MapSVG from "@/assets/svg/tools/Map.svg";
import CostsSVG from "@/assets/svg/tools/Costs.svg";
import PackingListSVG from "@/assets/svg/tools/PackingList.svg";

const ICON = (name: string) => {
  const ClassName = "h-6 w-6 flex-none mt-[9px] mb-[3px] ";

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

interface Props {
  link: string;
  name: string;
  isSelected: boolean;
  className?: string;
}

export default function ToolLink({
  link,
  name,
  isSelected = false,
  className,
}: Props) {
  return (
    <Link
      href={link}
      className={
        "h-[5.5rem] w-full rounded-lg hover:bg-kolumblue-100 hover:fill-kolumblue-500 hover:shadow-kolumblueHover " +
        (isSelected
          ? "bg-kolumblue-200 fill-kolumblue-500 text-kolumblue-500 shadow-kolumblueSelected "
          : "bg-kolumblue-50 fill-tintedGray-500 shadow-kolumblueInset ") +
        className
      }
    >
      <div
        className={
          "flex h-full w-full flex-col items-center rounded-lg p-2 duration-200 ease-kolumb-overflow hover:scale-110 "
          // (isLongName ? "gap-2" : "gap-3")
        }
      >
        {ICON(name)}
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center text-sm font-medium leading-[0.875rem]">
            {name}
          </div>
        </div>
      </div>
    </Link>
  );
}
