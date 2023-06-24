import React, { forwardRef, memo } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DndEvent from "./DndEvent";

interface Props {
  day: { day_id: string; date: string; events: any };
  activeId: UniqueIdentifier | null;
}

const DndDay = memo(function Day({ day, activeId, ...props }: Props) {
  const id = day.day_id;

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
        {...attributes}
        {...listeners}
        {...props}
      />
    </li>
  );
});

interface ContentProps {
  activeId: UniqueIdentifier | null;
  day: { day_id: string; date: string; events: any };
  className?: string;
}

export const DndDayContent = memo(
  forwardRef(function DayItem(
    { activeId, day, className, ...props }: ContentProps,
    ref: any
  ) {
    const { day_id, date, events } = day;
    const eventsId = events.map(
      (event: { event_id: string }) => event.event_id
    );

    return (
      <div className="flex h-[6.75rem] w-full gap-5">
        <div className="flex-none select-none bg-kolumblue-400">
          <div
            ref={ref}
            className={day_id !== activeId ? "cursor-grab" : ""}
            {...props}
          >
            X
          </div>
          {date}
        </div>
        <ul className="flex list-none gap-[0.625rem]">
          <SortableContext
            items={eventsId}
            strategy={horizontalListSortingStrategy}
          >
            {eventsId.map((eventId: string) => (
              <DndEvent
                key={eventId}
                event={events.find(
                  (event: { event_id: string }) => event.event_id === eventId
                )}
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
