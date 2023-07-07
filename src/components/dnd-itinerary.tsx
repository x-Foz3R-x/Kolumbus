/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import { getItem, getIndex, eventOverDay, eventOverEvent } from "@/lib/dnd";
import { formatDate } from "@/lib/utils";
import { UT } from "@/config/actions";
import { Day, Event, Events, Itinerary, Trip, Trips } from "@/types";

import DndDay, { DndDayContent } from "./dnd-day";
import { DndEventContent } from "./dnd-event";
import { CalendarEnd } from "./app/itinerary/calendar";

const DndDataContext = createContext<{
  itinerary?: Itinerary;
  tripInfo?: {
    id?: string | undefined;
    owner_id: string | number;
    participants_id: string | number[];
    name: string;
    start_date: string;
    end_date: string;
    days: number;
    position: number;
    created_at: number;
    updated_at: number;
  };
  events?: Events;
  daysId?: string[];
  eventsId?: string[];
  activeId?: string | null;
}>({});

export function useDndData() {
  return useContext(DndDataContext);
}

interface Props {
  userTrips: Trips;
  dispatchUserTrips: React.Dispatch<{ type: string; payload: any }>;
  selectedTrip: number;
}

export default function DndItinerary({
  userTrips,
  dispatchUserTrips,
  selectedTrip,
}: Props) {
  const UTsize =
    ((JSON.stringify(userTrips).length * 2) / 1024).toFixed(2) + " KB";
  // console.log(UTsize);

  const [activeTrip, setActiveTrip] = useState(userTrips[selectedTrip]);

  useEffect(() => {
    setActiveTrip(userTrips[selectedTrip]);
  }, [userTrips]);

  const { itinerary, ...tripInfo } = activeTrip;
  const events = itinerary?.flatMap((day) => day?.events) ?? [];

  const daysId = itinerary?.map((day: Day) => day?.id);
  const eventsId = events?.map((event: any) => event?.id);

  const [activeId, setActiveId] = useState<string | null>(null);

  async function handleDragStart({ active }: any) {
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
    if (typeof activeDate !== "string" || typeof activeDate === undefined)
      return;

    const overIndex = getIndex(itinerary, overType, overId);
    if (typeof overIndex !== "number" || overIndex < 0) return;
    const overDate = getItem(itinerary, events, overId)?.date;
    if (typeof overDate !== "string" || typeof overDate === undefined) return;

    let newItinerary;
    if (activeType === "day" && overType === "day") {
      newItinerary = arrayMove(itinerary, activeIndex, overIndex);
    } else if (activeType === "event" && overType === "day") {
      newItinerary = eventOverDay(
        itinerary,
        events,
        activeId,
        activeIndex,
        activeDate,
        overIndex,
        overDate
      );
    } else if (activeType === "event" && overType === "event") {
      newItinerary = eventOverEvent(
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

    if (!newItinerary) return;
    const iteratedDate = new Date(tripInfo.start_date);
    newItinerary.forEach((day: Day) => {
      const currentDate = formatDate(iteratedDate);

      day.date = currentDate;

      day.events.forEach((event: Event, index: number) => {
        event.position = index;
        event.date = currentDate;
      });

      iteratedDate.setDate(iteratedDate.getDate() + 1);
    });

    setActiveTrip({ itinerary: newItinerary, ...tripInfo });
  }

  function handleEventNameChange(e: any, id: string, date: string) {
    const dayIndex = itinerary.findIndex((day: Day) => day.date === date);
    const eventIndex = itinerary[dayIndex].events.findIndex(
      (event: Event) => event.id === id
    );

    dispatchUserTrips({
      type: UT.UPDATE_EVENT_FIELD,
      payload: {
        selectedTrip: selectedTrip,
        dayIndex: dayIndex,
        eventIndex: eventIndex,
        field: "name",
        value: e.target.value,
      },
    });
  }

  function handleAddEvent(position: string, date?: string, dayIndex?: number) {
    const index = itinerary.findIndex((day: Day) => day.date === date);

    dispatchUserTrips({
      type: UT.INSERT_EVENT,
      payload: {
        selectedTrip: selectedTrip,
        dayIndex: index || dayIndex,
        position: position,
      },
    });
  }

  const value = {
    itinerary,
    tripInfo,
    events,
    daysId,
    eventsId,
    activeId,
  };

  return (
    <section className="relative flex w-[calc(100vw-19rem)] flex-col gap-10">
      <DndDataContext.Provider value={value}>
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={daysId}
            strategy={verticalListSortingStrategy}
          >
            <div className="relative">
              <ul className="flex w-full min-w-fit flex-col">
                {daysId?.map((dayId: string, index: number) => (
                  <DndDay
                    key={dayId}
                    activeId={activeId}
                    index={index}
                    startDate={userTrips?.[selectedTrip]?.start_date}
                    day={getItem(itinerary, events, dayId)}
                    handleEventNameChange={handleEventNameChange}
                    handleAddEvent={handleAddEvent}
                  />
                ))}
              </ul>
              <CalendarEnd totalDays={tripInfo.days} />
            </div>
          </SortableContext>

          {typeof activeId === "string" && daysId?.includes(activeId) ? (
            <DragOverlay
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              dropAnimation={{
                duration: 200,
                easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
              }}
            >
              <DndDayContent
                activeId={activeId}
                index={getIndex(itinerary, "day", activeId)}
                startDate={userTrips?.[selectedTrip].start_date}
                day={getItem(itinerary, events, activeId)}
                overlay={true}
              />
            </DragOverlay>
          ) : null}

          {typeof activeId === "string" && eventsId?.includes(activeId) ? (
            <DragOverlay
              dropAnimation={{
                duration: 250,
                easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
              }}
            >
              <DndEventContent
                event={getItem(itinerary, events, activeId)}
                overlay={true}
              />
            </DragOverlay>
          ) : null}
        </DndContext>
      </DndDataContext.Provider>
    </section>
  );
}
