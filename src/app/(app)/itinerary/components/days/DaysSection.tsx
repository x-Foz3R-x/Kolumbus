"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  memo,
} from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  getFirstCollision,
  rectIntersection,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortedTripsEvents,
  useSetTripsEvents,
} from "@/hooks/useSortedUserTrips";
import SortableEvent from "./SortableEvent";

import Event from "./Event";

export default function DaysSection() {
  const [days, dispatchTripEvents] = useSortedTripsEvents();

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  // console.log(days);
  // let x = useSetTripsEvents(days);
  // dispatchTripEvents({
  //   type: ACTION.REPLACE,
  //   payload: x,
  // });
  // useSetTripsEvents(XD);

  const handleDragEnd = (e: any) => {
    console.log("handle drag End");
    const { active, over } = e;

    if (active.id != over.id) {
    }
  };

  return (
    <section className="flex w-full flex-col gap-5 py-5">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={({ active }) => {
          setActiveId(active.id);
        }}
        onDragEnd={handleDragEnd}
      >
        {days?.map((day: { id: string; events: [] }, index: number) => (
          <>
            {console.log(day.events)}
            <SortableContext
              key={day.id}
              items={day.events}
              strategy={horizontalListSortingStrategy}
            >
              <ul className="flex h-[6.75rem] gap-[0.625rem]">
                {day.events?.map((event: any) => (
                  <SortableEvent key={event.id} event={event} />
                ))}
              </ul>
            </SortableContext>
          </>
        ))}
        <DragOverlay adjustScale={false}>
          {activeId ? <div>ELO</div> : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}
