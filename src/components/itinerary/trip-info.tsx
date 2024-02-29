import { useMemo } from "react";
import { format, formatDistanceToNow, isBefore, subMonths } from "date-fns";

import { USER_ROLE } from "@/lib/config";
import { Trip } from "@/types";

import { Button, Progress } from "../ui";

export function TripInfo({ activeTrip }: { activeTrip: Trip }) {
  const eventCount = activeTrip.itinerary.flatMap((day) => day.events).length;

  const createdAt = useMemo(() => `Created at ${format(new Date(activeTrip.createdAt), "d MMM yyyy")}`, [activeTrip.createdAt]);
  const updatedAt = new Date(activeTrip.updatedAt);

  // Return formatted date if edited over a month ago, else return relative date (e.g., "Edited 2 days ago").
  const editedAt = isBefore(updatedAt, subMonths(new Date(), 1))
    ? `Edited at ${format(updatedAt, "d MMM yyyy")}`
    : `Edited ${formatDistanceToNow(updatedAt, { addSuffix: true })}`;

  return (
    <Button
      variant="unset"
      size="unset"
      className="flex h-4.5 w-4.5 cursor-default items-center justify-center rounded-full bg-kolumblue-500 font-inconsolata text-xs font-bold leading-none text-white"
      tooltip={{
        placement: "bottom",
        offset: 14,
        className:
          "flex flex-col rounded-xl border bg-white p-1.5 shadow-floating dark:border-gray-700 dark:bg-gray-900 text-gray-900 dark:text-white w-52",
        rootSelector: "#action-bar",
        children: (
          <>
            <Progress
              outsideLabel={{ left: "Events", right: { type: "value/max" } }}
              value={eventCount}
              max={USER_ROLE.EVENTS_PER_TRIP_LIMIT}
              levels={[
                { level: 80, is: ">=", className: { progressValue: "bg-orange-500" } },
                { level: 100, is: "==", className: { progressValue: "bg-red-500" } },
              ]}
              className={{ progress: "mt-0.5 w-full text-sm", progressBar: "border", label: "font-normal" }}
            />
            <p className="mt-2 text-xs tracking-normal text-gray-500">{editedAt}</p>
            <p className="text-xs tracking-normal text-gray-500">{createdAt}</p>
          </>
        ),
      }}
    >
      i
    </Button>
  );
}
