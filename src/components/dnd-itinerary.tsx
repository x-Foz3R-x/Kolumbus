"use client";

import { ForwardedRef, createContext, forwardRef, memo, useContext, useEffect, useState } from "react";
import Image from "next/image";

import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { GetItem, GetIndex, EventOverDay, EventOverEvent, GetDay, GetEvent, GetDragType, GetDayPosition } from "@/lib/dnd";
import { Trip, Day, Event, UT } from "@/types";

import { Calendar, CalendarEnd } from "./itinerary/calendar";
import EventComposer from "./itinerary/event-composer";
import EventPanel from "./itinerary/event-panel";
import Icon from "./icons";
import  {Dropdown, DropdownList, DropdownOption } from "./ui/dropdown";
import Divider from "./ui/divider";

//#region Context
const DndDataContext = createContext<{
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
export default function DndItinerary({ userTrips }: { userTrips: Trip[] }) {
  const { dispatchUserTrips, selectedTrip, setSaving } = useAppdata();
  const updateEvent = api.event.update.useMutation();

  const [activeTrip, setActiveTrip] = useState<Trip>(userTrips[selectedTrip]);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [isEventComposerDisplayed, setEventComposerDisplay] = useState(false);
  const [isEventPanelDisplayed, setEventPanelDisplay] = useState(false);
  const [itineraryPosition, setItineraryPosition] = useState({ y_day: 0, x_event: 0 });

  // to delete/change
  const [apiUpdate, setApiUpdate] = useState<{ type: "day^day" | "event^day" | "event^event" } | null>(null);
  //

  useEffect(() => {
    setActiveTrip(userTrips[selectedTrip]);
  }, [userTrips, selectedTrip]);

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
    const iteratedDate = new Date(tripInfo.startDate);
    itinerary.forEach((day, dayPosition) => {
      day.events.forEach((event, index) => {
        event.date = iteratedDate.toISOString();
        event.position = index;

        setSaving(true);
        dispatchUserTrips({
          type: UT.UPDATE_EVENT,
          payload: { selectedTrip, dayPosition, event },
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
                payload: { selectedTrip, dayPosition, event: { ...event, ...(updatedEvent as Event) } },
              });
            },
            onError(error) {
              console.error(error);
              dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: activeTrip });
            },
            onSettled() {
              setSaving(false);
            },
          },
        );
      });

      iteratedDate.setDate(iteratedDate.getDate() + 1);
    });
    setApiUpdate(null);
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
  };

  const value = {
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

    itineraryPosition,
    setItineraryPosition,
  };

  return (
    <div className="relative flex flex-col gap-10">
      <DndDataContext.Provider value={value}>
        <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <SortableContext items={daysId} strategy={verticalListSortingStrategy}>
            <EventComposer />
            <EventPanel />

            <ul className="flex w-full min-w-fit flex-col">
              {daysId?.map((dayId) => <DndDay key={dayId} day={GetDay(itinerary, dayId)} />)}
              <CalendarEnd totalDays={daysId.length} />
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
      {id !== activeId ? <DayComponent ref={setActivatorNodeRef} day={day} {...attributes} {...listeners} {...props} /> : null}
    </li>
  );
});

