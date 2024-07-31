"use client";

import { type MouseEvent, memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import deepEqual from "deep-equal";

import { useDndItineraryContext } from "../dnd-context";
import { EASING } from "~/lib/motion";
import { cn, createId } from "~/lib/utils";

import { Button, Icons, ScrollIndicator } from "../../ui";
import { ActivityUIOverlay } from "./activity-ui-overlay";
import { ActivityDetails } from "./activity-details";
import ActivityImage from "./activity-image";
import type { PlaceSchema } from "~/lib/types";

// todo - Context Menu (like in floating ui react examples)

type Props = {
  place: PlaceSchema;
  dayIndex: number;
  isSelected: boolean;
};
export const Activity = memo(function Activity({ place, dayIndex, isSelected }: Props) {
  const { userId, selectEvent, createEvent, updateEvent, deleteEvents } = useDndItineraryContext();

  const [isOpen, setIsOpen] = useState(false);
  const { setNodeRef, active, over, isDragging, attributes, listeners, transform, transition } =
    useSortable({
      id: place.id,
      data: { type: "item", listIndex: dayIndex },
      disabled: isOpen,
      animateLayoutChanges: (args) =>
        args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true,
    });

  const cacheRef = useRef(place);
  const nameScrollRef = useRef<HTMLDivElement>(null);

  //#region Handlers
  const handleOpen = () => {
    cacheRef.current = place;
    setIsOpen(true);
  };

  const handleClose = (place: PlaceSchema) => {
    if (deepEqual(place, cacheRef.current)) return;
    updateEvent(place, cacheRef.current, { dayIndex });
  };

  const handleClick = (e: MouseEvent) => {
    if (isOpen || !!active) return;
    if (e.target instanceof HTMLButtonElement) return;
    if (e.target instanceof HTMLUListElement) return;

    if (e.ctrlKey || e.metaKey) selectEvent(place.id);
    else handleOpen();
  };

  const handleDuplicate = () => {
    const sortIndex = place.sortIndex + 1;
    const duplicate: PlaceSchema = {
      ...place,
      id: createId(),
      dayIndex,
      sortIndex,
      updatedAt: new Date(),
      createdAt: new Date(),
      createdBy: userId,
    };

    createEvent(duplicate, dayIndex, sortIndex);
  };

  const handleDelete = () => {
    setIsOpen(false);
    deleteEvents([place.id]);
  };
  //#endregion

  //#region Sorting State
  const [isSorting, setIsSorting] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeoutId.current);
    if (!isDragging) timeoutId.current = setTimeout(() => setIsSorting(false), 250);
    else setIsSorting(true);
  }, [isDragging]);
  //#endregion

  return (
    <motion.li
      ref={setNodeRef}
      onClick={handleClick}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      className={cn(
        "group/event relative flex h-28 w-40 origin-top flex-col overflow-hidden rounded-lg border-2 border-white bg-white font-inter shadow-borderXL",
        isSorting && "-z-10 animate-slideIn border-dashed border-gray-300 bg-gray-50",
        active?.id === place.id && over?.id === "trash" && "hidden",
        isSelected && "border-kolumblue-200 bg-kolumblue-200",
      )}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        width: isOpen ? "320px" : "160px",
        visibility: isOpen ? "hidden" : "visible",
        boxShadow: isSorting
          ? "0 0 0 0px #00000000, 0 0 0px #00000000, 0 0px 0px #00000000, 0 0px 0px #00000000, 0 0px 0px #00000000, 0 0px 0px #00000000, 0 0px 0px #00000000"
          : "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.02), 0 8px 8px rgba(0,0,0,0.02), 0 16px 16px rgba(0,0,0,0.02), 0 0px 0px rgba(0,0,0,0)",
        transition: {
          width: { ease: EASING.anticipate, duration: 0.6 },
          visibility: { duration: 0, delay: isOpen ? 0 : 0.6 },
          boxShadow: { duration: isSorting ? 0 : 0.3, ease: EASING.kolumbOut },
          opacity: { duration: 0.25, ease: EASING.easeInOut },
        },
      }}
      whileHover={{
        boxShadow: isSorting
          ? "0 0 0 0px #00000000, 0 0 0px #00000000, 0 0px 0px #00000000, 0 0px 0px #00000000, 0 0px 0px #00000000, 0 0px 0px #00000000, 0 0px 0px #00000000"
          : "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.03), 0 2px 2px rgba(0,0,0,0.03), 0 4px 4px rgba(0,0,0,0.03), 0 8px 8px rgba(0,0,0,0.03), 0 12px 12px rgba(0,0,0,0.03), 0 16px 16px rgba(0,0,0,0.03)",
        transition: { boxShadow: { duration: isSorting ? 0 : 0.3, ease: EASING.kolumbFlow } },
      }}
      {...attributes}
      {...listeners}
    >
      {!isSorting && (
        <>
          <ActivityUIOverlay
            place={place}
            disable={isOpen || !!active}
            onOpen={handleOpen}
            onSelect={() => selectEvent(place.id)}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />

          {/* Image */}
          <div className="relative h-[82px] flex-shrink-0 overflow-hidden">
            <ActivityImage event={place} size={82} />
          </div>

          {/* Name */}
          <div className="group relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-800">
            <div ref={nameScrollRef} className="w-full select-none">
              {place.name}
              <ScrollIndicator
                scrollRef={nameScrollRef}
                className={isSelected ? "from-kolumblue-200" : ""}
              />
            </div>

            {!active && (
              <Button
                onClick={() => navigator.clipboard.writeText(place.name ?? "")}
                variant="unset"
                size="unset"
                className="absolute inset-y-0 right-0 z-10 fill-gray-500 px-2 opacity-0 duration-300 ease-kolumb-out hover:fill-gray-800 group-hover:opacity-100 group-hover:ease-kolumb-flow"
              >
                <Icons.copy className="pointer-events-none relative z-10 m-auto h-3" />

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

          <ActivityDetails
            event={place}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onClose={handleClose}
            onDelete={handleDelete}
          />
        </>
      )}
    </motion.li>
  );
});
