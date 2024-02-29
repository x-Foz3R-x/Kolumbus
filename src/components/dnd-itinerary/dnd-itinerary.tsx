"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Active,
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  Over,
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

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { USER_ROLE } from "@/lib/config";
import { compareArrays, deepCloneItinerary, transformItineraryToCache, restoreItineraryFromCache } from "@/lib/utils";
import { Day, Event, Itinerary, KEY, UT } from "@/types";

import DndDragOverlay from "./dnd-drag-overlay";
import DndTrash from "./dnd-trash";
import DndDay from "./dnd-day";
import { Activity } from "./events";
import { DndItineraryContext, DndItineraryContextProps } from "./dnd-context";

// PROPOSAL: Remove most of animation/shifting logic on drag to greatly improve performance and potentially reduce complexity

// todo - Multi select events from different days
// todo - Selecting events with selection rectangle (like in any file manager)
// todo - Properly done dnd keyboard support (filter tabbable elements, move events with keyboard, etc)
// todo - fix overflowing issues with events (especially when expanded) that overflows other days calendars
// todo: Shortcuts:
// <kbd>Ctrl + Shift + Click</kbd> to select a range of events
// <kbd>Ctrl + A</kbd> to select all events
// <kbd>Ctrl + X</kbd> to cut selected events
// <kbd>Ctrl + C</kbd> to copy selected events
// <kbd>Ctrl + V</kbd> to paste events
// <kbd>Ctrl + Z</kbd> to undo
// <kbd>Ctrl + Shift + Z</kbd> to redo

