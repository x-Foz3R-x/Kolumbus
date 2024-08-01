/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type Active,
  type CollisionDetection,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  type Over,
  TouchSensor,
  closestCenter,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { onEventCreated, onEventDeleted, onEventUpdated } from ".";
import { DndItineraryContext, type DndItineraryContextProps } from "./dnd-context";
import { cn } from "~/lib/utils";

import DndDragOverlay from "./dnd-drag-overlay";
import DndTrash from "./dnd-trash";
import DndDay from "./dnd-day";
import { Activity } from "./events";
import type { ItinerarySchema, DaySchema } from "~/lib/validations/trip";
import type { PlaceSchema, UpdatePlaceSchema } from "~/lib/validations/place";
import { KEYS } from "~/types";

// * PROPOSAL: Remove most of animation/shifting logic on drag to greatly improve performance and potentially reduce complexity (notion dnd style)

// todo - optimize the performance when dragging items
// todo - Multi select items from different days
// todo - Selecting items with selection rectangle (like in any file manager)
// todo - Properly done dnd keyboard support (filter tabbable elements, move events with keyboard, etc)
// todo: Shortcuts:
// <kbd>Ctrl + Shift + Click</kbd> to select a range of events
// <kbd>Ctrl + Backspace</kbd> to delete selected events
// <kbd>Ctrl + X</kbd> to cut selected events
// <kbd>Ctrl + C</kbd> to copy selected events
// <kbd>Ctrl + V</kbd> to paste events
// <kbd>Ctrl + A</kbd> to select all events

