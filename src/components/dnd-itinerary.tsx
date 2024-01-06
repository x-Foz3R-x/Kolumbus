"use client";

import { ForwardedRef, createContext, forwardRef, memo, useContext, useEffect, useState } from "react";
import Image from "next/image";

import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { GetItem, GetIndex, EventOverDay, EventOverEvent, GetDay, GetEvent, GetDragType, GetDayIndex } from "@/lib/dnd";
import { Trip, Day, Event, UT } from "@/types";

import Icon from "./icons";
import { Calendar, CalendarEnd } from "./itinerary/calendar";
import EventComposer from "./itinerary/event-composer";
import EventPanel from "./itinerary/event-panel";
import { Dropdown, DropdownLink, DropdownOption } from "./ui/dropdown";
import { Button, Divider } from "./ui";
import { EVENT_IMG_FALLBACK } from "@/lib/config";
import { cn, formatDate } from "@/lib/utils";

//#region Context
const DndDataContext = createContext<{
  activeTrip: Trip;
  activeEvent: Event | null;
  setActiveEvent: React.Dispatch<React.SetStateAction<Event | null>>;
  activeId: string | null;

  daysId: string[];
  eventsId: string[];
  events: Event[];

  isEventComposerOpen: boolean;
  setEventComposerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEventPanelOpen: boolean;
  setEventPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;

  itineraryPosition: { y_day: number; x_event: number };
  setItineraryPosition: React.Dispatch<React.SetStateAction<{ y_day: number; x_event: number }>>;
} | null>(null);
export function useDndData() {
  const context = useContext(DndDataContext);
  if (!context) throw new Error("useDndData must be used within a DndDataContext.Provider");
  return context;
}
//#endregion

//#region Itinerary
export default function DndItinerary({ tripId }: { tripId: string }) {
  const { userTrips, dispatchUserTrips, selectedTrip, setSaving } = useAppdata();
  const updateEvent = api.event.update.useMutation();

  const [activeTrip, setActiveTrip] = useState<Trip>(userTrips.find((trip) => trip.id === tripId) ?? ({} as Trip));
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [isEventComposerOpen, setEventComposerOpen] = useState(false);
  const [isEventPanelOpen, setEventPanelOpen] = useState(false);
  const [itineraryPosition, setItineraryPosition] = useState({ y_day: 0, x_event: 0 });

  // to delete/change
  const [apiUpdate, setApiUpdate] = useState<{ type: "day^day" | "event^day" | "event^event" } | null>(null);
  //

  useEffect(() => {
    setActiveTrip(userTrips.find((trip) => trip.id === tripId) ?? ({} as Trip));
  }, [userTrips, setActiveTrip, tripId]);

  const { itinerary, ...tripInfo } = activeTrip;
  const events = itinerary.flatMap((day) => day.events);

  const daysId = itinerary.map((day) => day.id);
  const eventsId = events.map((event) => event.id);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active?.id as string);

    if (GetDragType(active) === "day") {
      const grabbing = document.createElement("div");
      grabbing.id = "grabbing";
      grabbing.setAttribute("style", "position: fixed; top: 0; left: 0; right: 0; bottom: 0; cursor: grabbing; z-index: 999;");
      document.body.appendChild(grabbing);
    }
  };
  const handleDragEnd = ({ collisions }: DragEndEvent) => {
    setActiveId(null);
    document.getElementById("grabbing")?.remove();

    if (apiUpdate === null) return;

    // todo: optimize not to update all events, only the changed ones
    // todo: sync with db, if update fails, revert to previous state
    const currentDate = new Date(tripInfo.startDate);
    itinerary.forEach((day, dayIndex) => {
      day.events.forEach((event, index) => {
        event.date = formatDate(currentDate);
        event.position = index;

        setSaving(true);
        dispatchUserTrips({
          type: UT.UPDATE_EVENT,
          payload: { tripIndex: selectedTrip, dayIndex, event },
        });
        updateEvent.mutate(
          {
            eventId: event.id,
            data: { date: event.date, position: event.position },
          },
          {
            onSuccess(updatedEvent) {
              if (!updatedEvent) return;
              dispatchUserTrips({
                type: UT.UPDATE_EVENT,
                payload: { tripIndex: selectedTrip, dayIndex, event: { ...event, ...(updatedEvent as Event | any) } },
              });
            },
            onError(error) {
              console.log("first error");
              console.error(error);
              dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: activeTrip });
            },
            onSettled() {
              setSaving(false);
            },
          },
        );
      });

      currentDate.setDate(currentDate.getDate() + 1);
    });
  };
  const handleDragOver = ({ active, over }: DragOverEvent) => {
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
      newItinerary = EventOverEvent(itinerary, events, activeId, activeIndex, activeDate, overId, overIndex, overDate);
      setApiUpdate({ type: "event^event" });
    }

    if (!newItinerary) return;

    const currentDate = new Date(tripInfo.startDate);
    newItinerary.forEach((day) => {
      day.date = formatDate(currentDate);

      day.events.forEach((event, index) => {
        event.date = formatDate(currentDate);
        event.position = index;
      });

      currentDate.setDate(currentDate.getDate() + 1);
    });

    setActiveTrip({ itinerary: newItinerary, ...tripInfo });
  };

  const value = {
    activeTrip,
    activeEvent,
    setActiveEvent,

    activeId,
    daysId,
    eventsId,
    events,

    isEventComposerOpen,
    setEventComposerOpen,
    isEventPanelOpen,
    setEventPanelOpen,

    itineraryPosition,
    setItineraryPosition,
  };

  return (
    <div className="relative px-6">
      <DndDataContext.Provider value={value}>
        <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <SortableContext items={daysId} strategy={verticalListSortingStrategy}>
            <EventComposer />
            <EventPanel />

            <ul className="flex w-full min-w-fit flex-col">
              {daysId?.map((dayId) => <DndDay key={dayId} day={GetDay(itinerary, dayId)} />)}
            </ul>
            <CalendarEnd />
          </SortableContext>

          {typeof activeId === "string" && daysId.includes(activeId) ? (
            <DragOverlay
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              dropAnimation={{
                duration: 300,
                easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
              }}
            >
              <DayComponent day={GetDay(itinerary, activeId)} dragging />
            </DragOverlay>
          ) : null}

          {typeof activeId === "string" && eventsId?.includes(activeId) ? (
            <DragOverlay
              dropAnimation={{
                duration: 300,
                easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
              }}
            >
              <EventComponent event={GetEvent(events, activeId)} dragging />
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
      {id !== activeId ? <DayComponent ref={setActivatorNodeRef} day={day} {...attributes} {...listeners} {...props} /> : null}
    </li>
  );
});

