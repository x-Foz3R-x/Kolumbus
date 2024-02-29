"use client";

import { MouseEvent, memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import cuid2 from "@paralleldrive/cuid2";

import api from "@/app/_trpc/client";
import { UpdateEventData } from "@/server/routers/event";
import useAppdata from "@/context/appdata";
import { useDndItineraryContext } from "../dnd-context";
import { EVENT_IMG_FALLBACK } from "@/lib/config";
import { EASING } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";
import { Day, Event, UT } from "@/types";

import Icon from "../../icons";
import { Button, ScrollIndicator } from "../../ui";
import { ActivityUIOverlay } from "./activity-ui-overlay";
import { ActivityDetails } from "./activity-details";

// General
// todo - Context Menu (like in floating ui react examples)

type DndEventProps = {
  event: Event;
  day: Day;
  dayIndex: number;
  isSelected: boolean;
};
export const Activity = memo(function Activity({ event, day, dayIndex, isSelected }: DndEventProps) {
  const { dispatchUserTrips, setSaving } = useAppdata();
  const { userId, tripId, getItineraryClone, selectEvent, deleteEvents } = useDndItineraryContext();
  const updateTrip = api.trip.update.useMutation();
  const createEvent = api.event.create.useMutation();
  const updateEvent = api.event.update.useMutation();

  const [isOpen, setIsOpen] = useState(false);

  const { setNodeRef, setActivatorNodeRef, active, over, isDragging, attributes, listeners, transform, transition } = useSortable({
    id: event.id,
    data: { type: "event", dayIndex },
    disabled: isOpen,
    animateLayoutChanges: (args) => (args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true),
  });

  const eventCacheRef = useRef(event);
  const nameScrollRef = useRef<HTMLDivElement>(null);

  const setEvent = (event: Event) => {
    dispatchUserTrips({ type: UT.UPDATE_EVENT, payload: { tripId, event } });
  };

  //#region Handlers
  const handleOpen = () => {
    setIsOpen(true);
    eventCacheRef.current = event;
  };

  const handleClose = (event: Event, eventCache: Event) => {
    const updateData: UpdateEventData = Object.keys(event).reduce((diff, key) => {
      const eventKey = key as keyof Event;
      if (eventCache[eventKey] !== event[eventKey]) return { ...diff, [key]: event[eventKey] };
      return diff;
    }, {});

    // If no changes were made, return
    if (Object.keys(updateData).length === 0) return;

    setSaving(true);
    dispatchUserTrips({ type: UT.UPDATE_EVENT, payload: { tripId, event } });
    updateEvent.mutate(
      { eventId: event.id, data: updateData },
      {
        onSuccess(updatedEvent) {
          if (!updatedEvent) return;
          dispatchUserTrips({ type: UT.UPDATE_EVENT, payload: { tripId, event: { ...event, updatedAt: updatedEvent.updatedAt } } });
        },
        onError(error) {
          console.error(error);
          dispatchUserTrips({ type: UT.UPDATE_EVENT, payload: { tripId, event: eventCache } });
        },
        onSettled: () => setSaving(false),
      },
    );
    updateTrip.mutate({ tripId, data: { updatedAt: new Date() } });
  };

  const handleClick = (e: MouseEvent) => {
    if (isOpen || !!active) return;
    if (e.target instanceof HTMLButtonElement) return;
    if (e.target instanceof HTMLUListElement) return;

    if (e.ctrlKey || e.metaKey) handleSelect();
    else {
      setIsOpen(true);
      eventCacheRef.current = event;
    }
  };

  const handleSelect = () => {
    selectEvent(event.id);
  };

  const handleDuplicate = () => {
    const clonedItinerary = getItineraryClone();

    const position = event.position + 1;
    const duplicate: Event = { ...event, id: cuid2.createId(), position, createdBy: userId };
    const eventsToShift = day.events.slice(position);

    setSaving(true);
    // Shift the events to make space for the new event
    eventsToShift.map((event) => {
      const eventCache = { ...event };
      const newPosition = event.position + 1;

      dispatchUserTrips({ type: UT.UPDATE_EVENT, payload: { tripId, event: { ...event, position: newPosition } } });
      updateEvent.mutate(
        { eventId: event.id, data: { position: newPosition } },
        {
          onSuccess(updatedEvent) {
            if (!updatedEvent) return;
            dispatchUserTrips({
              type: UT.UPDATE_EVENT,
              payload: { tripId, event: { ...event, position: newPosition, updatedAt: updatedEvent.updatedAt } },
            });
          },
          onError(error) {
            console.error(error);
            dispatchUserTrips({ type: UT.UPDATE_EVENT, payload: { tripId, event: eventCache } });
          },
          onSettled: () => setSaving(false),
        },
      );
    });

    setSaving(true);
    dispatchUserTrips({ type: UT.CREATE_EVENT, payload: { tripId, event: duplicate, index: position } });
    createEvent.mutate(duplicate, {
      onSuccess(updatedEvent) {
        if (!updatedEvent) return;
        dispatchUserTrips({
          type: UT.UPDATE_EVENT,
          payload: { tripId, event: { ...duplicate, createdAt: updatedEvent.createdAt, updatedAt: updatedEvent.updatedAt } },
        });
      },
      onError(error) {
        console.error(error);
        dispatchUserTrips({ type: UT.REPLACE_ITINERARY, payload: { tripId, itinerary: clonedItinerary } });
      },
      onSettled: () => setSaving(false),
    });
  };

  const handleDelete = () => {
    setIsOpen(false);
    deleteEvents([event.id]);
  };
  //#endregion

  //#region FadeIn animation
  const [showAnimation, setShowAnimation] = useState(true);
  const timeoutId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeoutId.current);

    if (!isDragging) timeoutId.current = setTimeout(() => setShowAnimation(false), 250);
    else setShowAnimation(true);
  }, [isDragging]);
  //#endregion

  return (
    <motion.li
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      className={cn(
        "visible relative h-28 w-40 origin-top rounded-lg",
        showAnimation && "animate-fadeIn",
        isDragging && "-z-10 animate-slideIn border-2 border-dashed border-gray-300 bg-gray-50",
        active?.id === event.id && over?.id === "trash" && "hidden",
      )}
      animate={{
        width: isOpen ? "320px" : "160px",
        height: isOpen ? "0px" : "112px",
        overflow: isOpen ? "hidden" : "visible",
      }}
      transition={{
        width: { ease: EASING.anticipate, duration: 0.6 },
        height: { duration: 0, delay: isOpen ? 0 : 0.6 },
        overflow: { duration: 0, delay: isOpen ? 0 : 0.6 },
      }}
    >
      {!isDragging && (
        <>
          <div
            ref={setActivatorNodeRef}
            onClick={handleClick}
            className={cn(
              "group/event relative flex h-full w-full flex-col overflow-hidden rounded-lg border-2 border-white bg-white shadow-borderXL duration-300 ease-kolumb-out hover:shadow-border2XL hover:ease-kolumb-flow",
              isSelected && "border-kolumblue-200 bg-kolumblue-200",
            )}
            {...attributes}
            {...listeners}
          >
            <ActivityUIOverlay
              event={event}
              onOpen={handleOpen}
              onSelect={handleSelect}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              disable={isOpen || !!active}
            />

            {/* Image */}
            <div className="relative h-[82px] flex-shrink-0 cursor-pointer">
              <Image
                src={`${event?.photo ? `/api/get-google-image?photoRef=${event.photo}&width=156&height=82` : EVENT_IMG_FALLBACK}`}
                alt="Event Image"
                className="select-none object-cover object-center"
                sizes="156px"
                priority
                fill
              />
            </div>

            {/* Name */}
            <div className="group relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-900">
              <div ref={nameScrollRef} className="w-full select-none">
                {event.name}
                <ScrollIndicator scrollRef={nameScrollRef} className={isSelected ? "from-kolumblue-200" : ""} />
              </div>

              {!active && (
                <Button
                  onClick={() => navigator.clipboard.writeText(event.name)}
                  variant="unset"
                  size="unset"
                  className="absolute inset-y-0 right-0 z-10 fill-gray-500 px-2 opacity-0 duration-300 ease-kolumb-out hover:fill-gray-900 group-hover:opacity-100 group-hover:ease-kolumb-flow"
                >
                  <Icon.copy className="pointer-events-none relative z-10 m-auto h-3" />

                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white via-white to-transparent",
                      isSelected && "from-kolumblue-200 via-kolumblue-200",
                    )}
                  />
                </Button>
              )}
            </div>
          </div>

          <ActivityDetails
            event={event}
            eventCacheRef={eventCacheRef}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setEvent={setEvent}
            onDelete={() => deleteEvents([event.id])}
            onClose={handleClose}
          />
        </>
      )}
    </motion.li>
  );
});
