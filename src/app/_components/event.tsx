import { useRef } from "react";

import { cn } from "~/lib/utils";
import type { PlaceSchema } from "~/lib/types";

import { ScrollIndicator } from "~/components/ui";
import PlaceImage from "~/components/dnd-itinerary/place/place-image";

export default function Place(props: { place: PlaceSchema; className?: string }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={cn(
        "absolute flex h-28 w-40 flex-col overflow-hidden rounded-lg border-2 border-white bg-white shadow-borderXL",
        props.className,
      )}
    >
      {/* Image */}
      <div className="relative h-[82px] flex-shrink-0 overflow-hidden">
        <PlaceImage imageUrl={props.place.imageUrl} size={82} />
      </div>

      {/* Name */}
      <div className="relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-800">
        <div ref={scrollRef} className="w-full select-none">
          {props.place.name}
          <ScrollIndicator scrollRef={scrollRef} />
        </div>
      </div>
    </div>
  );
}
