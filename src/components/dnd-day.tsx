import React, { forwardRef, memo } from "react";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Day, Event } from "@/types";

import DndEvent from "./dnd-event";
import { Calendar } from "./app/itinerary/calendar";
import Icon from "./icons";
import { useDndData } from "./dnd-itinerary";
import { getItem } from "@/lib/dnd";

interface Props {
  activeId: string | number | null;
  index: number;
  startDate: string;
  day: Day;
  handleEventNameChange?: Function;
  handleAddEvent?: Function;
}

const DndDay = memo(function Day({
  activeId,
  index,
  startDate,
  day,
  handleEventNameChange,
  handleAddEvent,
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
          handleAddEvent={handleAddEvent}
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
  handleAddEvent?: Function;
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
      handleAddEvent,
      ...props
    }: ContentProps,
    ref: any
  ) {
    // const { itinerary, events, daysId } = useDndData();

    const { id, date, events } = day;
    const eventsId = events?.map((event: Event) => event.id);

    // const day = getItem(itinerary, events, dayId)
    // const dayIndex = itinerary?.findIndex((day: Day) => day.date === date);
    // console.log(dayIndex);

    return (
      <div ref={ref} className="group/day z-10 flex w-full gap-5">
        <Calendar
          index={index}
          startDate={startDate}
          overlay={overlay}
          className={className}
          handleAddEvent={handleAddEvent}
          {...props}
        />
        <ul
          className={
            "flex h-32 list-none gap-[0.625rem] pt-5 duration-700 ease-kolumb-flow " +
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
          <button
            onClick={() => {
              if (handleAddEvent) handleAddEvent("at_end", day.date);
            }}
            style={{
              left: 144 * eventsId.length + 10 * eventsId.length,
            }}
            className="group/add absolute z-30 flex h-[6.75rem] w-8 flex-col items-center justify-center rounded-[0.625rem] bg-white/80 opacity-100 shadow-kolumblue backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter duration-300 ease-kolumb-flow hover:shadow-kolumblue group-hover/day:opacity-100"
          >
            <Icon.plus className="h-4 w-4 fill-kolumbGray-300 group-hover/add:fill-kolumbGray-600" />
          </button>
        </ul>
      </div>
    );
  })
);

export default DndDay;
