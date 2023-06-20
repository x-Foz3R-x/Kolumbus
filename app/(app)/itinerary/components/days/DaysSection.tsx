"use client";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  useSortedTripsEvents,
  useSetTripsEvents,
} from "@/hooks/useSortedUserTrips";

import Event from "./Event";

export default function DaysSection() {
  const [days, dispatchTripEvents] = useSortedTripsEvents();
  console.log(days);
  // let x = useSetTripsEvents(days);
  // dispatchTripEvents({
  //   type: ACTION.REPLACE,
  //   payload: x,
  // });
  // useSetTripsEvents(XD);

  const handleDragAndDrop = () => {
    console.log("handle drag and drop");
  };

  return (
    <section className="flex w-full flex-col gap-5 py-5 pl-4">
      <DragDropContext onDragEnd={handleDragAndDrop}>
        {days?.map((day: { id: string; events: object[] }, index: number) => (
          <Droppable key={day.id} droppableId={day.id} direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex h-[108px] bg-kolumblue-200"
              >
                {day.events.map((event, index): any => (
                  <Draggable
                    key={event.id}
                    draggableId={event.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="h-10 w-32">
                          <Event event={event} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </section>
  );
}
