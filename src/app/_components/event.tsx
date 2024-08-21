import { cn } from "~/lib/utils";
import type { PlaceSchema } from "~/lib/types";

import PlaceImage from "~/components/dnd-itinerary/place/place-image";
import { ScrollIndicator } from "~/components/ui";

export default function Place(props: { place: PlaceSchema; className?: string }) {
  return (
    <div
      className={cn(
        "absolute flex h-28 w-40 flex-col overflow-hidden rounded-lg border-2 border-white bg-white shadow-borderXL",
        props.className,
      )}
    >
      {/* Image */}
      <div className="relative h-[82px] flex-shrink-0 overflow-hidden">
        <PlaceImage src={props.place.imageUrl} size={82} />
      </div>

      {/* Name */}
      <ScrollIndicator className="relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-800">
        <div className="w-full select-none">{props.place.name}</div>
      </ScrollIndicator>
    </div>
  );
}
