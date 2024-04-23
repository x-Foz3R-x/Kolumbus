import { memo } from "react";

import type { Day } from "~/types";

import { Button, Icons } from "../ui";
import { ActivityOverlay } from "./events";
import { Calendar } from "../calendar";

const DayOverlay = memo(function DayOverlay({
  day,
  enableEventComposer,
}: {
  day: Day;
  enableEventComposer: boolean;
}) {
  return (
    <div className="flex w-full cursor-grabbing gap-5">
      <Calendar
        date={day.date}
        header="Dragging"
        className={{ header: "cursor-grabbing rounded-t-xl", body: "cursor-grabbing rounded-b-xl" }}
      />

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
            <Icons.plus className="h-4 w-4" />
          </Button>
        )}
      </ul>
    </div>
  );
});

export default DayOverlay;
