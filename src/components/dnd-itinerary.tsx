"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { produce } from "immer";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  getFirstCollision,
  rectIntersection,
} from "@dnd-kit/core";
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
import { FormatDate } from "@/lib/utils";
import { UT } from "@/config/actions";
import { Day, Event } from "@/types";

import DndDay, { DndDayContent } from "./dnd-day";
import { DndEventContent } from "./dnd-event";
import CalendarEnd from "./app/itinerary/calendar-end";

export default function DndItinerary({
  userTrips,
  dispatchUserTrips,
  selectedTrip,
}: any) {
  const [activeTrip, setActiveTrip] = useState(userTrips[selectedTrip]);

  const { itinerary, ...tripInfo } = activeTrip;
  const events = itinerary?.map((day: Day) => day?.events).flat();

  const daysId = itinerary?.map((day: Day) => day?.id);
  const eventsId = events?.map((event: any) => event?.id);

  const [activeId, setActiveId] = useState<string | null>(null);
  const lastOverId = useRef<string | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [daysId]);

  async function handleDragStart({ active }: any) {
    setActiveId(active?.id);
    document.body.style.cursor = "grabbing";
  }

  function handleDragEnd() {
    setActiveId(null);
    dispatchUserTrips({
      type: UT.REPLACE_TRIP,
      payload: activeTrip,
    });
    document.body.style.cursor = "";
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
    newItinerary = produce(newItinerary, (draft: any) => {
      const iteratedDate = new Date(userTrips[selectedTrip].start_date);
      draft.forEach((day: any) => {
        const currentDate = FormatDate(iteratedDate);

        day.date = currentDate;

        day.events.forEach((event: any, index: number) => {
          event.position = index;
          event.date = currentDate;
        });

        iteratedDate.setDate(iteratedDate.getDate() + 1);
      });
    });

    recentlyMovedToNewContainer.current = true;
    setActiveTrip({ itinerary: newItinerary, ...tripInfo });
  }

  function handleEventNameChange(e: any, id: string, date: string) {
    const dayIndex = itinerary.findIndex((day: Day) => day.date === date);
    const eventIndex = itinerary[dayIndex].events.findIndex(
      (event: Event) => event.id === id
    );

    dispatchUserTrips({
      type: UT.UPDATE_EVENT_FIELD,
      tripIndex: selectedTrip,
      dayIndex: dayIndex,
      eventIndex: eventIndex,
      field: "name",
      payload: e.target.value,
    });
  }

  return (
    <section className="relative ml-5 flex w-[calc(100vw-17.75rem)] flex-col gap-10 ">
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={daysId} strategy={verticalListSortingStrategy}>
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
                />
              ))}
            </ul>
            <CalendarEnd totalDays={tripInfo.days} />
            <div
              style={{ height: 128 * tripInfo.days + 20 + "px" }}
              className="absolute top-0 w-32 flex-none rounded-xl shadow-kolumblue"
            ></div>
          </div>
        </SortableContext>

        {daysId?.includes(activeId) && typeof activeId === "string" ? (
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

        {eventsId?.includes(activeId) && typeof activeId === "string" ? (
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
    </section>
  );
}