export function DndItinerary({ userId, tripId, itinerary: tripItinerary }: { userId: string; tripId: string; itinerary: Itinerary }) {
  const { dispatchUserTrips, setSaving } = useAppdata();
  const updateEvent = api.event.update.useMutation();
  const deleteEvent = api.event.delete.useMutation();

  const [itinerary, setItinerary] = useState(tripItinerary);
  const [activeItem, setActiveItem] = useState<Day | Event | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const itineraryCacheRef = useRef<Record<string, Event[]>>(transformItineraryToCache(itinerary));
  const affectedDayIdsRef = useRef<string[]>([]);

  const eventCount = useMemo(() => itinerary.flatMap((day) => day.events).length, [itinerary]);

  const selectEvent = useCallback(
    (id: string) => {
      const areEventsOnSameDay = (id1: string, id2: string) => {
        const events = itinerary.flatMap((day) => day.events);
        return events.find((event) => event.id === id1)?.date === events.find((event) => event.id === id2)?.date;
      };

      const findEventIndex = (id: string) => {
        // Find the day that contains the event with the given id and return the index of that event in the day
        const day = itinerary.find((day) => day.events.find((event) => event.id === id));
        return day?.events.findIndex((event) => event.id === id) ?? -1;
      };

      setSelectedIds((selectedIds) => {
        // If the selected id is already in the array, remove it and return the updated array.
        // The order of the remaining elements is preserved (no need to sort).
        if (selectedIds.includes(id)) return selectedIds.filter((value) => value !== id);

        // To be removed when multi day event select is implemented (event from multiple days)
        // If the array is empty or the selected id is from a different day than the rest, return id as a new array.
        if (!selectedIds.length || !areEventsOnSameDay(id, selectedIds[0])) return [id];

        // If none of the above conditions are met, add the selected id to the array,
        // sort the array by the index of the ids, and return the sorted array.
        return [...selectedIds, id].sort((a, b) => findEventIndex(a) - findEventIndex(b));
      });
    },
    [itinerary],
  );
  const deleteEvents = useCallback(
    (eventIds: string[]) => {
      // The originalDayIndex is used to find the original position of the event in the database.
      // This is necessary because we need to know which events we need to update when we delete an event.
      let originalDayIndex = Object.keys(itineraryCacheRef.current).findIndex((dayId) =>
        itineraryCacheRef.current[dayId].find((event) => eventIds.includes(event.id)),
      );

      // The currentDayIndex is used to find the current position of the event in the local state.
      // This is necessary because when an event is dragged to the trash icon, it most likely passes over a day,
      // effectively changing its position. We need to find the last day that held the dragged event so we can remove it locally.
      const currentDayIndex = itinerary.findIndex((day) => day.events.find((event) => eventIds.includes(event.id)));

      // If the originalDayIndex is still -1, set it to the currentDayIndex
      // This can happen when after adding new event to the itinerary, itineraryCache.current is not updated
      if (originalDayIndex === -1) originalDayIndex = currentDayIndex;

      // Remove the events from the itinerary
      const newItinerary = deepCloneItinerary(itinerary);
      newItinerary[currentDayIndex].events = updateEventData(filterEventsExcludingIds(newItinerary[currentDayIndex].events, eventIds));

      setSaving(true);
      dispatchUserTrips({ type: UT.REPLACE_ITINERARY, payload: { tripId, itinerary: newItinerary } });

      eventIds.forEach((eventId) => {
        deleteEvent.mutate(
          { eventId },
          {
            onError(error) {
              console.error(error);
              dispatchUserTrips({
                type: UT.REPLACE_ITINERARY,
                payload: { tripId, itinerary: restoreItineraryFromCache(itinerary, itineraryCacheRef.current, affectedDayIdsRef.current) },
              });
            },
          },
        );
      });

      filterEventsExcludingIds(itinerary[originalDayIndex].events, eventIds).forEach((event) => {
        updateEvent.mutate(
          { eventId: event.id, data: { position: event.position } },
          {
            onError(error) {
              console.error(error);
              dispatchUserTrips({
                type: UT.REPLACE_ITINERARY,
                payload: { tripId, itinerary: restoreItineraryFromCache(itinerary, itineraryCacheRef.current, affectedDayIdsRef.current) },
              });
            },
            onSettled: () => setSaving(false),
          },
        );
      });
    },
    [itinerary, dispatchUserTrips, deleteEvent, updateEvent, setSaving, tripId, itineraryCacheRef, affectedDayIdsRef],
  );

  //#region Drag handlers
  // handleDragStart - handles setting active id and item and cache itinerary
  // handleDragOver - handles drag between days and drag of events between days
  // handleDragEnd - handles drag to trash and drag of events in the same day
  // handleDragCancel - handles resetting itinerary from cache

  type DragData = { type: "event" | "day"; dayIndex: number } | undefined;

  const handleDragStart = ({ active }: DragStartEvent) => {
    const activeItem =
      active.data.current?.type === "day"
        ? itinerary.find((day) => day.id === active.id)
        : itinerary.flatMap((day) => day.events).find((event) => event.id === active.id);

    setActiveItem(activeItem ?? null);
    setSelectedIds((selected) => (selected.includes(active.id as string) ? selected : []));
    itineraryCacheRef.current = transformItineraryToCache(itinerary);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    // Skip if there's no drop target or if target is a trash can. Handled in `DragEnd`.
    if (over === null || over.id === "trash") return;

    const activeData = active.data.current as DragData;
    const overData = over.data.current as DragData;

    if (!activeData || !overData || !activeData?.type || !overData?.type || !("dayIndex" in activeData) || !("dayIndex" in overData)) {
      return;
    }

    const { type: activeType, dayIndex: activeDayIndex } = activeData;
    const { type: overType, dayIndex: overDayIndex } = overData;

    const activeDay = itinerary[activeDayIndex];
    const overDay = itinerary[overDayIndex];

    // Add the activeDay and overDay IDs to the update list if they're not already included
    if (!affectedDayIdsRef.current.includes(activeDay.id as string)) affectedDayIdsRef.current.push(activeDay.id as string);
    if (!affectedDayIdsRef.current.includes(overDay.id as string)) affectedDayIdsRef.current.push(overDay.id as string);

    // Handle dragging of a day within the itinerary.
    if (activeType === "day") {
      const newItinerary = arrayMove(itinerary, activeDayIndex, overDayIndex);

      // Swap the dates of the active and target days
      [activeDay.date, overDay.date] = [overDay.date, activeDay.date];

      // Update the dates of the events in the active and target days
      activeDay.events = updateEventData(activeDay.events, activeDay.date);
      overDay.events = updateEventData(overDay.events, overDay.date);

      // Update the date of the active item
      if (activeItem) setActiveItem({ ...activeItem, date: activeDay.date });

      setItinerary(newItinerary);
      setSelectedIds([]);
      return;
    }

    // Handle dragging of single or multiple events between different days.
    // Skip if dragging is within the same day. Handled in `DragEnd`.
    if (activeDayIndex === overDayIndex) return;

    const activeEvents = filterEvents(activeDay.events, true);
    const draggedEvents = filterDraggedEvents(activeDay.events);

    const targetIndex = findTargetIndex(active, over, overDay, overType);

    setItinerary((itinerary) => {
      const newItinerary = [...itinerary];
      newItinerary[activeDayIndex].events = updateEventData(activeEvents);
      newItinerary[overDayIndex].events = updateEventData(insertAt(overDay.events, draggedEvents, targetIndex), overDay.date);
      return newItinerary;
    });

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
    if (!activeData || !overData || !activeData?.type || !overData?.type || !("dayIndex" in activeData) || !("dayIndex" in overData)) {
      setActiveItem(null);
      setSelectedIds([]);
      return;
    }

    const { type: activeType, dayIndex: activeDayIndex } = activeData;
    const { type: overType, dayIndex: overDayIndex } = overData;

    const activeDay = itinerary[activeDayIndex];
    const overDay = itinerary[overDayIndex];

    // Handle dragging of single or multiple events to the trash.
    if (over.id === "trash" && activeType === "event" && activeItem) {
      deleteEvents(selectedIds.length ? selectedIds : [active.id as string]);
      setActiveItem(null);
      setSelectedIds([]);
      return;
    }

    // Handle dragging of single or multiple events within day.
    // Skip if dragging is not within the same day or if the drag type is a day. Both cases are handled in `DragOver`.
    if (activeDayIndex !== overDayIndex || activeType === "day" || overType === "day") {
      setActiveItem(null);
      syncEvents(affectedDayIdsRef.current);
      return;
    }

    const dayEvents = filterEvents(activeDay.events);
    const draggedEvents = filterDraggedEvents(activeDay.events);

    const initialIndex = dayEvents.findIndex((event) => event.id === active.id);
    const targetIndex = findTargetIndex(active, over, overDay, overType);

    // Use arrayMove to relocate the event from its original to the desired position.
    // Then remove the relocated event at the target index to avoid duplication,
    // since it's already included in the draggedEvents that we insert at that spot.
    const rearrangedEvents = arrayMove(dayEvents, initialIndex, targetIndex).toSpliced(targetIndex, 1, ...draggedEvents);

    setItinerary((itinerary) => {
      const newItinerary = [...itinerary];
      newItinerary[activeDayIndex].events = updateEventData(rearrangedEvents);
      return newItinerary;
    });
    setActiveItem(null);
    syncEvents([activeDay.id]);
  };

  const handleDragCancel = () => {
    setItinerary(restoreItineraryFromCache(itinerary, itineraryCacheRef.current, affectedDayIdsRef.current));
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
      if (activeItem && "events" in activeItem) {
        // If the active item is an day, return the closestCenter detection strategy with droppable's of the type "day"
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((droppable) => droppable.data.current?.type === "day"),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections = pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args);
      let overId = !intersections || intersections.length === 0 ? null : intersections[0].id;

      if (overId === "trash") return pointerWithin(args);
      if (overId !== null) {
        const intersectingDayEventsIds = itinerary.find((day) => day.id === overId)?.events.map((event) => event.id);
        const intersectingRect = args.droppableContainers.find((droppable) => droppable.id === overId)?.rect.current;
        const pointerX = args.pointerCoordinates?.x;

        if (intersectingDayEventsIds && intersectingRect && pointerX) {
          const eventsWidthWithinContainer = intersectingRect.left + intersectingDayEventsIds.length * 160;
          const isPointerWithinEvents = intersectingDayEventsIds.length > 0 && pointerX < eventsWidthWithinContainer;

          if (isPointerWithinEvents) {
            return closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (droppable) => droppable.id !== overId && intersectingDayEventsIds.includes(droppable.id as string),
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
      keyboardCodes: { start: [KEY.Space], cancel: [KEY.Escape], end: [KEY.Space, KEY.Enter] },
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
      const childrenContainsIgnore = Array.from(target.children).some((child) => child.classList.contains("ignore-deselect"));

      if (containsIgnore || childrenContainsIgnore) return;

      if (!(e.ctrlKey || e.metaKey)) setSelectedIds([]);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === KEY.Escape && selectedIds.length !== 0) setSelectedIds([]);
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [selectedIds]);

  // Update itinerary when tripItinerary changes
  useEffect(() => {
    if (!compareArrays(itinerary, tripItinerary)) setItinerary(tripItinerary);
  }, [tripItinerary]); // eslint-disable-line react-hooks/exhaustive-deps

  const dndItineraryContext: DndItineraryContextProps = useMemo(
    () => ({
      userId,
      tripId,
      eventsCount: itinerary.flatMap((day) => day.events).length,
      getItineraryClone: () => deepCloneItinerary(itinerary),
      selectEvent,
      deleteEvents,
    }),
    [userId, tripId, itinerary, selectEvent, deleteEvents],
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
        <SortableContext items={itinerary.map((day) => day.id)} strategy={verticalListSortingStrategy}>
          <ul className="flex w-full min-w-fit flex-col">
            {itinerary.map((day, index) => (
              <DndDay key={day.id} day={day} dayIndex={index} itinerary={itinerary}>
                <SortableContext items={filterEvents(day.events).map((event) => event.id)} strategy={horizontalListSortingStrategy}>
                  {filterEvents(day.events).map((event) => (
                    <Activity key={event.id} event={event} day={day} dayIndex={index} isSelected={selectedIds.includes(event.id)} />
                  ))}
                </SortableContext>
              </DndDay>
            ))}
          </ul>
        </SortableContext>

        {/* Calendar End */}
        <div className="sticky left-56 mb-4 flex h-5 w-32 cursor-default items-center justify-center rounded-b-xl bg-kolumblue-500 text-xs font-medium text-kolumblue-200 shadow-xl">
          End of Trip
        </div>

        <DndTrash />
        <DndDragOverlay
          activeItem={activeItem}
          selectedIds={selectedIds}
          enableEventComposer={eventCount < USER_ROLE.EVENTS_PER_TRIP_LIMIT}
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
  function findTargetIndex(active: Active, over: Over, overDay: Day, overType: "day" | "event") {
    const filteredOverDayEvents = filterEvents(overDay.events);
    const totalEvents = filteredOverDayEvents.length;

    if (overType === "day") return totalEvents;

    // This comment addresses a subtle behavior when dragging an event over a day that already contains events.
    // It might seem like you're dragging over the day itself, but in reality, the event is dragged over the last event of the day.
    // If the event is dragged past the last event, we adjust the position to append it at the day's end.
    const isDraggedPastOverEvent =
      over && active.rect.current.translated && active.rect.current.translated.left > over.rect.left + over.rect.width;
    const positionAdjustment = isDraggedPastOverEvent ? 1 : 0;

    const overEventIndex = filteredOverDayEvents.findIndex((event) => event.id === over.id);
    const validIndex = overEventIndex >= 0 && overEventIndex + positionAdjustment <= totalEvents;

    return validIndex ? overEventIndex + positionAdjustment : totalEvents;
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
  function filterEvents(events: Event[], excludeActiveEvent = false): Event[] {
    if (!activeItem) return events;

    if (excludeActiveEvent) return events.filter((event) => event.id !== activeItem.id && !selectedIds.includes(event.id));
    return events.filter((event) => event.id === activeItem.id || !selectedIds.includes(event.id));
  }
  /**
   * Filters the provided array of events to return only the events that are currently being dragged.
   * An event is considered to be dragged if it's either the active event or its id is included in the list of selected events ids.
   *
   * @param events - The array of events to filter.
   * @returns An array of events that are currently being dragged or the original array.
   */
  function filterDraggedEvents(events: Event[]): Event[] {
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
  function filterEventsExcludingIds(events: Event[], ids: string[]): Event[] {
    return events.filter((event) => !ids.includes(event.id));
  }

  // Event Manipulation Functions
  /**
   * Updates the date and position properties of each event in the provided array.
   *
   * The date property is updated to the provided date, or if no date is provided, it remains the same.
   * The position property is updated to the index of the event in the array.
   *
   * @param events - The array of events to update.
   * @param date - Optional. The new date for the events. If not provided, the date of each event remains the same.
   * @returns A new array of events with updated date and position properties.
   */
  function updateEventData(events: Event[], date?: string): Event[] {
    return events.map((event, index) => ({ ...event, date: date || event.date, position: index }));
  }
  /**
   * Inserts an array of events at a specific index in another array of events.
   *
   * The function creates a new array that includes all events from the original array,
   * but with the events from the second array inserted at the specified index.
   *
   * @param array - The original array of events.
   * @param events - The array of events to insert.
   * @param index - The index at which to insert the events.
   * @returns A new array with the events inserted at the specified index.
   */
  function insertAt(array: Event[], events: Event[], index: number): Event[] {
    return [...array.slice(0, index), ...events, ...array.slice(index)];
  }

  // Database handling functions
  function syncEvents(affectedDayIds: string[]) {
    const currentEvents = affectedDayIds.flatMap((dayId) => itinerary.find((day) => day.id === dayId)?.events ?? []);
    const previousEvents = affectedDayIds.flatMap((dayId) => itineraryCacheRef.current[dayId] ?? []);

    const areEventsEqual = (event1: Event, event2: Event) => {
      return event1.id === event2.id && event1.date === event2.date && event1.position === event2.position;
    };

    const updatedEvents = currentEvents.filter((event) => !previousEvents.some((previousEvent) => areEventsEqual(previousEvent, event)));

    dispatchUserTrips({ type: UT.REPLACE_ITINERARY, payload: { tripId, itinerary } });
    updatedEvents.forEach((event) => {
      setSaving(true);
      updateEvent.mutate(
        { eventId: event.id, data: { date: event.date, position: event.position } },
        {
          onSuccess(updatedEvent) {
            if (!updatedEvent) return;
            dispatchUserTrips({ type: UT.UPDATE_EVENT, payload: { tripId, event: { ...event, updatedAt: updatedEvent.updatedAt } } });
          },
          onError(error) {
            console.error(error);
            dispatchUserTrips({
              type: UT.REPLACE_ITINERARY,
              payload: { tripId, itinerary: restoreItineraryFromCache(itinerary, itineraryCacheRef.current, affectedDayIds) },
            });
          },
          onSettled: () => setSaving(false),
        },
      );
    });
  }
}
