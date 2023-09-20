import { ChangeEvent, Ref, forwardRef, memo } from "react";
import Image from "next/image";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useDndData } from "./dnd-itinerary";
import { UT } from "@/types";
import { Day, Event } from "@/types";
import Icon from "./icons";

interface DndEventProps {
  event: Event;
}
export const DndEvent = memo(function DndEvent({ event }: DndEventProps) {
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
      className={`h-28 w-40 rounded-lg ${
        id !== activeId ? "z-10" : "z-20 border-2 border-dashed border-gray-300 bg-gray-50"
      }`}
    >
      {id !== activeId && <DndEventComponent event={event} {...listeners} {...attributes} />}
    </li>
  );
});

interface DndEventComponentProps {
  event: Event;
  dragOverlay?: boolean;
}
export const DndEventComponent = memo(
  forwardRef<HTMLDivElement, DndEventComponentProps>(
    ({ event, dragOverlay, ...props }, ref: Ref<HTMLDivElement>) => {
      const { dispatchUserTrips, selectedTrip, activeTrip, setActiveEvent } = useDndData();

      const getImage = (): string => {
        if (event.google?.photo_reference) {
          const maxWidth = 312;
          const maxHeight = 160;

          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&maxheight=${maxHeight}&photo_reference=${event.google.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`;
        }
        return "/images/Untitled.png";
      };

      return (
        <div
          className={`group relative flex h-28 w-40 flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-lg border-2 border-white/80 bg-white/80 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter duration-300 ease-kolumb-leave hover:shadow-borderSplashXl hover:ease-kolumb-flow ${
            dragOverlay ? "shadow-borderSplashXl" : "shadow-borderXl"
          }`}
        >
          {!dragOverlay && (
            <span className="absolute right-1 top-1 z-20 flex h-6 w-14 overflow-hidden rounded border-gray-200 bg-white fill-gray-500 opacity-0 shadow-lg duration-300 ease-kolumb-leave group-hover:opacity-100 group-hover:ease-kolumb-flow">
              <button
                onClick={() => setActiveEvent(event)}
                className="w-full border-r border-gray-200 duration-200 ease-kolumb-flow hover:bg-gray-100"
              >
                <Icon.pinPen className="m-auto h-3" />
              </button>

              <button className="w-full duration-200 ease-kolumb-flow hover:bg-gray-100">
                <Icon.horizontalDots className="m-auto w-4" />
              </button>
            </span>
          )}

          <div ref={ref} onClick={() => setActiveEvent(event)} className="flex-1 cursor-pointer" {...props}>
            <Image
              src={getImage() ?? "/images/Untitled.png"}
              alt="Event Image"
              width={156}
              height={80}
              priority
              className="h-20 object-cover object-center"
            />
          </div>

          <input
            type="text"
            value={event.name}
            placeholder="-"
            onClick={() => navigator.clipboard.writeText(event.name)}
            readOnly
            className="mt-0.5 flex-shrink-0 cursor-pointer text-ellipsis bg-transparent px-1 py-[3px] text-sm text-gray-900 placeholder:text-center hover:bg-gray-400/25"
          />
          <Icon.google className="h-3" />
        </div>
      );
    }
  )
);
