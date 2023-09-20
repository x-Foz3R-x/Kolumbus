"use client";

import { createContext, useContext, useState } from "react";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

import { GetItem, GetIndex, EventOverDay, EventOverEvent } from "@/lib/dnd";
import { FormatDate } from "@/lib/utils";
import { DispatchAction, Trip, UT } from "@/types";
import { Day, Event } from "@/types";

import { DndDay, DndDayComponent } from "./dnd-day";
import { DndEventComponent } from "./dnd-event";
import { CalendarEnd } from "./kolumbus/itinerary/calendar";
import EventComposer from "./kolumbus/itinerary/event-composer";
import EventEditableDetails from "./kolumbus/itinerary/event-editable-details";

const DndDataContext = createContext<{
  dispatchUserTrips: React.Dispatch<DispatchAction>;
  selectedTrip: number;

  activeTrip: Trip;
  activeEvent: Event;
  setActiveEvent: React.Dispatch<React.SetStateAction<Event>>;
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

  function handleDragStart({ active }: any) {
    setActiveId(active?.id);

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

  function handleDragOver({ active, over }: any) {
    const activeId = active?.id;
    const overId = over?.id;
    if (!activeId || !overId || activeId === overId) return;

    const activeType = active?.data.current?.item.drag_type;
    const overType = over?.data.current?.item.drag_type;

    const activeIndex = GetIndex(itinerary, activeType, activeId);
    if (typeof activeIndex !== "number" || activeIndex < 0) return;
    const activeDate = GetItem(itinerary, events, activeId)?.date;
    if (typeof activeDate !== "string" || typeof activeDate === undefined) return;

    const overIndex = GetIndex(itinerary, overType, overId);
    if (typeof overIndex !== "number" || overIndex < 0) return;
    const overDate = GetItem(itinerary, events, overId)?.date;
    if (typeof overDate !== "string" || typeof overDate === undefined) return;

    let _itinerary;
    if (activeType === "day" && overType === "day") {
      _itinerary = arrayMove(itinerary, activeIndex, overIndex);
    } else if (activeType === "event" && overType === "day") {
      _itinerary = EventOverDay(itinerary, events, activeId, activeIndex, activeDate, overIndex, overDate);
    } else if (activeType === "event" && overType === "event") {
      _itinerary = EventOverEvent(
        itinerary,
        events,
        activeId,
        activeIndex,
        activeDate,
        overId,
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
                <DndDay key={dayId} day={GetItem(itinerary, events, dayId)} />
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
              <DndDayComponent day={GetItem(itinerary, events, activeId)} dragOverlay={true} />
            </DragOverlay>
          ) : null}

          {typeof activeId === "string" && eventsId?.includes(activeId) ? (
            <DragOverlay
              dropAnimation={{
                duration: 300,
                easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
              }}
            >
              <DndEventComponent event={GetItem(itinerary, events, activeId)} dragOverlay={true} />
            </DragOverlay>
          ) : null}
        </DndContext>
      </DndDataContext.Provider>
    </div>
  );
}