type Props = {
  userId: string;
  tripId: string;
  itinerary: ItinerarySchema;
  setItinerary: (itineraryOrIndex: ItinerarySchema | number, desc?: string) => void;
  placeLimit: number;
  onEventCreated?: onEventCreated;
  onEventUpdated?: onEventUpdated;
  onEventDeleted?: onEventDeleted;
  dndTrash?: { variant: "default" | "inset"; className?: string } | boolean;
  calendar?: string;
};
export function DndItinerary({
  userId,
  tripId,
  itinerary,
  setItinerary,
  placeLimit,
  onEventCreated,
  onEventUpdated,
  onEventDeleted,
  dndTrash,
  calendar,
}: Props) {
  const [activeItem, setActiveItem] = useState<DaySchema | PlaceSchema | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const affectedDaysRef = useRef<string[]>([]);

  const placeCount = useMemo(() => itinerary.flatMap((day) => day.places).length, [itinerary]);

  const selectItem = useCallback(
    (id: string) => {
      const areEventsOnSameDay = (id1: string, id2: string) => {
        return itinerary.some(
          (day) =>
            day.places.some((place) => place.id === id1) &&
            day.places.some((place) => place.id === id2),
        );
      };

      const findEventIndex = (id: string) => {
        // Find the day that contains the event with the given id and return the index of that event in the day
        const day = itinerary.find((day) => day.places.find((place) => place.id === id));
        return day?.places.findIndex((place) => place.id === id) ?? -1;
      };

      setSelectedIds((selectedIds) => {
        // If the selected id is already in the array, remove it and return the updated array.
        // The order of the remaining elements is preserved (no need to sort).
        if (selectedIds.includes(id)) return selectedIds.filter((value) => value !== id);

        // To be removed when multi day event select is implemented (event from multiple days)
        // If the array is empty or the selected id is from a different day than the rest, return id as a new array.
        if (!selectedIds.length || (selectedIds[0] && !areEventsOnSameDay(id, selectedIds[0]))) {
          return [id];
        }

        // If none of the above conditions are met, add the selected id to the array,
        // sort the array by the index of the ids, and return the sorted array.
        return [...selectedIds, id].sort((a, b) => findEventIndex(a) - findEventIndex(b));
      });
    },
    [itinerary],
  );
  const createItem = useCallback(
    (place: PlaceSchema, dayIndex?: number, index?: number) => {
      const newItinerary = structuredClone(itinerary);

      const targetDayIndex = findDayIndexByPlaceId(place.id, newItinerary, dayIndex);
      if (targetDayIndex === -1) return;

      // If no index is provided, add the event to the end of the day's events array.
      // Otherwise, insert the event at the specified index and update the position of the events in the day.
      if (!index) newItinerary[targetDayIndex]!.places.push(place);
      else {
        newItinerary[targetDayIndex]!.places.splice(index, 0, place);
        newItinerary[targetDayIndex]!.places.slice(index).map((place, i) => {
          onEventUpdated?.(place.id, tripId, { sortIndex: index + i });
        });
      }

      setItinerary(newItinerary, "Add place");
      onEventCreated?.(place);
    },
    [tripId, itinerary, setItinerary, onEventCreated, onEventUpdated],
  );
  const updateItem = useCallback(
    (
      place: PlaceSchema,
      updateData: UpdatePlaceSchema["data"],
      {
        dayIndex,
        entryDescription,
        preventEntry,
      }: { dayIndex?: number; entryDescription?: string; preventEntry?: boolean } = {},
    ) => {
      const newItinerary = structuredClone(itinerary);

      const targetDayIndex = findDayIndexByPlaceId(place.id, newItinerary, dayIndex);
      if (targetDayIndex === -1) return;

      const placeIndex = newItinerary[targetDayIndex]!.places.findIndex((e) => e.id === place.id);
      if (placeIndex === -1 || !newItinerary[targetDayIndex]!.places[placeIndex]) return;

      place.updatedAt = new Date();
      newItinerary[targetDayIndex]!.places[placeIndex] = place;

      setItinerary(newItinerary, !preventEntry ? entryDescription ?? "Update place" : undefined);
      onEventUpdated?.(place.id, tripId, updateData);
    },
    [tripId, itinerary, setItinerary, onEventUpdated],
  );
  const deleteItem = useCallback(
    (placeId: string | string[]) => {
      const newItinerary = structuredClone(itinerary);

      newItinerary.forEach((day) => {
        if (day.places.some((place) => placeId.includes(place.id))) {
          day.places = updateItemsPlacement(
            filterEventsExcludingIds(day.places, typeof placeId === "string" ? [placeId] : placeId),
          );
        }
      });

      const actionDescription =
        placeId.length > 1 ? `Delete ${placeId.length} events` : "Delete event";
      setItinerary(newItinerary, actionDescription);

      const ids = placeId.length > 1 ? placeId : placeId[0]!;
      onEventDeleted?.(ids, tripId);
    },
    [tripId, itinerary, setItinerary, onEventDeleted],
  );

  //#region Drag handlers
  // handleDragStart - setts active item
  // handleDragOver - handles drag of days and drag of items between days
  // handleDragEnd - handles drag to trash and drag of items in the same day
  // handleDragCancel - handles resetting itinerary to the last history entry
  type DragData = { type: "list" | "item"; listIndex: number } | undefined;

  const handleDragStart = ({ active }: DragStartEvent) => {
    const activeItem =
      (active.data.current as DragData)?.type === "list"
        ? itinerary.find((day) => day.id === active.id)
        : itinerary.flatMap((day) => day.places).find((place) => place.id === active.id);

    setActiveItem(activeItem ?? null);
    setSelectedIds((selected) => (selected.includes(active.id as string) ? selected : []));
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    // Skip if there's no drop target or if target is a trash can. Handled in `DragEnd`.
    if (over === null || over.id === "trash") return;

    const activeData = active.data.current as DragData;
    const overData = over.data.current as DragData;

    if (
      !activeData ||
      !overData ||
      !activeData?.type ||
      !overData?.type ||
      !("listIndex" in activeData) ||
      !("listIndex" in overData)
    ) {
      return;
    }

    const { type: activeType, listIndex: activeListIndex } = activeData;
    const { type: overType, listIndex: overListIndex } = overData;

    const activeDay = itinerary[activeListIndex]!;
    const overDay = itinerary[overListIndex]!;

    // Add the activeDay and overDay IDs to the update list if they're not already included
    if (!affectedDaysRef.current.includes(activeDay.id)) {
      affectedDaysRef.current.push(activeDay.id);
    }
    if (!affectedDaysRef.current.includes(overDay.id)) {
      affectedDaysRef.current.push(overDay.id);
    }

    // Handle dragging of a day within the itinerary.
    if (activeType === "list") {
      const newItinerary = arrayMove(itinerary, activeListIndex, overListIndex);

      // Swap the dates of the active and target days
      [activeDay.date, overDay.date] = [overDay.date, activeDay.date];

      // Update the date of the active item
      if (activeItem) setActiveItem?.({ ...activeItem, date: activeDay.date });

      setItinerary(newItinerary);
      // setSelectedIds([]);
      return;
    }

    // Handle dragging of single or multiple events between different days.
    // Skip if dragging is within the same day. Handled in `DragEnd`.
    if (activeListIndex === overListIndex) return;

    const activeEvents = filterEvents(activeDay.places, true);
    const draggedEvents = filterDraggedEvents(activeDay.places);

    const targetIndex = findTargetIndex(active, over, overDay, overType);

    const newItinerary = structuredClone(itinerary);
    newItinerary[activeListIndex]!.places = updateItemsPlacement(activeEvents);
    newItinerary[overListIndex]!.places = insertAt(overDay.places, draggedEvents, targetIndex);
    setItinerary(newItinerary);

    recentlyMovedToNewDay.current = true;
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    // Skip if there's no drop target.
    if (over === null) {
      setActiveItem(null);
      return;
    }

    const activeData = active.data.current as DragData;
    const overData = over.data.current as DragData;

    // Skip if there's no active or over data.
    if (
      !activeData ||
      !overData ||
      !activeData?.type ||
      !overData?.type ||
      !("listIndex" in activeData) ||
      !("listIndex" in overData)
    ) {
      setActiveItem(null);
      setSelectedIds([]);
      return;
    }

    const { type: activeType, listIndex: activeListIndex } = activeData;
    const { type: overType, listIndex: overListIndex } = overData;

    const activeDay = itinerary[activeListIndex]!;
    const overDay = itinerary[overListIndex]!;

    // Handle dragging of single or multiple events to the trash.
    if (over.id === "trash" && activeType === "item" && activeItem) {
      deleteItem(selectedIds.length ? selectedIds : [active.id as string]);
      setActiveItem(null);
      setSelectedIds([]);
      return;
    }

    // Skip if dragging is not within the same day or if the drag type is a day. Both cases are handled in `DragOver`.
    if (activeListIndex !== overListIndex || activeType === "list" || overType === "list") {
      let message = "Move place";
      if (activeType === "list") message = "Move day";
      else if (selectedIds.length > 1) message = `Move ${selectedIds.length} places`;

      setItinerary(itinerary, message);
      setActiveItem(null);
      // syncEvents(affectedDatesRef.current);
      return;
    }

    const dayEvents = filterEvents(activeDay.places);
    const draggedEvents = filterDraggedEvents(activeDay.places);

    const initialIndex = dayEvents.findIndex((event) => event.id === active.id);
    const targetIndex = findTargetIndex(active, over, overDay, overType);

    // Use arrayMove to relocate the event from its original to the desired position.
    // Then remove the relocated event at the target index to avoid duplication,
    // since it's already included in the draggedEvents that we insert at that spot.
    const rearrangedEvents = arrayMove(dayEvents, initialIndex, targetIndex).toSpliced(
      targetIndex,
      1,
      ...draggedEvents,
    );

    const newItinerary = structuredClone(itinerary);
    newItinerary[activeListIndex]!.places = updateItemsPlacement(rearrangedEvents);
    setItinerary(
      newItinerary,
      selectedIds.length > 1 ? `Move ${selectedIds.length} places` : "Move place",
    );
    setActiveItem(null);
    // syncEvents([activeDay.id]);
  };

  const handleDragCancel = () => {
    setItinerary(-1);
    setActiveItem(null);
  };
  //#endregion

  //#region Dnd-kit misc
  const lastOverId = useRef<string | null>(null);
  const recentlyMovedToNewDay = useRef(false);

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeItem && "places" in activeItem) {
        // If the active item is an day, return the closestCenter detection strategy with droppable's of the type "day"
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (droppable) => droppable.data.current?.type === "list",
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args);
      const overId = intersections && !!intersections[0] ? intersections[0].id : null;

      if (overId === "trash") return pointerWithin(args);
      if (overId !== null) {
        const intersectingDayPlacesIds = itinerary
          .find((day) => day.id === overId)
          ?.places.map((place) => place.id);
        const intersectingRect = args.droppableContainers.find(
          (droppable) => droppable.id === overId,
        )?.rect.current;
        const pointerX = args.pointerCoordinates?.x;

        if (intersectingDayPlacesIds && intersectingRect && pointerX) {
          const placesWidthWithinContainer =
            intersectingRect.left + intersectingDayPlacesIds.length * 160;
          const isPointerWithinPlaces =
            intersectingDayPlacesIds.length > 0 && pointerX < placesWidthWithinContainer;

          if (isPointerWithinPlaces) {
            return closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (droppable) =>
                  droppable.id !== overId &&
                  intersectingDayPlacesIds.includes(droppable.id as string),
              ),
            });
          }
        }

        lastOverId.current = overId as string;
        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewDay.current) lastOverId.current = activeItem?.id ?? null;

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeItem, itinerary],
  );

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: [KEYS.Space], cancel: [KEYS.Escape], end: [KEYS.Space, KEYS.Enter] },
    }),
  );

  useEffect(() => {
    requestAnimationFrame(() => (recentlyMovedToNewDay.current = false));
  }, [itinerary]);
  //#endregion

  // Deselect ids when pressing the escape key or when clicking without ctrl key
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (selectedIds.length === 0) return;

      const target = e.target as HTMLElement;
      const containsIgnore = target.classList.contains(".ignore-deselect");
      const childrenContainsIgnore = Array.from(target.children).some((child) =>
        child.classList.contains("ignore-deselect"),
      );

      if (containsIgnore || childrenContainsIgnore) return;

      if (!(e.ctrlKey || e.metaKey)) setSelectedIds([]);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === (KEYS.Escape as string) && selectedIds.length !== 0) setSelectedIds([]);
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [selectedIds]);

  const dndItineraryContext: DndItineraryContextProps = useMemo(
    () => ({
      userId,
      tripId,
      placeCount,
      placeLimit,

      selectEvent: selectItem,
      createEvent: createItem,
      updateEvent: updateItem,
      deleteEvents: deleteItem,
    }),
    [userId, tripId, placeCount, placeLimit, selectItem, createItem, updateItem, deleteItem],
  );

  return (
    <DndItineraryContext.Provider value={dndItineraryContext}>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={itinerary.map((day) => day.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="relative flex w-full min-w-fit flex-col font-inter">
            {itinerary.map((day, index) => (
              <DndDay
                key={day.id}
                day={day}
                dayIndex={index}
                itinerary={itinerary}
                calendar={calendar}
              >
                <SortableContext
                  items={filterEvents(day.places).map((place) => place.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {filterEvents(day.places).map((event) => (
                    <Activity
                      key={event.id}
                      place={event}
                      dayIndex={index}
                      isSelected={selectedIds.includes(event.id)}
                    />
                  ))}
                </SortableContext>
              </DndDay>
            ))}
          </ul>
        </SortableContext>

        {/* Calendar End */}
        {itinerary.length > 0 && (
          <div className="flex">
            <div
              className={cn(
                "sticky left-20 mb-4 flex h-5 w-32 cursor-default items-center justify-center rounded-b-xl bg-kolumblue-500 font-inter text-xs font-medium text-kolumblue-200 shadow-xl",
                calendar,
              )}
            >
              End of Trip
            </div>
          </div>
        )}

        {dndTrash && (
          <DndTrash
            variant={typeof dndTrash === "object" ? dndTrash.variant : "default"}
            className={typeof dndTrash === "object" ? dndTrash.className : undefined}
          />
        )}
        <DndDragOverlay
          activeItem={activeItem}
          selectedIds={selectedIds}
          enableEventComposer={placeCount < placeLimit}
        />
      </DndContext>
    </DndItineraryContext.Provider>
  );

  /**
   * Determines the target index for a active event in the list of events for a given day.
   *
   * The function first filters out selected events from the target day's events. If the overType is "day",
   * it returns the total events count, effectively placing the dragged event at the end of the day.
   *
   * If the overType is "event", it checks whether the dragged event is past the last event of the day.
   * If it is, it adjusts the position to append it at the end of the day. Otherwise, it finds the index
   * of the event being dragged over and returns that index, or the total events count if the index is not valid.
   *
   * @param active - The active event being dragged.
   * @param over - The event or day being dragged over.
   * @param overDay - The day being dragged over.
   * @param overType - The type of element being dragged over, either "day" or "event".
   * @returns The target index for the dragged event in the list of events for the given day.
   */
  function findTargetIndex(
    active: Active,
    over: Over,
    overDay: DaySchema,
    overType: "list" | "item",
  ) {
    const filteredOverDayPlaces = filterEvents(overDay.places);
    const totalPlaces = filteredOverDayPlaces.length;

    if (overType === "list") return totalPlaces;

    // This comment addresses a subtle behavior when dragging an place over a day that already contains places.
    // It might seem like you're dragging over the day itself, but in reality, the place is dragged over the last place of the day.
    // If the place is dragged past the last place, we adjust the position to append it at the day's end.
    const isDraggedPastOverPlace =
      over &&
      active.rect.current.translated &&
      active.rect.current.translated.left > over.rect.left + over.rect.width;
    const positionAdjustment = isDraggedPastOverPlace ? 1 : 0;

    const overPlaceIndex = filteredOverDayPlaces.findIndex((place) => place.id === over.id);
    const validIndex = overPlaceIndex >= 0 && overPlaceIndex + positionAdjustment <= totalPlaces;

    return validIndex ? overPlaceIndex + positionAdjustment : totalPlaces;
  }
  function findDayIndexByPlaceId(id: string, itinerary: ItinerarySchema, dayIndex?: number) {
    return dayIndex ?? itinerary.findIndex((day) => day.places.some((place) => place.id === id));
  }

  // Filter functions
  /**
   * Filters out selected events from the provided array during a drag operation.
   * An event is excluded if its id is included in the list of selected events ids
   * or if `excludeActiveEvent` is true then also the active event.
   *
   * @param events - The array of events to filter.
   * @param excludeActiveEvent - Optional. If true, the active event is excluded from the new array. Default is false.
   * @returns  A new array of events excluding the selected ones and optionally the active event.
   */
  function filterEvents(events: PlaceSchema[], excludeActiveEvent = false): PlaceSchema[] {
    if (!activeItem) return events;

    if (excludeActiveEvent)
      return events.filter(
        (event) => event.id !== activeItem.id && !selectedIds.includes(event.id),
      );
    return events.filter((event) => event.id === activeItem.id || !selectedIds.includes(event.id));
  }
  /**
   * Filters the provided array of events to return only the events that are currently being dragged.
   * An event is considered to be dragged if it's either the active event or its id is included in the list of selected events ids.
   *
   * @param events - The array of events to filter.
   * @returns An array of events that are currently being dragged or the original array.
   */
  function filterDraggedEvents(events: PlaceSchema[]): PlaceSchema[] {
    if (!activeItem) return events;
    return events.filter((event) => event.id === activeItem.id || selectedIds.includes(event.id));
  }
  /**
   * Filters the provided array of events to return only the events whose ids are not included in the provided ids array.
   *
   * @param events - The array of events to filter.
   * @param ids - The array of ids to exclude.
   * @returns An array of events whose ids are not included in the provided ids array.
   */
  function filterEventsExcludingIds(events: PlaceSchema[], ids: string[]): PlaceSchema[] {
    return events.filter((event) => !ids.includes(event.id));
  }

  // Event Manipulation Functions
  /**
   * Updates the date and position properties of each event in the provided array.
   *
   * The date property is updated to the provided date, or if no date is provided, it remains the same.
   * The position property is updated to the index of the event in the array.
   *
   * @param places - The array of events to update.
   * @param date - Optional. The new date for the events. If not provided, the date of each event remains the same.
   * @returns A new array of events with updated date and position properties.
   */
  function updateItemsPlacement(places: PlaceSchema[], dayIndex?: number): PlaceSchema[] {
    return places.map((place, index) => ({
      ...place,
      dayIndex: dayIndex ?? place.dayIndex,
      sortIndex: index,
    }));
  }
  /**
   * Inserts an array of events at a specific index in another array of events.
   *
   * The function creates a new array that includes all events from the original array,
   * but with the events from the second array inserted at the specified index.
   *
   * @param listItems - The original array of events.
   * @param newItems - The array of events to insert.
   * @param index - The index at which to insert the events.
   * @returns A new array with the events inserted at the specified index.
   */
  function insertAt(
    listItems: PlaceSchema[],
    newItems: PlaceSchema[],
    index: number,
  ): PlaceSchema[] {
    const combinedList = [...listItems.slice(0, index), ...newItems, ...listItems.slice(index)];
    const updatedIndexesList = combinedList.map((item, index) => ({ ...item, sortIndex: index }));

    return updatedIndexesList;
  }

  /**
   * Synchronizes events with database based on affected day IDs.
   *
   * @param affectedDayIds - An array of affected day IDs.
   */
  // function syncEvents(affectedDayIds: string[]) {
  //   const currentEvents = affectedDayIds.flatMap(
  //     (dayId) => itinerary.find((day) => day.id === dayId)?.events ?? [],
  //   );
  //   const previousEvents = affectedDayIds.flatMap(
  //     (dayId) => itineraryCacheRef.current[dayId] ?? [],
  //   );

  //   const areEventsEqual = (event1: Event, event2: Event) => {
  //     return (
  //       event1.id === event2.id &&
  //       event1.date === event2.date &&
  //       event1.position === event2.position
  //     );
  //   };

  //   const updatedEvents = currentEvents.filter(
  //     (event) => !previousEvents.some((previousEvent) => areEventsEqual(previousEvent, event)),
  //   );

  //   updatedEvents.forEach((event) =>
  //     onEventUpdated?.(
  //       event.id,
  //       tripId,
  //       { date: event.date, position: event.position },
  //     ),
  //   );
  // }
}