type DayComponentProps = {
  day: Day;
  dragOverlay?: boolean;
};
const DayComponent = memo(
  forwardRef(function DndDayContentComponent({ day, dragOverlay, ...props }: DayComponentProps, ref: ForwardedRef<HTMLDivElement>) {
    const { activeTrip, activeId, setEventComposerDisplay, setItineraryPosition } = useDndData();
    const { id, date, events } = day;

    const dayEventsId = events?.map((event) => event.id);
    const dayPosition = GetDayPosition(activeTrip.itinerary, date);

    const handleAddEvent = () => {
      setEventComposerDisplay(true);
      setItineraryPosition({ y_day: dayPosition, x_event: 0 });
    };

    const eventWidthAndGap = 168;
    return (
      <div ref={ref} className="group/day flex w-full gap-5">
        <Calendar dayPosition={dayPosition} dragOverlay={dragOverlay} handleAddEvent={handleAddEvent} {...props} />

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
  forwardRef<HTMLDivElement, EventComponentProps>(({ event, dragOverlay, ...props }, ref: ForwardedRef<HTMLDivElement>) => {
    const { dispatchUserTrips, selectedTrip, setSaving } = useAppdata();
    const { activeTrip, setActiveEvent, isEventPanelDisplayed, setEventPanelDisplay, setItineraryPosition } = useDndData();
    const deleteEvent = api.event.delete.useMutation();

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dayPosition = GetDayPosition(activeTrip.itinerary, event.date);

    const getImageUrl = (): string => {
      if (!event.photo) return "/images/event-placeholder.png";
      if (event.photo.startsWith("http")) return event.photo;

      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=312&maxheight=160&photo_reference=${event.photo}&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`;
    };

    const openEventPanel = () => {
      setActiveEvent(event);
      setItineraryPosition({ y_day: dayPosition, x_event: event.position });

      if (isEventPanelDisplayed) {
        setEventPanelDisplay(false);
        setTimeout(() => setEventPanelDisplay(true), 350);
      } else setEventPanelDisplay(true);
    };

    const dropdownList: DropdownList = [
      { onSelect: openEventPanel, index: 0 },
      {
        onSelect: () => {
          if (event.address) navigator.clipboard.writeText(event.address);
        },
        index: 1,
      },
      { onSelect: () => {}, index: 2 },
      { onSelect: () => {}, index: 3 },
      {
        onSelect: () => {
          if (!event) return;

          const dayPosition = GetDayPosition(activeTrip.itinerary, event.date);

          const events = [...activeTrip.itinerary[dayPosition].events];
          events.splice(event.position, 1);
          events.map((event, index) => ({ position: index }));

          setSaving(true);
          setEventPanelDisplay(false);
          dispatchUserTrips({ type: UT.DELETE_EVENT, payload: { selectedTrip, dayPosition, event } });
          deleteEvent.mutate(
            { eventId: event.id, events },
            {
              onSuccess(updatedEvents) {
                if (!updatedEvents) return;
                updatedEvents.forEach((event) => {
                  dispatchUserTrips({ type: UT.UPDATE_EVENT, payload: { selectedTrip, dayPosition, event: { ...(event as Event) } } });
                });
              },
              onError(error) {
                console.error(error);
                dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: activeTrip });
              },
              onSettled() {
                setSaving(false);
              },
            },
          );
        },
        index: 4,
      },
    ];

    return (
      <div
        className={`group relative flex h-28 flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-lg border-2 border-white/80 bg-white/80 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter duration-300 ease-kolumb-leave hover:shadow-borderSplashXl hover:ease-kolumb-flow ${
          dragOverlay ? "shadow-borderSplashXl" : "shadow-borderXL"
        }`}
      >
        {!dragOverlay && (
          <span className="absolute right-1 top-1 z-20 flex h-6 w-14 overflow-hidden rounded border-gray-200 bg-white fill-gray-500 opacity-0 shadow-lg duration-300 ease-kolumb-leave group-hover:opacity-100 group-hover:ease-kolumb-flow">
            <button onClick={openEventPanel} className="w-full border-r border-gray-200 duration-200 ease-kolumb-flow hover:bg-gray-100">
              <Icon.pinPen className="m-auto h-3" />
            </button>

            <Dropdown
              isOpen={isDropdownOpen}
              setOpen={setDropdownOpen}
              list={dropdownList}
              container={{ selector: "main", margin: [56, 0, 0, 224], padding: 12 }}
              buttonVariant="unstyled"
              className={{
                container: "flex h-full w-full items-center justify-center",
                button: "h-full w-full duration-200 ease-kolumb-flow hover:bg-gray-100 focus-visible:bg-kolumblue-100",
                dropdown: "whitespace-nowrap",
              }}
              buttonChildren={<Icon.horizontalDots className="m-auto w-4" />}
            >
              <DropdownOption index={0}>Event panel</DropdownOption>
              <DropdownOption index={1}>Copy address</DropdownOption>
              <DropdownOption index={2} disabled>
                Find in Google Maps
              </DropdownOption>

              <Divider className="rounded bg-white/25" />

              <DropdownOption index={3} disabled>
                Duplicate
              </DropdownOption>
              <DropdownOption index={4} optionVariant="danger">
                Delete
              </DropdownOption>
            </Dropdown>
          </span>
        )}

        <div ref={ref} onClick={() => setActiveEvent(event)} className="flex-1 cursor-pointer" {...props}>
          <Image src={getImageUrl()} alt="Event Image" width={156} height={80} priority className="h-20 object-cover object-center" />
        </div>

        <input
          type="text"
          name="event-name"
          placeholder="-"
          value={event.name ?? ""}
          onClick={() => event.name && navigator.clipboard.writeText(event.name)}
          readOnly
          className="mt-0.5 flex-shrink-0 cursor-pointer text-ellipsis bg-transparent px-1 py-[3px] text-sm text-gray-900 placeholder:text-center hover:bg-gray-400/25"
        />
      </div>
    );
  }),
);
//#endregion
