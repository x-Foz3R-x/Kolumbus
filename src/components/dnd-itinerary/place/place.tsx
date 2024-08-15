"use client";

import { type MouseEvent, memo, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useMeasure from "react-use-measure";

import useHistoryState from "~/hooks/use-history-state";
import { EASING } from "~/lib/motion";
import { cn } from "~/lib/utils";
import type { PlaceDetailsSchema, PlaceSchema } from "~/lib/types";

import { useDndItineraryContext } from "../dnd-context";
import { PlaceUiOverlay } from "./place-ui-overlay";
import PlaceImage from "./place-image";
import { PlaceDetails } from "./place-details";
import { Floating } from "../../ui/floating";
import { Button, Icons, ScrollIndicator } from "../../ui";
import { constructPlace } from "~/lib/constructors";

// todo - Context Menu (like in floating ui react examples)

type Props = {
  place: PlaceSchema;
  dayIndex: number;
  isSelected: boolean;
};
export const Place = memo(function Place({ place, dayIndex, isSelected }: Props) {
  const { userId, selectItem, createItem, updateItem, deleteItems } = useDndItineraryContext();

  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { setNodeRef, active, over, isDragging, attributes, listeners, transform, transition } =
    useSortable({
      id: place.id,
      data: { type: "item", listIndex: dayIndex },
      disabled: isOpen,
      animateLayoutChanges: (args) =>
        args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true,
    });

  const nameScrollRef = useRef<HTMLDivElement>(null);
  const [details, setDetails, historyActions] = useHistoryState<PlaceDetailsSchema>(
    {
      name: place.name,
      address: place.address,
      startTime: place.startTime,
      endTime: place.endTime,
      phoneNumber: place.phoneNumber,
      website: place.website,
      note: place.note,
      imageUrl: place.imageUrl,
    },
    { limit: 10 },
  );

  const handleClick = (e: MouseEvent) => {
    if (isOpen || !!active) return;
    // Prevent opening details when clicking on place ui overlay
    if (e.target instanceof Element && e.target.closest(".place-ui-overlay")) return;

    if (e.ctrlKey || e.metaKey) selectItem(place.id);
    else setIsOpen(true);
  };

  const savePlaceDetails = () => {
    setIsOpen(false); // Close the details

    const getUpdatedDetails = (
      place: PlaceSchema,
      details: PlaceDetailsSchema,
    ): Partial<PlaceDetailsSchema> => {
      const updatedDetails: Partial<PlaceDetailsSchema> = {};

      Object.keys(details).map((key) => {
        const detailKey = key as keyof PlaceDetailsSchema;

        if (place[detailKey] !== details[detailKey]) {
          updatedDetails[detailKey] = details[detailKey] ?? undefined;
        }
      });

      return updatedDetails;
    };

    const newPlace = { ...place, ...details, updateBy: userId, updatedAt: new Date() };
    const modifiedDetails = getUpdatedDetails(place, details);

    if (Object.keys(modifiedDetails).length === 0) return; // No changes

    updateItem(newPlace, modifiedDetails);
  };

  const duplicatePlace = () => {
    const duplicatedPlace = constructPlace({ ...place, userId, sortIndex: place.sortIndex + 1 });
    createItem(duplicatedPlace);
  };

  const deletePlace = () => {
    setIsOpen(false);
    deleteItems([place.id]);
  };

  //#region Sorting State
  const [isSorting, setIsSorting] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeoutId.current);
    if (!isDragging) timeoutId.current = setTimeout(() => setIsSorting(false), 250);
    else setIsSorting(true);
  }, [isDragging]);
  //#endregion

  //#region Details Height
  // activity details height: borderHeight + imageHeight + NameHeight + controlsHeight -> 8 + 164 + 44 + 48 = 264
  const DETAILS_INIT_HEIGHT = 264;
  const [detailsRef, { height: detailsHeight }] = useMeasure();

  const animation = useMemo(
    () => ({
      initial: {
        width: "160px",
        height: "112px",
        borderWidth: "2px",
        borderRadius: "8px",
        boxShadow:
          "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.02), 0 8px 8px rgba(0,0,0,0.02), 0 16px 16px rgba(0,0,0,0.02), 0 0px 0px rgba(0,0,0,0)",
      },
      animate: {
        width: "320px",
        height: `${detailsHeight + DETAILS_INIT_HEIGHT}px`,
        borderWidth: "4px",
        borderRadius: "16px",
        boxShadow:
          "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.03), 0 2px 2px rgba(0,0,0,0.03), 0 4px 4px rgba(0,0,0,0.03), 0 8px 8px rgba(0,0,0,0.03), 0 12px 12px rgba(0,0,0,0.03), 0 16px 16px rgba(0,0,0,0.03)",
        transition: { ease: EASING.anticipate, duration: 0.6 },
      },
      exit: {
        width: "160px",
        height: "112px",
        borderWidth: "2px",
        borderRadius: "8px",
        boxShadow:
          "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.02), 0 8px 8px rgba(0,0,0,0.02), 0 16px 16px rgba(0,0,0,0.02), 0 0px 0px rgba(0,0,0,0)",
        transition: { ease: EASING.anticipate, duration: 0.6 },
      },
    }),
    [detailsHeight],
  );
  //#endregion

  return (
    <Floating
      isOpen={isOpen}
      onOpenChange={savePlaceDetails}
      placement="top-start"
      offset={({ rects }) => ({
        mainAxis: -rects.reference.height - (rects.floating.height - rects.reference.height),
      })}
      shift={false}
      flip={false}
      size={false}
      customAnimation={animation}
      trapFocus
      initialFocus={-1}
      zIndex={30}
      className="mb-5 mr-5 h-28 w-40 overflow-hidden rounded-lg border-2 border-white bg-white text-sm"
      triggerProps={{
        asChild: true,
        children: (
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
            {...(!isMenuOpen && listeners)}
          >
            {!isSorting && (
              <>
                <PlaceUiOverlay
                  place={place}
                  isMenuOpen={isMenuOpen}
                  setMenuOpen={setMenuOpen}
                  onOpen={() => setIsOpen(true)}
                  onSelect={() => selectItem(place.id)}
                  onDuplicate={duplicatePlace}
                  onDelete={deletePlace}
                  disable={isOpen || !!active}
                />

                {/* Image */}
                <div className="relative h-[82px] flex-shrink-0 overflow-hidden">
                  <PlaceImage imageUrl={place.imageUrl} size={82} />
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

                  {!active && !isOpen && (
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
              </>
            )}
          </motion.li>
        ),
      }}
    >
      <PlaceDetails
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        details={details}
        setDetails={setDetails}
        historyActions={historyActions}
        detailsRef={detailsRef}
        detailsHeight={detailsHeight}
        onDelete={deletePlace}
      />
    </Floating>
  );
});