type DayComponentProps = {
  day: Day;
  dragging?: boolean;
};
const DayComponent = memo(
  forwardRef(function DndDayContentComponent({ day, dragging, ...props }: DayComponentProps, ref: ForwardedRef<HTMLDivElement>) {
    const { activeTrip, activeId, setEventComposerOpen: setEventComposerDisplay, setItineraryPosition } = useDndData();
    const { id, date, events } = day;

    const dayEventsId = events?.map((event) => event.id);
    const dayIndex = GetDayIndex(activeTrip.itinerary, date);

    const handleAddEvent = () => {
      setEventComposerDisplay(true);
      setItineraryPosition({ y_day: dayIndex, x_event: 0 });
    };

    const eventWidthAndGap = 168;
    return (
      <div ref={ref} className="group/day flex w-full gap-5">
        <Calendar index={dayIndex} dragging={dragging} handleAddEvent={handleAddEvent} {...props} />

        <ul
          className={`flex h-32 origin-left list-none gap-2 pt-5 duration-300 ease-kolumb-flow ${
            id === activeId ? "scale-95" : "scale-100"
          }`}
        >
          <SortableContext items={dayEventsId} strategy={horizontalListSortingStrategy}>
            {dayEventsId?.map((eventId) => <DndEvent key={eventId} event={events.find((event) => event.id === eventId)!} />)}
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
  }),
);
//#endregion

//#region Event
const DndEvent = memo(({ event }: { event: Event }) => {
  const { activeId, activeEvent, isEventPanelOpen } = useDndData();
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
      ${isEventPanelOpen && activeEvent?.id === id ? "w-80 opacity-0" : "w-40 opacity-100"}
      `}
    >
      {id !== activeId && <EventComponent event={event} {...listeners} {...attributes} />}
    </li>
  );
});
DndEvent.displayName = "DndEvent";

type EventComponentProps = {
  event: Event;
  dragging?: boolean;
};
const EventComponent = memo(
  forwardRef<HTMLDivElement, EventComponentProps>(({ event, dragging, ...props }, ref: ForwardedRef<HTMLDivElement>) => {
    const { dispatchUserTrips, selectedTrip } = useAppdata();
    const { activeTrip, setActiveEvent, isEventPanelOpen, setEventPanelOpen, setItineraryPosition } = useDndData();
    const deleteEvent = api.event.delete.useMutation();

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dayIndex = GetDayIndex(activeTrip.itinerary, event.date);

    const openEventPanel = () => {
      setActiveEvent(event);
      setItineraryPosition({ y_day: dayIndex, x_event: event.position });

      if (isEventPanelOpen) {
        setEventPanelOpen(false);
        setTimeout(() => setEventPanelOpen(true), 350);
      } else setEventPanelOpen(true);
    };

    const handleEventDelete = () => {
      if (!event) return;

      const dayIndex = GetDayIndex(activeTrip.itinerary, event.date);

      const events = [...activeTrip.itinerary[dayIndex].events];
      events.splice(event.position, 1);
      events.map((_, index) => ({ position: index }));

      setEventPanelOpen(false);
      dispatchUserTrips({ type: UT.DELETE_EVENT, payload: { tripIndex: selectedTrip, dayIndex, event } });
      deleteEvent.mutate(
        { eventId: event.id, events },
        {
          onSuccess(updatedEvents) {
            if (!updatedEvents) return;
            updatedEvents.forEach((event) => {
              dispatchUserTrips({
                type: UT.UPDATE_EVENT,
                payload: { tripIndex: selectedTrip, dayIndex, event: { ...(event as Event | any) } },
              });
            });
          },
          onError(error) {
            console.error(error);
            dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: activeTrip });
          },
        },
      );
    };

    return (
      <div
        className={`group relative flex h-28 flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-lg border-2 border-white/80 bg-white/80 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter duration-300 ease-kolumb-leave hover:shadow-borderSplashXl hover:ease-kolumb-flow ${
          dragging ? "shadow-borderSplashXl" : "shadow-borderXL"
        }`}
      >
        {!dragging && (
          <span
            className={`absolute right-1 top-1 z-20 grid h-6 w-14 grid-cols-2 overflow-hidden rounded border-gray-200 bg-white fill-gray-500 shadow-lg duration-300 ease-kolumb-leave group-hover:opacity-100 group-hover:ease-kolumb-flow ${
              isDropdownOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <button onClick={openEventPanel} className="w-full border-r border-gray-200 duration-200 ease-kolumb-flow hover:bg-gray-100">
              <Icon.eventPanel className="m-auto h-3" />
            </button>

            <Dropdown
              isOpen={isDropdownOpen}
              setOpen={setDropdownOpen}
              listLength={5}
              skipIndexes={[...(event?.url ? [] : [2]), 3]}
              container={{ selector: "main", padding: 12 }}
              offset={8}
              className="w-44"
              buttonProps={{
                variant: "unstyled",
                size: "unstyled",
                className: "h-full w-full rounded-none duration-200 ease-kolumb-flow hover:bg-gray-100 focus-visible:bg-kolumblue-100",
                children: <Icon.horizontalDots className="m-auto w-4" />,
              }}
            >
              <DropdownOption index={0} onClick={openEventPanel}>
                <Icon.eventPanel className="h-4 w-4" />
                Event panel
              </DropdownOption>
              <DropdownOption index={1} onClick={() => event.address && navigator.clipboard.writeText(event.address)}>
                <Icon.clipboardPin className="h-4 w-4" />
                Copy address
              </DropdownOption>

              <DropdownLink index={2} href={event?.url ?? undefined} target="_blank">
                <Icon.googleMapsIcon className="h-4 w-4" />
                <span>
                  <Icon.googleMapsText className="mr-1 inline-block h-3.5 fill-gray-600 dark:fill-gray-300" />
                  <Icon.arrowTopRight className="mb-1.5 inline-block h-1.5 fill-gray-600 dark:fill-gray-300" />
                </span>
              </DropdownLink>

              <Divider className="my-1.5 bg-gray-100" />

              <DropdownOption index={3}>
                <Icon.duplicate className="h-4 w-4" />
                Duplicate
              </DropdownOption>
              <DropdownOption index={4} onClick={handleEventDelete} variant="danger">
                <Icon.trash className="h-4 w-4" />
                Delete
              </DropdownOption>
            </Dropdown>
          </span>
        )}

        <div ref={ref} onClick={() => setActiveEvent(event)} className="relative flex-1 cursor-pointer" {...props}>
          <Image
            src={`${event?.photo ? `/api/get-google-image?photoRef=${event.photo}&width=156&height=82` : EVENT_IMG_FALLBACK}`}
            alt="Event Image"
            className="h-20 object-cover object-center"
            sizes="156px"
            priority
            fill
          />
        </div>

        <p
          className={cn(
            "group/name relative mt-0.5 whitespace-nowrap bg-transparent px-1 py-0.5 text-sm text-gray-900",
            !event.name && "text-center text-red-500",
          )}
        >
          {event?.name ?? "error"}
          {!dragging && (
            <Button
              onClick={() => navigator.clipboard.writeText(event.name)}
              variant="unstyled"
              size="unstyled"
              className="absolute inset-y-0 right-0 z-10 bg-gradient-to-r from-transparent via-white to-white fill-gray-500 pl-8 pr-2 opacity-0 duration-300 ease-kolumb-leave hover:fill-gray-900 group-hover/name:opacity-100 group-hover/name:ease-kolumb-flow"
            >
              <Icon.copy className="m-auto h-3" />
            </Button>
          )}
        </p>

        <span className="absolute bottom-0 right-0 h-6 w-6 bg-gradient-to-r from-transparent to-white" />
      </div>
    );
  }),
);
//#endregion
