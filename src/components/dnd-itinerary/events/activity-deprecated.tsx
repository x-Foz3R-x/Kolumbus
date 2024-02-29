"use client";

import { MouseEvent, memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import cuid2 from "@paralleldrive/cuid2";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import useCloseTriggers from "@/hooks/use-close-triggers";
import useScopeTabNavigation from "@/hooks/use-scope-tab-navigation";
import { EVENT_IMG_FALLBACK } from "@/lib/config";
import { EASING } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";

import { useDndItineraryContext } from "../dnd-context";
import { UpdateEventData } from "@/server/routers/event";
import { Day, Event, KEY, UT } from "@/types";

import Icon from "../../icons";
import { Button, ButtonVariants, Input, TextArea } from "../../ui";
import { ActivityName } from "./activity-name-deprecated";
import { ActivityUIOverlay } from "./activity-ui-overlay";

// General
// todo - Context Menu (like in floating ui react examples)

// Expanded event
// todo - Individual input undo buttons
// todo - Control-z undo (at least one back)
// todo - Shift-control-z redo (at least one forward)
// todo - History of changes (at least 10) for undo/redo
// todo - Opening hours in tooltip
// todo - Editable Opening hours
// todo - Cost currency dropdown
// todo - Icons with tooltip for controls or instead of text (not 100% sure about this)
// todo - Tooltip info icon with created at and updated at dates
// todo - upload photo/link to change activity photo
// todo - remove photo

// activity details height: borderHeight + imageHeight + NameHeight + controlsHeight -> 8 + 164 + 44 + 48 = 264
const EXPANDED_HEIGHT = 264;

type DndEventProps = {
  event: Event;
  day: Day;
  dayIndex: number;
  isSelected: boolean;
  setExpandedEventDate: React.Dispatch<React.SetStateAction<string>>;
};
export const Activity = memo(function Activity({ event, day, dayIndex, isSelected, setExpandedEventDate }: DndEventProps) {
  const { dispatchUserTrips, setSaving } = useAppdata();
  const { userId, tripId, getItineraryClone, selectEvent, deleteEvents } = useDndItineraryContext();
  const createEvent = api.event.create.useMutation();
  const updateEvent = api.event.update.useMutation();

  const [isOpen, setIsOpen] = useState(false);

  const { setNodeRef, setActivatorNodeRef, node, active, over, isDragging, attributes, listeners, transform, transition } = useSortable({
    id: event.id,
    data: { type: "event", dayIndex },
    disabled: isOpen,
    animateLayoutChanges: (args) => (args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true),
  });

  const [name, setName] = useState(event.name);
  const [address, setAddress] = useState(event.address);
  const [phoneNumber, setPhoneNumber] = useState(event.phoneNumber);
  const [cost, setCost] = useState(event.cost);
  const [website, setWebsite] = useState(event.website);
  const [note, setNote] = useState(event.note);

  const eventCacheRef = useRef(event);

  //#region Handlers
  const handleOpen = () => {
    setIsOpen(true);
    setExpandedEventDate(event.date);
    eventCacheRef.current = event;
  };

  const handleClose = () => {
    setIsOpen(false);

    const updateData: UpdateEventData = Object.keys(event).reduce((diff, key) => {
      const eventKey = key as keyof Event;
      if (eventCacheRef.current[eventKey] !== event[eventKey]) return { ...diff, [key]: event[eventKey] };
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
          dispatchUserTrips({ type: UT.UPDATE_EVENT, payload: { tripId, event: eventCacheRef.current } });
        },
        onSettled: () => setSaving(false),
      },
    );
  };

  const handleClick = (e: MouseEvent) => {
    if (isOpen) return;
    if (e.target instanceof HTMLButtonElement) return;
    if (e.target instanceof HTMLUListElement) return;

    if (e.ctrlKey || e.metaKey) handleSelect();
    else {
      setIsOpen(true);
      setExpandedEventDate(event.date);
      eventCacheRef.current = event;
    }
  };

  const handleChange = (data: UpdateEventData) => {
    dispatchUserTrips({ type: UT.UPDATE_EVENT, payload: { tripId, event: { ...event, ...data } } });
  };

  const handleCancel = () => {
    handleUndo();
    setIsOpen(false);
  };

  const handleUndo = () => {
    dispatchUserTrips({ type: UT.UPDATE_EVENT, payload: { tripId, event: eventCacheRef.current } });

    setName(eventCacheRef.current.name);
    setAddress(eventCacheRef.current.address);
    setPhoneNumber(eventCacheRef.current.phoneNumber);
    setCost(eventCacheRef.current.cost);
    setWebsite(eventCacheRef.current.website);
    setNote(eventCacheRef.current.note);
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

  //#region Height observer
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [detailsHeight, setDetailsHeight] = useState(246);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries.length) return;
      setDetailsHeight((entries[0].target as HTMLElement).offsetHeight);
    });

    // console.log(detailsRef.current, isOpen);
    if (isOpen && detailsRef.current) resizeObserver.observe(detailsRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [detailsRef, isOpen]);
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

  useEffect(() => (active ? setIsOpen(false) : undefined), [active]);
  useScopeTabNavigation(node, isOpen);
  useCloseTriggers([node], handleClose, isOpen);

  return (
    <motion.li
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      className={cn(
        "relative h-28 w-40 rounded-lg",
        showAnimation && "animate-fadeIn",
        isDragging && "-z-10 animate-slideIn border-2 border-dashed border-gray-300 bg-gray-50",
        active?.id === event.id && over?.id === "trash" && "opacity-0",
      )}
      animate={{
        width: isOpen ? "320px" : "160px",
        height: isOpen ? `${detailsHeight + EXPANDED_HEIGHT}px` : "112px",
        transition: { ease: EASING.anticipate, duration: 0.6 },
      }}
    >
      {!isDragging ? (
        <motion.div
          ref={setActivatorNodeRef}
          onClick={handleClick}
          className={cn(
            "group/event relative flex h-full w-full flex-col overflow-hidden rounded-lg border-2 border-white bg-white shadow-borderXL",
            isSelected && "border-kolumblue-200 bg-kolumblue-200",
          )}
          animate={{
            borderWidth: isOpen ? "4px" : "2px",
            borderRadius: isOpen ? "16px" : "8px",
            boxShadow: isOpen
              ? "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.03), 0 2px 2px rgba(0,0,0,0.03), 0 4px 4px rgba(0,0,0,0.03), 0 8px 8px rgba(0,0,0,0.03), 0 12px 12px rgba(0,0,0,0.03), 0px 16px 16px rgba(0,0,0,0.03), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba05,0,0,0)"
              : "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.02), 0 8px 8px rgba(0,0,0,0.02), 0 16px 16px rgba(0,0,0,0.02), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0)",
            transition: { ease: EASING.anticipate, duration: 0.6, boxShadow: { ease: EASING.kolumbOut, duration: 0.3 } },
          }}
          whileHover={{
            boxShadow: isOpen
              ? "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.03), 0 2px 2px rgba(0,0,0,0.03), 0 4px 4px rgba0,0,0,0.03), 0 8px 8px rgba(0,0,0,0.03), 0 12px 12px rgba(0,0,0,0.03), 0px 16px 16px rgba(0,0,0,0.03), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0)"
              : "0 0 0 1px hsla(232, 9%, 90%, 0.4), 0 0 5px rgba(0,0,0,0.03), 0 4px 4px rgba(0,0,0,0.03), 0 8px 8px rgba(0,0,0,0.03), 0 16px 16px rgba(0,0,0,0.03), 0 24px 24px rgba(0,0,0,0.02), 4px 0px 4px rgba(0,0,0,0.02), 8px 0 8px rgba(0,0,0,0.02), -4px 0 4px rgba(0,0,0,0.02), -8px 0 8px rgba(0,0,0,0.02)",
            transition: { ease: EASING.kolumbFlow, duration: 0.3 },
          }}
          {...attributes}
          {...listeners}
        >
          <ActivityUIOverlay
            event={event}
            onOpen={handleOpen}
            onSelect={handleSelect}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            disable={isOpen}
          />

          {/* Image */}
          <motion.div
            className={cn("relative h-[82px] flex-shrink-0", isOpen ? "cursor-default" : "cursor-pointer")}
            animate={{ height: isOpen ? "164px" : "82px" }}
            transition={{ ease: EASING.anticipate, duration: 0.6 }}
          >
            <Image
              src={`${event?.photo ? `/api/get-google-image?photoRef=${event.photo}&width=312&height=164` : EVENT_IMG_FALLBACK}`}
              alt="Event Image"
              className="select-none object-cover object-center"
              sizes="312px"
              priority
              fill
            />
          </motion.div>

          {/* Name */}
          <motion.div
            className={cn(
              "group relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-900",
              isOpen && "mt-0",
            )}
            animate={{
              height: isOpen ? "44px" : "24px",
              fontSize: isOpen ? "16px" : "14px",
              transition: { ease: EASING.anticipate, duration: 0.6 },
            }}
          >
            <ActivityName
              name={name}
              onChange={(name) => handleChange({ name })}
              onInput={(name) => setName(name)}
              expanded={isOpen}
              selected={isSelected}
            />
          </motion.div>

          {/* Details */}
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0.3, height: "0px" }}
                  animate={{ opacity: 1, height: `${detailsHeight}px` }}
                  exit={{ opacity: 0.3, height: "0px" }}
                  transition={{ ease: EASING.anticipate, duration: 0.6 }}
                  className="w-[312px] flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 text-sm"
                >
                  <div ref={detailsRef} className="flex flex-col gap-1.5 px-2 py-2">
                    {/* Address */}
                    <div className="relative">
                      <label htmlFor="address" className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500">
                        Address
                      </label>

                      <TextArea
                        id="address"
                        placeholder="street, city, country"
                        value={address ?? ""}
                        onChange={(e) => handleChange({ address: e.target.value })}
                        onInput={(e) => setAddress(e.currentTarget.value)}
                        minRows={1}
                        maxRows={4}
                        variant="unset"
                        size="unset"
                        style={{ transitionProperty: "box-shadow" }}
                        className="m-0 flex-shrink-0 rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus"
                      />
                    </div>

                    {/* Phone number & Cost */}
                    <div className="flex gap-1.5">
                      <div className="relative flex-1 flex-shrink-0">
                        <label htmlFor="phone" className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500">
                          Phone
                        </label>

                        <Input
                          id="phone"
                          placeholder="xxx xxx xxxx"
                          value={phoneNumber ?? ""}
                          onChange={(e) => handleChange({ phoneNumber: e.target.value })}
                          onInput={(e) => setPhoneNumber(e.currentTarget.value)}
                          variant="unset"
                          size="unset"
                          className="rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus"
                        />
                      </div>

                      <div className="relative w-24 flex-shrink-0">
                        <label htmlFor="cost" className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500">
                          Cost
                        </label>

                        <Input
                          id="cost"
                          type="number"
                          placeholder="0.00"
                          value={cost || ""}
                          onChange={(e) => handleChange({ cost: parseFloat(e.target.value) })}
                          onInput={(e) => setCost(parseFloat(e.currentTarget.value))}
                          onKeyDown={(e) => e.code === KEY.Backspace && e.currentTarget.value.length === 0 && setCost(null)}
                          variant="unset"
                          size="unset"
                          className="rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div className="relative">
                      <label htmlFor="website" className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500">
                        Website
                      </label>

                      <Input
                        id="website"
                        placeholder="www.example.com"
                        value={website ?? ""}
                        onChange={(e) => handleChange({ website: e.target.value })}
                        onInput={(e) => setWebsite(e.currentTarget.value)}
                        variant="unset"
                        size="unset"
                        className="rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus"
                      />
                    </div>

                    {/* Note */}
                    <div className="relative">
                      <label htmlFor="note" className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500">
                        Note
                      </label>

                      <TextArea
                        id="note"
                        placeholder="..."
                        value={note ?? ""}
                        onChange={(e) => handleChange({ note: e.target.value })}
                        onInput={(e) => setNote(e.currentTarget.value)}
                        minRows={2}
                        maxRows={4}
                        variant="unset"
                        size="unset"
                        style={{ transitionProperty: "box-shadow" }}
                        className="rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Controls */}
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.3 }}
                  transition={{ ease: EASING.anticipate, duration: isOpen ? 0.3 : 0.6 }}
                  className="mt-1 flex w-[312px] items-end justify-between rounded-xl p-1 text-sm"
                >
                  <span className="flex h-9">
                    <Button
                      onClick={handleCancel}
                      variant="scale"
                      size="unset"
                      className="w-20 before:rounded-lg before:bg-gray-100 before:shadow-none"
                      animatePress
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={handleUndo}
                      variant="scale"
                      size="unset"
                      className="w-20 before:rounded-lg before:bg-gray-100 before:shadow-none"
                      animatePress
                    >
                      Undo All
                    </Button>

                    {!!event.url && (
                      <Link
                        href={event.url}
                        target="_blank"
                        className={cn(
                          "flex w-9 items-center justify-center before:rounded-lg before:bg-gray-100 before:shadow-none",
                          ButtonVariants({ variant: "scale", size: "unset" }),
                        )}
                      >
                        <Icon.googleMapsIcon className="h-4" />
                      </Link>
                    )}
                  </span>

                  <Button
                    onClick={handleDelete}
                    variant="scale"
                    size="unset"
                    className="flex h-9 w-20 items-center justify-center gap-1.5 fill-red-500 text-red-500 before:rounded-lg before:bg-red-500 before:shadow-none hover:fill-white hover:text-white focus:fill-white focus:text-white"
                  >
                    <Icon.trash className="h-3.5" />
                    Delete
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </motion.li>
  );
});
