"use client";

import { memo } from "react";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useDndItineraryContext } from "./dnd-context";

import { EventComposer } from "./event-composer";
import { Calendar } from "../calendar";
import { cn } from "~/lib/utils";
import type { Day, Itinerary } from "~/lib/validations/trip";

// todo - Weather API integration to calendar

type DndDayProps = {
  day: Day;
  dayIndex: number;
  itinerary: Itinerary;
  calendar?: string;
  children?: React.ReactNode;
};
const DndDay = memo(({ day, dayIndex, calendar, children }: DndDayProps) => {
  const { eventCount, eventLimit } = useDndItineraryContext();

  const {
    setNodeRef,
    setActivatorNodeRef,
    active,
    isDragging,
    attributes,
    listeners,
    transition,
    transform,
  } = useSortable({
    id: day.id,
    data: { type: "day", dayIndex },
    animateLayoutChanges: (args) =>
      args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      className="group/day relative flex h-[132px] w-full gap-5"
    >
      {!isDragging && (
        <>
          <Calendar
            date={day.date}
            className={cn("sticky left-20 z-40", calendar)}
            header={
              <div
                ref={setActivatorNodeRef}
                className="z-30 flex h-5 w-32 cursor-grab items-center justify-center bg-kolumblue-500 text-xs font-medium text-kolumblue-200 shadow-xl duration-300 ease-kolumb-flow focus-visible:shadow-focus group-first/day:rounded-t-xl"
                {...attributes}
                {...listeners}
              >
                Day {dayIndex + 1}
              </div>
            }
          />

          {/* Events droppable */}
          <ul className="relative mr-4 mt-5 flex h-28 w-full min-w-40 list-none gap-2">
            {children}

            {eventCount < eventLimit && (
              <EventComposer day={day} dayIndex={dayIndex} dragging={!!active?.id} />
            )}
          </ul>
        </>
      )}
    </li>
  );
});
DndDay.displayName = "DndDay";

export default DndDay;
