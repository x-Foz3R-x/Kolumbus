import React, { forwardRef, memo } from "react";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Day, Event } from "@/types";

import DndEvent from "./dnd-event";
import Calendar from "./app/itinerary/calendar";

interface Props {
  activeId: string | number | null;
  index: number;
  startDate: string;
  day: Day;
  handleEventNameChange?: Function;
}

const DndDay = memo(function Day({
  activeId,
  index,
  startDate,
  day,
  handleEventNameChange,
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
    transition: {
      duration: 200,
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
      className={
        "group/calendar " +
        (id === activeId
          ? "z-20 h-32 rounded-r-[10px] border-2 border-dashed border-kolumblue-300 bg-kolumblue-100/70 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter "
          : "z-10 ")
      }
    >
      {id === activeId ? null : (
        <DndDayContent
          ref={setActivatorNodeRef}
          activeId={activeId}
          index={index}
          startDate={startDate}
          day={day}
          handleEventNameChange={handleEventNameChange}
          {...attributes}
          {...listeners}
          {...props}
        />
      )}
    </li>
  );
});

interface ContentProps {
  activeId: string | number | null;
  index: number;
  startDate: string;
  day: Day;
  overlay?: boolean;
  className?: string;
  handleEventNameChange?: Function;
}

export const DndDayContent = memo(
  forwardRef(function DayContent(
    {
      activeId,
      index,
      startDate,
      day,
      overlay,
      className,
      handleEventNameChange,
      ...props
    }: ContentProps,
    ref: any
  ) {
    const { id, events } = day;
    const eventsId = events?.map((event: Event) => event.id);

    return (
      <div ref={ref} className="z-10 flex w-full gap-5">
        <Calendar
          index={index}
          startDate={startDate}
          overlay={overlay}
          className={className}
          {...props}
        />
        <ul
          className={
            "flex h-[6.75rem] list-none gap-[0.625rem] pt-5 duration-700 ease-kolumb-flow " +
            (id === activeId ? "scale-95 " : "scale-100")
          }
        >
          <SortableContext
            items={eventsId}
            strategy={horizontalListSortingStrategy}
          >
            {eventsId?.map((eventId: string) => (
              <DndEvent
                key={eventId}
                event={events.find((event: Event) => event.id === eventId)!}
                activeId={activeId}
                handleOnChange={handleEventNameChange}
              />
            ))}
          </SortableContext>
        </ul>
      </div>
    );
  })
);

export default DndDay;
