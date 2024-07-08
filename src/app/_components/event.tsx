import { useRef } from "react";

import { cn } from "~/lib/utils";
import type { ActivityEventSchema } from "~/lib/types";

import { ScrollIndicator } from "~/components/ui";
import ActivityImage from "~/components/dnd-itinerary/events/activity-image";

export default function Event(props: { event: ActivityEventSchema; className?: string }) {
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
        <ActivityImage event={props.event} size={82} />
      </div>

      {/* Name */}
      <div className="relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-800">
        <div ref={scrollRef} className="w-full select-none">
          {props.event?.activity?.name}
          <ScrollIndicator scrollRef={scrollRef} />
        </div>
      </div>
    </div>
  );
}
