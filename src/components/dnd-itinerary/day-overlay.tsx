import { memo, useMemo } from "react";

import { Day } from "@/types";

import Icon from "../icons";
import { Button } from "../ui";
import { ActivityOverlay } from "./events";
import { CalendarBody } from "./calendar-body";

const DayOverlay = memo(function DayOverlay({ day, enableEventComposer }: { day: Day; enableEventComposer: boolean }) {
  const date = useMemo(() => new Date(day.date), [day.date]);
  const isToday = useMemo(() => date.toDateString() === new Date().toDateString(), [date]);

  return (
    <div className="flex w-full cursor-grabbing gap-5">
      {/* Calendar */}
      <div className="sticky left-56 z-20">
        {/* Calendar Header */}
        <div className="relative z-30 flex h-5 w-32 items-center justify-center rounded-t-xl bg-kolumblue-500 text-xs font-medium text-kolumblue-200 shadow-xl">
          Dragging
        </div>

        <CalendarBody date={date} isToday={isToday} className="rounded-b-xl" />
      </div>

      <ul className="mt-5 flex h-28 w-full min-w-40 list-none gap-2">
        {day.events.map((event) => (
          <ActivityOverlay key={event.id} event={event} selectCount={0} />
        ))}

        {enableEventComposer && (
          <Button
            variant="unset"
            size="unset"
            className="ml-2 flex h-28 w-8 items-center rounded-lg bg-white fill-gray-400 px-2 shadow-floating first:ml-0"
          >
            <Icon.plus className="h-4 w-4" />
          </Button>
        )}
      </ul>
    </div>
  );
});

export default DayOverlay;
