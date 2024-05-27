"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Icon from "@/components/icons";

/**
 * Compares the current URL pathname with the provided URL.
 * @param url - The URL to compare with the current URL pathname.
 * @returns True if the current URL pathname matches the provided URL, false otherwise.
 */
export function compareURLs(url: string): boolean {
  return usePathname() === url ? true : false; // eslint-disable-line react-hooks/rules-of-hooks
}

export default function Tools({ tripId }: { tripId: string }) {
  const Tile = forwardRef<HTMLAnchorElement, { href: string; className?: string; children?: React.ReactNode }>(
    ({ href, className, children }, ref) => {
      return (
        <Link
          ref={ref}
          href={href}
          className={cn(
            "rounded-lg bg-gray-50 fill-tintedGray-400 text-gray-700 shadow-kolumblueInset hover:bg-gray-100 hover:shadow-kolumblueHover",
            compareURLs(href) && "bg-kolumblue-100 fill-kolumblue-500 text-kolumblue-500 shadow-kolumblueSelected",
            className,
          )}
        >
          <div className="flex flex-col items-center gap-3 py-4 text-center text-sm font-medium duration-200 ease-kolumb-overflow hover:scale-110">
            {children}
          </div>
        </Link>
      );
    },
  );
  Tile.displayName = "Tile";
  const MotionTile = motion(Tile);

  return (
    <section className="grid grid-cols-2 flex-col items-center gap-2 px-3">
      <MotionTile href={`/t/${tripId}`} whileTap={{ scale: 0.94 }}>
        <Icon.itinerary className="h-6 w-6 flex-none" />
        Itinerary
      </MotionTile>

      {/* <MotionTile href={`/t/${tripId}/structure`} whileTap={{ scale: 0.94 }}>
        <Icon.structure className="h-6 w-6 flex-none" />
        Structure
      </MotionTile> */}

      <MotionTile href={`/t/${tripId}/map`} whileTap={{ scale: 0.94 }}>
        <Icon.map className="h-6 w-6 flex-none" />
        Map
      </MotionTile>

      <MotionTile href={`/t/${tripId}/expenses`} whileTap={{ scale: 0.94 }}>
        <Icon.costs className="h-6 w-6 flex-none" />
        Expenses
      </MotionTile>

      <MotionTile href={`/t/${tripId}/packing-list`} whileTap={{ scale: 0.94 }}>
        <Icon.packingList className="h-6 w-6 flex-none" />
        Packing List
      </MotionTile>
    </section>
  );
}
