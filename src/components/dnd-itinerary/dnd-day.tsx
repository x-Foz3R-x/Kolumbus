"use client";

import { memo } from "react";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useDndItineraryContext } from "./dnd-context";

import { EventComposer } from "./event-composer";
import { DayCalendar } from "../day-calendar";
import { cn } from "~/lib/utils";
import type { DaySchema, ItinerarySchema } from "~/lib/validations/trip";

// todo - Weather API integration to calendar

type DndDayProps = {
  day: DaySchema;
  dayIndex: number;
  itinerary: ItinerarySchema;
  calendar?: string;
  children?: React.ReactNode;
};
const DndDay = memo(({ day, dayIndex, calendar, children }: DndDayProps) => {
  const { placeCount, placeLimit } = useDndItineraryContext();

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
    data: { type: "list", listIndex: dayIndex },
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
          <DayCalendar
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
          <ul className="relative mr-5 mt-5 flex h-28 w-full min-w-40 list-none gap-2">
            {children}

            {placeCount < placeLimit && (
              <>
                <EventComposer day={day} dayIndex={dayIndex} dragging={!!active?.id} />

                {/* Placeholder for event composer animation (occupies its space) */}
                {!!active?.id && <span className="ml-2 h-28 w-8 opacity-0 [&:nth-child(2)]:ml-0" />}
              </>
            )}
          </ul>
        </>
      )}
    </li>
  );
});
DndDay.displayName = "DndDay";

export default DndDay;
