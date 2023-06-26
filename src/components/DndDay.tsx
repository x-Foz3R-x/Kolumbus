import React, { forwardRef, memo } from "react";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DndEvent from "./DndEvent";
import { Day, Event, Trip } from "@/types";
import Calendar from "./app/itinerary/calendar";

interface Props {
  day: Day | any;
  activeId: string | number | null;
  trip: Trip;
  index: number;
}

const DndDay = memo(function Day({
  day,
  activeId,
  trip,
  index,
  ...props
}: Props) {
  const id = day.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      item: day,
    },
  });

  return (
    <li
      id={id}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={id === activeId ? "cursor-grabbing" : ""}
    >
      <DndDayContent
        ref={setActivatorNodeRef}
        activeId={activeId!}
        day={day!}
        trip={trip}
        index={index}
        {...attributes}
        {...listeners}
        {...props}
      />
    </li>
  );
});

interface ContentProps {
  activeId: string | number | null;
  day: Day | any;
  trip: Trip;
  index: number;
  className?: string;
}

export const DndDayContent = memo(
  forwardRef(function DayItem(
    { activeId, day, trip, index, className, ...props }: ContentProps,
    ref: any
  ) {
    const { id, date, events } = day;
    const eventsId = events.map((event: Event) => event.id);

    return (
      <div className="flex w-full gap-5">
        <Calendar trip={trip} index={index} {...props} />
        <ul className="flex h-[6.75rem] list-none gap-[0.625rem]">
          <SortableContext
            items={eventsId}
            strategy={horizontalListSortingStrategy}
          >
            {eventsId.map((eventId: string) => (
              <DndEvent
                key={eventId}
                event={events.find((event: Event) => event.id === eventId)}
                activeId={activeId}
              />
            ))}
          </SortableContext>
        </ul>
      </div>
    );
  })
);

export default DndDay;
