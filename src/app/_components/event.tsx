import { useRef } from "react";
import Image from "next/image";

import { cn } from "~/lib/utils";
import { ScrollIndicator } from "~/components/ui";

export type Event = { name: string; image: string };
export default function Event({ event, className }: { event: Event; className?: string }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={cn(
        "absolute flex h-28 w-40 flex-col overflow-hidden rounded-lg border-2 border-white bg-white shadow-borderXL",
        className,
      )}
    >
      {/* Image */}
      <div className="relative h-[82px] flex-shrink-0">
        <Image
          src={`/api/get-google-image?imageRef=${event.image}&width=156&height=82`}
          alt="Event Image"
          className="object-cover object-center"
          sizes="312px"
          priority
          fill
        />
      </div>

      {/* Name */}
      <div className="relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-800">
        <div ref={scrollRef} className="w-full select-none">
          {event.name}
          <ScrollIndicator scrollRef={scrollRef} />
        </div>
      </div>
    </div>
  );
}
