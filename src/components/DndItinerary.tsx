"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  getFirstCollision,
  rectIntersection,
  UniqueIdentifier,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  getItem,
  getIndex,
  getDragHorizontalDirection,
  eventOverDay,
  eventOverEvent,
} from "@/lib/dnd";

import { produce } from "immer";
import { FormatDate, ACTIONS } from "@/lib/utils";
import { Day } from "@/types";

import DndDay from "./DndDay";
import { DndEventContent } from "./DndEvent";

const CurrentTripDATA = [
  {
    id: "uidHh4tHx9te7sH83ueM",
    name: "Stężyca",
    days: 5,
    end_date: "2023-06-13",
    start_date: "2023-06-09",
    itinerary: [
      {
        id: "d1",
        date: "2023-06-09",
        drag_type: "day",
        events: [
          {
            id: "e1",
            name: "event 1",
            position: 0,
            date: "2023-06-09",
            drag_type: "event",
          },
        ],
      },
      {
        id: "d2",
        date: "2023-06-10",
        drag_type: "day",
        events: [
          {
            id: "e2",
            name: "event 2",
            position: 0,
            date: "2023-06-10",
            drag_type: "event",
          },
          {
            id: "e3",
            name: "event 3",
            position: 1,
            date: "2023-06-10",
            drag_type: "event",
          },
          {
            id: "e4",
            name: "event 4",
            position: 2,
            date: "2023-06-10",
            drag_type: "event",
          },
        ],
      },
      {
        id: "d3",
        date: "2023-06-11",
        drag_type: "day",
        events: [],
      },
      {
        id: "d4",
        date: "2023-06-12",
        drag_type: "day",
        events: [
          {
            id: "e5",
            name: "event 5",
            position: 0,
            date: "2023-06-12",
            drag_type: "event",
          },
          {
            id: "e6",
            name: "event 6",
            position: 1,
            date: "2023-06-12",
            drag_type: "event",
          },
        ],
      },
      {
        id: "d5",
        date: "2023-06-13",
        drag_type: "day",
        events: [
          {
            id: "e7",
            name: "event 7",
            position: 0,
            date: "2023-06-13",
            drag_type: "event",
          },
          {
            id: "e8",
            name: "event 8",
            position: 1,
            date: "2023-06-13",
            drag_type: "event",
          },
          {
            id: "e9",
            name: "event 9",
            position: 2,
            date: "2023-06-13",
            drag_type: "event",
          },
        ],
      },
    ],
  },
];

export default function DndItinerary({
  userTrips,
  dispatchUserTrips,
  selectedTrip,
}: any) {
  const [activeTrip, setActiveTrip] = useState(userTrips[selectedTrip]);
  // const [activeTrip, setActiveTrip] = useState(CurrentTripDATA[0]);

  const { itinerary, ...tripInfo } = activeTrip;
  const events = itinerary?.map((day: Day) => day.events).flat();

  const daysId = itinerary?.map((day: Day) => day.id);
  const eventsId = events?.map((event: any) => event.id);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [daysId]);

  async function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active?.id);
  }

  function handleDragEnd() {
    setActiveId(null);
    dispatchUserTrips({
      type: ACTIONS.REPLACE_TRIP,
      payload: activeTrip,
    });
  }

  function handleDragOver({ active, over }: DragOverEvent) {
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

    const dragDirection = getDragHorizontalDirection({ active, over });
    if (!dragDirection) return;

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
        overDate,
        dragDirection
      );
    }

    if (!newItinerary) return;
    newItinerary = produce(newItinerary, (draft: any) => {
      let iteratedDate = new Date(CurrentTripDATA[0].start_date);
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

  return (
    <ul className="group/calendar flex flex-col">
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={daysId} strategy={verticalListSortingStrategy}>
          {daysId?.map((dayId: string, index: number) => (
            <DndDay
              key={dayId}
              day={getItem(itinerary, events, dayId)}
              activeId={activeId}
              trip={userTrips[selectedTrip]}
              index={index}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {typeof activeId === "string" && eventsId.includes(activeId) ? (
            <DndEventContent event={getItem(itinerary, events, activeId)} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </ul>
  );
}
