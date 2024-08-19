import { memo, useRef } from "react";

import { cn } from "~/lib/utils";
import type { PlaceSchema } from "~/lib/types";

import PlaceImage from "./place-image";
import { Badge, ScrollIndicator } from "../../ui";

type Props = {
  place: PlaceSchema;
  selectCount: number;
  hoverShadow?: boolean;
};
export const PlaceOverlay = memo(function PlaceOverlay({ place, selectCount, hoverShadow }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <Badge content={selectCount > 1 ? selectCount : null}>
      <div
        className={cn(
          "flex h-28 w-40 cursor-grabbing flex-col overflow-hidden rounded-lg border-2 border-white bg-white font-inter shadow-borderXL",
          selectCount > 0 && "border-kolumblue-200 bg-kolumblue-200",
          hoverShadow && "shadow-borderSplashXl",
        )}
      >
        {/* Image */}
        <div className="relative h-[82px] flex-shrink-0">
          <PlaceImage src={place.imageUrl} size={82} />
        </div>

        {/* Name */}
        <div className="relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-800">
          <div ref={scrollRef} className="w-full select-none">
            {place.name}
            <ScrollIndicator
              scrollRef={scrollRef}
              className={cn(selectCount > 0 && "from-kolumblue-200")}
            />
          </div>
        </div>
      </div>
    </Badge>
  );
});
