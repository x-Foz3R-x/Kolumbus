import { memo, useRef } from "react";
import Image from "next/image";

import { EVENT_IMG_FALLBACK } from "~/lib/config";
import { cn } from "~/lib/utils";
import { Event } from "~/types";

import { Badge, ScrollIndicator } from "../../ui";

type EventOverlayProps = {
  event: Event;
  selectCount: number;
  hoverShadow?: boolean;
};
export const ActivityOverlay = memo(function EventOverlay({
  event,
  selectCount,
  hoverShadow,
}: EventOverlayProps) {
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
          <Image
            src={`${event?.photo ? `/api/get-google-image?photoRef=${event.photo}&width=156&height=82` : EVENT_IMG_FALLBACK}`}
            alt="Event Image"
            className="object-cover object-center"
            sizes="156px"
            priority
            fill
          />
        </div>

        {/* Name */}
        <div className="relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-900">
          <div ref={scrollRef} className="w-full select-none">
            {event.name}
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
