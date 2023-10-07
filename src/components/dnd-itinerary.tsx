"use client";

import { ForwardedRef, createContext, forwardRef, memo, useContext, useEffect, useState } from "react";
import Image from "next/image";

import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import api from "@/app/_trpc/client";
import { GetItem, GetIndex, EventOverDay, EventOverEvent, GetDay, GetEvent, GetDragType } from "@/lib/dnd";

import { Calendar, CalendarEnd } from "./itinerary/calendar";
import EventComposer from "./itinerary/event-composer";
import EventPanel from "./itinerary/event-panel";
import Icon from "./icons";

import type { DispatchAction, Trip, Day, Event } from "@/types";

const DndDataContext = createContext<{
  dispatchUserTrips: React.Dispatch<DispatchAction>;
  selectedTrip: number;

  activeTrip: Trip;
  activeEvent: Event | null;
  setActiveEvent: React.Dispatch<React.SetStateAction<Event | null>>;
  activeId: string | null;

  daysId: string[];
  eventsId: string[];
  events: Event[];

  isEventComposerDisplayed: boolean;
  setEventComposerDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  isEventPanelDisplayed: boolean;
  setEventPanelDisplay: React.Dispatch<React.SetStateAction<boolean>>;

  dialogIndexPosition: { x: number; y: number };
  setDialogIndexPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;

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
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [isEventComposerDisplayed, setEventComposerDisplay] = useState(false);
  const [isEventPanelDisplayed, setEventPanelDisplay] = useState(false);
  const [dialogIndexPosition, setDialogIndexPosition] = useState({ x: 0, y: 0 });
  const [addEventDayIndex, setAddEventDayIndex] = useState(0);

  const [apiUpdate, setApiUpdate] = useState<{ type: "day^day" | "event^day" | "event^event" } | null>(null);
  const updateEvent = api.event.update.useMutation();

  const { itinerary, ...tripInfo } = activeTrip;
  const events = itinerary.flatMap((day) => day.events);

  const daysId = itinerary.map((day) => day.id);
  const eventsId = events.map((event) => event.id);

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active?.id as string);

    if (GetDragType(active) === "day") {
      const grabbing = document.createElement("div");
      grabbing.id = "grabbing";
      grabbing.setAttribute(
        "style",
        "position: fixed; top: 0; left: 0; right: 0; bottom: 0; cursor: grabbing; z-index: 999;"
      );
      document.body.appendChild(grabbing);
    }
  }

  function handleDragEnd({ collisions }: DragEndEvent) {
    setActiveId(null);
    document.getElementById("grabbing")?.remove();

    if (apiUpdate === null) return;

    // todo: optimize not to update all events, only the changed ones
    const iteratedDate = new Date(tripInfo.startDate);
    itinerary.forEach((day) => {
      day.events.forEach((event, index) => {
        event.date = iteratedDate.toISOString();
        event.position = index;

        updateEvent.mutate({
          eventId: event.id,
          data: { date: event.date, position: event.position },
        });
      });

      iteratedDate.setDate(iteratedDate.getDate() + 1);
    });
    setApiUpdate(null);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (over === null) return;

    const activeId = active?.id as string;
    const overId = over?.id as string;
    if (!activeId || !overId || activeId === overId) return;

    const activeType = GetDragType(active);
    const overType = GetDragType(over);

    const activeIndex = GetIndex(itinerary, events, activeType, activeId);
    if (activeIndex < 0) return;
    const activeDate = GetItem(itinerary, events, activeId)?.date;
    if (typeof activeDate === "undefined") return;

    const overIndex = GetIndex(itinerary, events, overType, overId);
    if (overIndex < 0) return;
    const overDate = GetItem(itinerary, events, overId)?.date;
    if (typeof overDate === "undefined") return;

    let newItinerary;
    if (activeType === "day" && overType === "day") {
      newItinerary = arrayMove(itinerary, activeIndex, overIndex);
      setApiUpdate({ type: "day^day" });
    } else if (activeType === "event" && overType === "day") {
      newItinerary = EventOverDay(itinerary, events, activeId, activeIndex, activeDate, overIndex, overDate);
      setApiUpdate({ type: "event^day" });
    } else if (activeType === "event" && overType === "event") {
      newItinerary = EventOverEvent(
        itinerary,
        events,
        activeId,
        activeIndex,
        activeDate,
        overId,
        overIndex,
        overDate
      );
      setApiUpdate({ type: "event^event" });
    }

    if (!newItinerary) return;

    const iteratedDate = new Date(tripInfo.startDate);
    newItinerary.forEach((day) => {
      const currentDate = iteratedDate.toISOString();

      day.date = currentDate;
      day.events.forEach((event, index) => {
        event.date = currentDate;
        event.position = index;
      });

      iteratedDate.setDate(iteratedDate.getDate() + 1);
    });

    setActiveTrip({ itinerary: newItinerary, ...tripInfo });
  }

  console.log(dialogIndexPosition);

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

    isEventComposerDisplayed,
    setEventComposerDisplay,
    isEventPanelDisplayed,
    setEventPanelDisplay,

    dialogIndexPosition,
    setDialogIndexPosition,

    addEventDayIndex,
    setAddEventDayIndex,
  };

  return (
    <div className="relative flex flex-col gap-10">
      <DndDataContext.Provider value={value}>
        <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <SortableContext items={daysId} strategy={verticalListSortingStrategy}>
            <EventComposer />
            <EventPanel />

            <ul className="flex w-full min-w-fit flex-col">
              {daysId?.map((dayId) => (
                <DndDay key={dayId} day={GetDay(itinerary, dayId)} />
              ))}
              <CalendarEnd totalDays={tripInfo.days} />
            </ul>
          </SortableContext>

          {typeof activeId === "string" && daysId.includes(activeId) ? (
            <DragOverlay
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              dropAnimation={{
                duration: 300,
                easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
              }}
            >
              <DayComponent day={GetDay(itinerary, activeId)} dragOverlay={true} />
            </DragOverlay>
          ) : null}

          {typeof activeId === "string" && eventsId?.includes(activeId) ? (
            <DragOverlay
              dropAnimation={{
                duration: 300,
                easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
              }}
            >
              <EventComponent event={GetEvent(events, activeId)} dragOverlay={true} />
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
        id !== activeId
          ? "z-10"
          : "h-[8.25rem] rounded-r-[0.625rem] border-2 border-dashed border-kolumblue-300 bg-kolumblue-100/80 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter first:rounded-tl-[0.625rem]"
      }`}
    >
      {id !== activeId ? (
        <DayComponent ref={setActivatorNodeRef} day={day} {...attributes} {...listeners} {...props} />
      ) : null}
    </li>
  );
});

type DayComponentProps = {
  day: Day;
  dragOverlay?: boolean;
};
const DayComponent = memo(
  forwardRef(function DndDayContentComponent(
    { day, dragOverlay, ...props }: DayComponentProps,
    ref: ForwardedRef<HTMLDivElement>
  ) {
    const { activeTrip, activeId, setEventComposerDisplay, setAddEventDayIndex } = useDndData();
    const { id, events } = day;

    const dayEventsId = events?.map((event) => event.id);
    const dayIndex = GetIndex(activeTrip.itinerary, events, "day", day.id);

    const handleAddEvent = () => {
      setEventComposerDisplay(true);
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
            {dayEventsId?.map((eventId) => (
              <DndEvent key={eventId} event={events.find((event) => event.id === eventId)!} />
            ))}
          </SortableContext>

          <button
            onClick={handleAddEvent}
            style={{
              left: eventWidthAndGap * dayEventsId.length,
            }}
            className="group absolute z-30 flex h-28 w-8 flex-col items-center justify-center rounded-[0.625rem] bg-white/80 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter duration-300 ease-kolumb-flow hover:shadow-2xl"
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
const DndEvent = memo(({ event }: { event: Event }) => {
  const { activeId, activeEvent, isEventPanelDisplayed } = useDndData();
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
      className={`h-28 rounded-lg duration-500 ease-kolumb-flow ${
        id !== activeId ? "z-10" : "z-20 border-2 border-dashed border-gray-300 bg-gray-50"
      }
      ${isEventPanelDisplayed && activeEvent?.id === id ? "w-80 opacity-0" : "w-40 opacity-100"}
      `}
    >
      {id !== activeId && <EventComponent event={event} {...listeners} {...attributes} />}
    </li>
  );
});
DndEvent.displayName = "DndEvent";

type EventComponentProps = {
  event: Event;
  dragOverlay?: boolean;
};
const EventComponent = memo(
  forwardRef<HTMLDivElement, EventComponentProps>(
    ({ event, dragOverlay, ...props }, ref: ForwardedRef<HTMLDivElement>) => {
      const {
        activeTrip,
        setActiveEvent,
        isEventPanelDisplayed,
        setEventPanelDisplay,
        setDialogIndexPosition,
      } = useDndData();

      const getImageUrl = (): string => {
        if (!event.photo) return "/images/event-placeholder.png";
        if (event.photo.startsWith("http")) return event.photo;

        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=312&maxheight=160&photo_reference=${event.photo}&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`;
      };

      // find index of the day that the event belongs to by comparing the date
      const dayIndex = activeTrip.itinerary.findIndex((day: Day) => day.date === event.date);

      return (
        <div
          className={`group relative flex h-28 flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-lg border-2 border-white/80 bg-white/80 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter duration-300 ease-kolumb-leave hover:shadow-borderSplashXl hover:ease-kolumb-flow ${
            dragOverlay ? "shadow-borderSplashXl" : "shadow-borderXl"
          }`}
        >
          {!dragOverlay && (
            <span className="absolute right-1 top-1 z-20 flex h-6 w-14 overflow-hidden rounded border-gray-200 bg-white fill-gray-500 opacity-0 shadow-lg duration-300 ease-kolumb-leave group-hover:opacity-100 group-hover:ease-kolumb-flow">
              <button
                onClick={() => {
                  setEventPanelDisplay(false);
                  setActiveEvent(event);
                  setDialogIndexPosition({ x: event.position, y: dayIndex });
                  setTimeout(() => setEventPanelDisplay(true), 350);
                }}
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
              src={getImageUrl()}
              alt="Event Image"
              width={156}
              height={80}
              priority
              className="h-20 object-cover object-center"
            />
          </div>

          <input
            type="text"
            name="event-name"
            value={event.name}
            placeholder="-"
            onClick={() => navigator.clipboard.writeText(event.name)}
            readOnly
            className="mt-0.5 flex-shrink-0 cursor-pointer text-ellipsis bg-transparent px-1 py-[3px] text-sm text-gray-900 placeholder:text-center hover:bg-gray-400/25"
          />
        </div>
      );
    }
  )
);
//#endregion
