"use client";

import { memo, useMemo } from "react";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { USER_ROLE } from "@/lib/config";
import { Day, Itinerary } from "@/types";

import { EventComposer } from "./event-composer";
import { CalendarBody } from "./calendar-body";
import { useDndItineraryContext } from "./dnd-context";

// todo - Weather API integration to calendar

type DndDayProps = {
  day: Day;
  dayIndex: number;
  itinerary: Itinerary;
  children?: React.ReactNode;
};
const DndDay = memo(({ day, dayIndex, itinerary, children }: DndDayProps) => {
  const { eventsCount } = useDndItineraryContext();

  const { setNodeRef, setActivatorNodeRef, active, isDragging, attributes, listeners, transition, transform } = useSortable({
    id: day.id,
    data: { type: "day", dayIndex },
    animateLayoutChanges: (args) => (args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true),
  });

  const date = useMemo(() => new Date(day.date), [day.date]);
  const isToday = useMemo(() => date.toDateString() === new Date().toDateString(), [date]);

  return (
    <li
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      className="group/day relative flex h-[132px] w-full gap-5"
    >
      {!isDragging && (
        <>
          {/* Calendar */}
          <div className="sticky left-56 z-20">
            {/* Calendar Header */}
            <div
              ref={setActivatorNodeRef}
              className="relative z-30 flex h-5 w-32 cursor-grab items-center justify-center bg-kolumblue-500 text-xs font-medium text-kolumblue-200 shadow-xl duration-300 ease-kolumb-flow focus-visible:shadow-focus group-first/day:rounded-t-xl"
              {...attributes}
              {...listeners}
            >
              Day {dayIndex + 1}
            </div>

            <CalendarBody date={date} isToday={isToday} />
          </div>

          {/* Events droppable */}
          <ul className="relative mr-4 mt-5 flex h-28 w-full min-w-40 list-none gap-2">
            {children}

            {eventsCount < USER_ROLE.EVENTS_PER_TRIP_LIMIT && (
              <EventComposer activeId={(active?.id as string) ?? null} itinerary={itinerary} day={day} />
            )}
          </ul>
        </>
      )}
    </li>
  );
});
DndDay.displayName = "DndDay";

export default DndDay;
