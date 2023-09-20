"use client";

import { ForwardedRef, createContext, forwardRef, memo, useContext, useState } from "react";
import Image from "next/image";

import { DndContext, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import { GetItem, GetIndex, EventOverDay, EventOverEvent, GetDay, GetEvent } from "@/lib/dnd";
import { FormatDate } from "@/lib/utils";

import { Calendar, CalendarEnd } from "./itinerary/calendar";
import EventComposer from "./itinerary/event-composer";
import EventEditableDetails from "./itinerary/event-editable-details";
import Icon from "./icons";

import type { DispatchAction, Trip, Day, Event } from "@/types";

const DndDataContext = createContext<{
  dispatchUserTrips: React.Dispatch<DispatchAction>;
  selectedTrip: number;

  activeTrip: Trip;
  activeEvent: Event | undefined;
  setActiveEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
  activeId: string | null;

  daysId: string[];
  eventsId: string[];
  events: Event[];

  isEventComposerShown: boolean;
  setEventComposerShown: React.Dispatch<React.SetStateAction<boolean>>;
  addEventDayIndex: number;
  setAddEventDayIndex: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);
export function useDndData() {
  const context = useContext(DndDataContext);
  if (!context) throw new Error("useDndData must be used within a DndDataContext.Provider");
  return context;
}

//#region Itinerary
type DndItineraryProps = {
  userTrips: Trip[];
  dispatchUserTrips: React.Dispatch<DispatchAction>;
  selectedTrip: number;
};
export default function DndItinerary({ userTrips, dispatchUserTrips, selectedTrip }: DndItineraryProps) {
  const [activeTrip, setActiveTrip] = useState<Trip>(userTrips[selectedTrip]);
  const [activeEvent, setActiveEvent] = useState<Event>();
  const [activeId, setActiveId] = useState<string | null>(null);

  const [isEventComposerShown, setEventComposerShown] = useState(false);
  const [addEventDayIndex, setAddEventDayIndex] = useState(0);

  const { itinerary, ...tripInfo } = activeTrip;
  const events = itinerary?.flatMap((day) => day.events);

  const daysId = itinerary?.map((day) => day.id);
  const eventsId = events?.map((event) => event.id);

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active?.id as string);

    if (active?.data.current?.item.drag_type === "day") {
      const grabbing = document.createElement("div");
      grabbing.id = "grabbing";
      grabbing.setAttribute(
        "style",
        "position: fixed; top: 0; left: 0; right: 0; bottom: 0; cursor: grabbing; z-index: 999;"
      );
      document.body.appendChild(grabbing);
    }
  }

  function handleDragEnd() {
    setActiveId(null);

    document.getElementById("grabbing")?.remove();
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    const activeId = active?.id;
    const overId = over?.id;
    if (!activeId || !overId || activeId === overId) return;

    const activeType = typeof active?.data.current?.item?.events === "object" ? "day" : "event";
    const overType = over?.data.current?.item?.events === "object" ? "day" : "event";

    const activeIndex = GetIndex(itinerary, events, activeType, activeId as string);
    if (typeof activeIndex !== "number" || activeIndex < 0) return;
    const activeDate = GetItem(itinerary, events, activeId as string)?.date;
    if (typeof activeDate !== "string" || typeof activeDate === undefined) return;

    const overIndex = GetIndex(itinerary, events, overType, overId as string);
    if (typeof overIndex !== "number" || overIndex < 0) return;
    const overDate = GetItem(itinerary, events, overId as string)?.date;
    if (typeof overDate !== "string" || typeof overDate === undefined) return;

    let _itinerary;
    if (activeType === "day" && overType === "day") {
      _itinerary = arrayMove(itinerary, activeIndex, overIndex);
    } else if (activeType === "event" && overType === "day") {
      _itinerary = EventOverDay(
        itinerary,
        events,
        activeId as string,
        activeIndex,
        activeDate,
        overIndex,
        overDate
      );
    } else if (activeType === "event" && overType === "event") {
      _itinerary = EventOverEvent(
        itinerary,
        events,
        activeId as string,
        activeIndex,
        activeDate,
        overId as string,
        overIndex,
        overDate
      );
    }

    if (!_itinerary) return;
    const iteratedDate = new Date(tripInfo.startDate);
    _itinerary.forEach((day: Day) => {
      const currentDate = FormatDate(iteratedDate);

      day.date = currentDate;

      day.events.forEach((event, index) => {
        event.position = index;
        event.date = currentDate;
      });

      iteratedDate.setDate(iteratedDate.getDate() + 1);
    });

    setActiveTrip({ itinerary: _itinerary, ...tripInfo });
  }

  const value = {
    dispatchUserTrips,
    selectedTrip,
    activeTrip,
    activeEvent,
    setActiveEvent,

    activeId,
    daysId,
    eventsId,
    events,

    isEventComposerShown,
    setEventComposerShown,
    addEventDayIndex,
    setAddEventDayIndex,
  };

  return (
    <div className="flex w-[calc(100vw-19rem)] flex-col gap-10">
      <DndDataContext.Provider value={value}>
        <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <SortableContext items={daysId} strategy={verticalListSortingStrategy}>
            <EventComposer />

            <EventEditableDetails />

            <ul className="flex w-full min-w-fit flex-col">
              {daysId?.map((dayId: string) => (
                <DndDay key={dayId} day={GetDay(itinerary, dayId)} />
              ))}
              <CalendarEnd totalDays={tripInfo.days} />
            </ul>
          </SortableContext>

          {typeof activeId === "string" && daysId?.includes(activeId) ? (
            <DragOverlay
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              dropAnimation={{
                duration: 300,
                easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
              }}
            >
              <DndDayComponent day={GetDay(itinerary, activeId)} dragOverlay={true} />
            </DragOverlay>
          ) : null}

          {typeof activeId === "string" && eventsId?.includes(activeId) ? (
            <DragOverlay
              dropAnimation={{
                duration: 300,
                easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
              }}
            >
              <DndEventComponent event={GetEvent(events, activeId)} dragOverlay={true} />
            </DragOverlay>
          ) : null}
        </DndContext>
      </DndDataContext.Provider>
    </div>
  );
}
//#endregion

//#region Day
const DndDay = memo(function Day({ day, ...props }: { day: Day }) {
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

type DndDayComponentProps = {
  day: Day;
  dragOverlay?: boolean;
};
const DndDayComponent = memo(
  forwardRef(function DndDayContentComponent(
    { day, dragOverlay, ...props }: DndDayComponentProps,
    ref: ForwardedRef<HTMLDivElement>
  ) {
    const {
      activeTrip,
      activeId,
      setEventComposerShown: setAddEventShown,
      setAddEventDayIndex,
    } = useDndData();
    const { id, events } = day;

    const dayEventsId = events?.map((event) => event.id);
    const dayIndex: number = GetIndex(activeTrip.itinerary, events, "day", day.id);

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
//#endregion

//#region Event
export const DndEvent = memo(function DndEvent({ event }: { event: Event }) {
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

type DndEventComponentProps = {
  event: Event;
  dragOverlay?: boolean;
};
export const DndEventComponent = memo(
  forwardRef<HTMLDivElement, DndEventComponentProps>(
    ({ event, dragOverlay, ...props }, ref: ForwardedRef<HTMLDivElement>) => {
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
//#endregion
