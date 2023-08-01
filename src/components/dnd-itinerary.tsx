/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

import { getItem, getIndex, eventOverDay, eventOverEvent } from "@/lib/dnd";
import { formatDate } from "@/lib/utils";
import { Trip, UT } from "@/types";
import { Day, Event } from "@/types";

import { DndDay, DndDayComponent } from "./dnd-day";
import { DndEventComponent } from "./dnd-event";
import { CalendarEnd } from "./app/itinerary/calendar";
import AddEvent from "./add-event";
import { firebaseUpdateEvents } from "@/hooks/use-firebase-operations";

const DndDataContext = createContext<{
  dispatchUserTrips: any;
  selectedTrip: number;
  activeTrip: any;
  events: Event[];
  daysId: string[];
  eventsId: string[];
  activeId: string | null;
  isAddEventShown: boolean;
  setAddEventShown: any;
  addEventDayIndex: number;
  setAddEventDayIndex: any;
}>({
  dispatchUserTrips: null,
  selectedTrip: 0,
  activeTrip: {},
  events: [],
  daysId: [],
  eventsId: [],
  activeId: "",
  isAddEventShown: false,
  setAddEventShown: null,
  addEventDayIndex: 0,
  setAddEventDayIndex: null,
});
export function useDndData() {
  return useContext(DndDataContext);
}

interface Props {
  userTrips: Trip[];
  dispatchUserTrips: React.Dispatch<{ type: string; payload: any }>;
  selectedTrip: number;
}
export default function DndItinerary({ userTrips, dispatchUserTrips, selectedTrip }: Props) {
  const [isAddEventShown, setAddEventShown] = useState(false);
  const [addEventDayIndex, setAddEventDayIndex] = useState(0);

  const [activeTrip, setActiveTrip] = useState<Trip>(userTrips[selectedTrip]);

  useEffect(() => {
    setActiveTrip(userTrips[selectedTrip]);
  }, [userTrips]);

  const { itinerary, ...tripInfo } = activeTrip;
  const events = itinerary?.flatMap((day) => day.events);

  const daysId = itinerary?.map((day) => day.id);
  const eventsId = events?.map((event) => event.id);

  const [activeId, setActiveId] = useState<string | null>(null);

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

    firebaseUpdateEvents(activeTrip);
    dispatchUserTrips({
      type: UT.REPLACE_TRIP,
      payload: activeTrip,
    });

    document.getElementById("grabbing")?.remove();
  }

  function handleDragOver({ active, over }: any) {
    const activeId = active?.id;
    const overId = over?.id;
    if (!activeId || !overId || activeId === overId) return;

    const activeType = active?.data.current?.item.drag_type;
    const overType = over?.data.current?.item.drag_type;

    const activeIndex = getIndex(itinerary, activeType, activeId);
    if (typeof activeIndex !== "number" || activeIndex < 0) return;
    const activeDate = getItem(itinerary, events, activeId)?.date;
    if (typeof activeDate !== "string" || typeof activeDate === undefined) return;

    const overIndex = getIndex(itinerary, overType, overId);
    if (typeof overIndex !== "number" || overIndex < 0) return;
    const overDate = getItem(itinerary, events, overId)?.date;
    if (typeof overDate !== "string" || typeof overDate === undefined) return;

    let _itinerary;
    if (activeType === "day" && overType === "day") {
      _itinerary = arrayMove(itinerary, activeIndex, overIndex);
    } else if (activeType === "event" && overType === "day") {
      _itinerary = eventOverDay(itinerary, events, activeId, activeIndex, activeDate, overIndex, overDate);
    } else if (activeType === "event" && overType === "event") {
      _itinerary = eventOverEvent(
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
    const iteratedDate = new Date(tripInfo.start_date);
    _itinerary.forEach((day: Day) => {
      const currentDate = formatDate(iteratedDate);

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

    activeId,
    daysId,
    eventsId,
    events,

    isAddEventShown,
    setAddEventShown,
    addEventDayIndex,
    setAddEventDayIndex,
  };

  return (
    <div className="flex w-[calc(100vw-19rem)] flex-col gap-10">
      <DndDataContext.Provider value={value}>
        <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <SortableContext items={daysId} strategy={verticalListSortingStrategy}>
            <AddEvent />
            <ul className="flex w-full min-w-fit flex-col">
              {daysId?.map((dayId: string) => (
                <DndDay key={dayId} day={getItem(itinerary, events, dayId)} />
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
              <DndDayComponent day={getItem(itinerary, events, activeId)} dragOverlay={true} />
            </DragOverlay>
          ) : null}

          {typeof activeId === "string" && eventsId?.includes(activeId) ? (
            <DragOverlay
              dropAnimation={{
                duration: 300,
                easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
              }}
            >
              <DndEventComponent event={getItem(itinerary, events, activeId)} dragOverlay={true} />
            </DragOverlay>
          ) : null}
        </DndContext>
      </DndDataContext.Provider>
    </div>
  );
}
