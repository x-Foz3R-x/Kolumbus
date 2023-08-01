import { ChangeEvent, Ref, forwardRef, memo } from "react";
import Image from "next/image";

import { useDndData } from "./dnd-itinerary";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { UT } from "@/types";
import { Day, Event } from "@/types";

interface DndEventProps {
  event: Event;
}
export const DndEvent = memo(function Event({ event }: DndEventProps) {
  const { activeId } = useDndData();
  const id = event.id;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: {
      item: event,
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
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`h-28 w-[9.5rem] rounded-lg ${
        id === activeId
          ? "z-20 border-2 border-dashed border-kolumblue-300/70 bg-kolumblue-100/80 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter"
          : "z-10"
      }`}
    >
      {id === activeId ? null : <DndEventComponent event={event} {...listeners} {...attributes} />}
    </li>
  );
});

interface DndEventComponentProps {
  event: Event;
  dragOverlay?: boolean;
}
export const DndEventComponent = memo(
  forwardRef<HTMLDivElement, DndEventComponentProps>(function DndEventContentComponent(
    { event, dragOverlay, ...props },
    ref: Ref<HTMLDivElement>
  ) {
    const { dispatchUserTrips, selectedTrip, activeTrip } = useDndData();

    function handleEventDisplayName(e: ChangeEvent<HTMLInputElement>, date: string, position: number) {
      const dayIndex = activeTrip.itinerary?.findIndex((day: Day) => day.date === date);

      dispatchUserTrips({
        type: UT.UPDATE_EVENT_FIELD,
        payload: {
          selectedTrip: selectedTrip,
          dayIndex: dayIndex,
          eventIndex: position,
          field: "display_name",
          value: e.target.value,
        },
      });
    }

    return (
      <div
        className={`relative flex h-28 w-[9.5rem] flex-none origin-left flex-col rounded-lg border-2 bg-white/80 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter duration-150 ease-kolumb-flow hover:shadow-xxl ${
          dragOverlay ? "border-kolumblue-300" : "border-transparent"
        }`}
      >
        <div
          ref={ref}
          className="left-0 flex-1 cursor-move after:absolute after:inset-0 after:z-50 after:h-[4.875rem] after:rounded-t-md after:shadow-kolumblueInset"
          {...props}
        >
          <Image
            src="/images/Untitled.png"
            alt="event image"
            width={148}
            height={78}
            priority={true}
            className="h-[4.875rem] rounded-t-md object-cover object-center"
          />
        </div>

        <input
          type="text"
          value={event.display_name}
          placeholder="Enter place name"
          onChange={(e) => handleEventDisplayName(e, event.date, event.position)}
          className={`
            z-10 h-[1.875rem] flex-shrink-0 bg-transparent p-[6px] pb-1 text-sm capitalize text-kolumbGray-900 ${
              dragOverlay && "cursor-move"
            }`}
        />
      </div>
    );
  })
);
