import { memo, useRef } from "react";
import Image from "next/image";

import type { ActivityEventSchema } from "~/lib/validations/event";
import { cn } from "~/lib/utils";

import { Badge, ScrollIndicator } from "../../ui";
import { getActivityImageUrl } from ".";
import { eventFallbackUrl } from "~/lib/constants";

type EventOverlayProps = {
  event: ActivityEventSchema;
  selectCount: number;
  hoverShadow?: boolean;
};
export const ActivityOverlay = memo(function ActivityOverlay({
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
          {getActivityImageUrl(event).startsWith("/") ||
          getActivityImageUrl(event).startsWith(eventFallbackUrl) ? (
            <Image
              src={getActivityImageUrl(event)}
              alt="Event Image"
              className="select-none object-cover object-center"
              sizes="156px"
              priority
              fill
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getActivityImageUrl(event)}
              alt="Event Image"
              className="select-none object-cover object-center"
            />
          )}
        </div>

        {/* Name */}
        <div className="relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-800">
          <div ref={scrollRef} className="w-full select-none">
            {event.activity.name}
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
