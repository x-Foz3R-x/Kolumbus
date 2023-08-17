import React, { forwardRef, memo } from "react";
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { getIndex } from "@/lib/dnd";
import { Day, Event } from "@/types";

import Icon from "./icons";
import { useDndData } from "./dnd-itinerary";
import { DndEvent } from "./dnd-event";
import { Calendar } from "./app/itinerary/calendar";

interface DndDayProps {
  day: Day;
}
export const DndDay = memo(function Day({ day, ...props }: DndDayProps) {
  const { activeId } = useDndData();
  const id = day.id;

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
    id,
    data: {
      item: day,
    },
    transition: {
      duration: 300,
      easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
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
      className={`group/calendar ${
        id === activeId
          ? "h-[8.25rem] rounded-r-[0.625rem] border-2 border-dashed border-kolumblue-300 bg-kolumblue-100/80 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter"
          : "z-10"
      }`}
    >
      {id === activeId ? null : (
        <DndDayComponent ref={setActivatorNodeRef} day={day} {...attributes} {...listeners} {...props} />
      )}
    </li>
  );
});

interface DndDayComponentProps {
  day: Day;
  dragOverlay?: boolean;
}
export const DndDayComponent = memo(
  forwardRef(function DndDayContentComponent({ day, dragOverlay, ...props }: DndDayComponentProps, ref: any) {
    const {
      activeTrip,
      activeId,
      setEventComposerShown: setAddEventShown,
      setAddEventDayIndex,
    } = useDndData();
    const { id, events } = day;

    const dayEventsId = events?.map((event) => event.id);
    const dayIndex: number = getIndex(activeTrip.itinerary, "day", day.id);

    const handleAddEvent = () => {
      setAddEventShown(true);
      setAddEventDayIndex(dayIndex);
    };

    const eventWidthAndGap = 168;
    return (
      <div ref={ref} className="group/day flex w-full gap-5">
        <Calendar dayIndex={dayIndex} dragOverlay={dragOverlay} handleAddEvent={handleAddEvent} {...props} />

        <ul
          className={`flex h-32 origin-left list-none gap-2 pt-5 duration-300 ease-kolumb-flow ${
            id === activeId ? "scale-95" : "scale-100"
          }`}
        >
          <SortableContext items={dayEventsId} strategy={horizontalListSortingStrategy}>
            {dayEventsId?.map((eventId: string) => (
              <DndEvent key={eventId} event={events.find((event: Event) => event.id === eventId)!} />
            ))}
          </SortableContext>

          <button
            onClick={handleAddEvent}
            style={{
              left: eventWidthAndGap * dayEventsId.length,
            }}
            className="group absolute z-30 flex h-28 w-8 flex-col items-center justify-center rounded-[0.625rem] bg-white/80 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter duration-300 ease-kolumb-flow hover:shadow-xxl"
          >
            <Icon.plus className="h-4 w-4 fill-gray-300 duration-150 ease-kolumb-flow group-hover:fill-gray-600" />
          </button>
        </ul>
      </div>
    );
  })
);
