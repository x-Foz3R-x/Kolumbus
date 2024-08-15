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

import type { ItinerarySchema, DaySchema } from "~/lib/validations/trip";
import type { PlaceDetailsSchema, PlaceSchema } from "~/lib/validations/place";
import { DAY_CALENDAR_WIDTH, LIST_GAP, PLACE_WIDTH } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { KEYS } from "~/types";

import type { onItemCreate, onItemsDelete, onItemUpdate, onItemsMove } from ".";
import { DndItineraryContext, type DndItineraryContextProps } from "./dnd-context";

import DndDragOverlay from "./dnd-drag-overlay";
import DndTrash from "./dnd-trash";
import DndDay from "./dnd-day";
import { Place } from "./place";

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
  onItemCreate?: onItemCreate;
  onItemUpdate?: onItemUpdate;
  onItemsMove?: onItemsMove;
  onItemsDelete?: onItemsDelete;
  getEntry: (index: number) => ItinerarySchema;
  placeLimit: number;
  dndTrash?: { variant: "default" | "inset"; className?: string } | boolean;
  calendar?: string;
};
export function DndItinerary({
  userId,
  tripId,
  itinerary,
  setItinerary,
  onItemCreate,
  onItemUpdate,
  onItemsMove,
  onItemsDelete,
  getEntry,
  placeLimit,
  dndTrash,
  calendar,
}: Props) {
  const [activeItem, setActiveItem] = useState<DaySchema | PlaceSchema | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const affectedListsRef = useRef<string[]>([]);

  const placeCount = useMemo(() => itinerary.flatMap((day) => day.places).length, [itinerary]);

  const getMovedItemsDetails = useCallback(
    (newItinerary: ItinerarySchema, affectedListIds: string[]) => {
      // Retrieves the last saved itinerary state before the current drag operation.
      // Due to a delay in history updates, the last entry (-1) reflects the previous state,
      // not the current one, making it suitable for comparison.
      const prevItinerary = getEntry(-1);

      const getItemsFromAffectedLists = (itinerary: ItinerarySchema) => {
        return itinerary
          .filter((day) => affectedListIds.includes(day.id))
          .flatMap((day) => day.places);
      };
      const identifyMovedItems = (affectedPlaces: PlaceSchema[], prevPlaces: PlaceSchema[]) => {
        return affectedPlaces
          .filter((place) =>
            prevPlaces.some(
              (prevPlace) =>
                prevPlace.id === place.id &&
                // Check if the place's dayIndex or sortIndex has changed
                (place.dayIndex !== prevPlace.dayIndex || place.sortIndex !== prevPlace.sortIndex),
            ),
          )
          .map((place) => ({ id: place.id, dayIndex: place.dayIndex, sortIndex: place.sortIndex }));
      };

      const newItems = getItemsFromAffectedLists(newItinerary);
      const prevItems = getItemsFromAffectedLists(prevItinerary);
      const movedItemsDetails = identifyMovedItems(newItems, prevItems);

      return movedItemsDetails;
    },
    [getEntry],
  );

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
    (place: PlaceSchema) => {
      const newItinerary = structuredClone(itinerary);

      const dayId = newItinerary[place.dayIndex]!.id;
      const dayPlaces = newItinerary[place.dayIndex]!.places;

      if (place.sortIndex < dayPlaces.length) {
        // Insert the new place at the sortIndex and update the sortIndex of the following places
        dayPlaces.splice(place.sortIndex, 0, place);
        dayPlaces.map((place, index) => (place.sortIndex = index));
      } else {
        dayPlaces.push(place);
      }

      setItinerary(newItinerary, "Add place");

      if (onItemCreate && onItemsMove) {
        const movedItemsDetails = getMovedItemsDetails(newItinerary, [dayId]);

        onItemsMove(tripId, movedItemsDetails);
        onItemCreate(place);
      }
    },
    [tripId, itinerary, setItinerary, onItemCreate, onItemsMove, getMovedItemsDetails],
  );
  const updateItem = useCallback(
    (place: PlaceSchema, updatedFields: Partial<PlaceDetailsSchema>) => {
      const newItinerary = structuredClone(itinerary);

      const dayIndex = findListIndexByItemId(place.id, newItinerary, place.dayIndex);
      if (dayIndex === -1) return;

      const sortIndex =
        place.sortIndex ?? newItinerary[dayIndex]!.places.findIndex((e) => e.id === place.id);
      if (sortIndex === -1 || !newItinerary[dayIndex]!.places[sortIndex]) return;

      newItinerary[dayIndex]!.places[sortIndex] = place;

      setItinerary(newItinerary, "Update place");
      onItemUpdate?.(tripId, place.id, updatedFields);
    },
    [tripId, itinerary, setItinerary, onItemUpdate],
  );
  const deleteItems = useCallback(
    (placeIds: string[]) => {
      const newItinerary = structuredClone(itinerary);
      const affectedDayIds: string[] = [];

      newItinerary.forEach((day) => {
        const hasDeletedPlaces = day.places.some((place) => placeIds.includes(place.id));
        if (hasDeletedPlaces) {
          day.places = updateItemsPlacement(filterPlacesExcludingIds(day.places, placeIds));
          affectedDayIds.push(day.id);
        }
      });

      const actionDesc = placeIds.length > 1 ? `Delete ${placeIds.length} places` : "Delete place";
      setItinerary(newItinerary, actionDesc);

      if (onItemsDelete && onItemsMove) {
        const movedItemsDetails = getMovedItemsDetails(newItinerary, affectedDayIds);

        onItemsMove(tripId, movedItemsDetails);
        onItemsDelete(tripId, placeIds);
      }
    },
    [itinerary, setItinerary, onItemsDelete, onItemsMove, getMovedItemsDetails, tripId],
  );

  //#region Drag handlers
  // handleDragStart - setts active item
  // handleDragOver - handles drag of lists and drag of items between lists
  // handleDragEnd - handles drag to trash and drag of items within the same list
  // handleDragCancel - handles resetting itinerary to the last history entry
  type DragData = { type: "list" | "item"; listIndex: number } | undefined;

  const handleDragStart = ({ active }: DragStartEvent) => {
    const activeItem =
      (active.data.current as DragData)?.type === "list"
        ? itinerary.find((day) => day.id === active.id)
        : itinerary.flatMap((day) => day.places).find((place) => place.id === active.id);

    setActiveItem(activeItem ?? null);
    setSelectedIds((selected) => (selected.includes(active.id as string) ? selected : [])); // Deselect all if dragged item is not in selection
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

    // Handle dragging of single or multiple items between different lists.
    // Skip if dragging is within the same list. Handled in `DragEnd`.
    if (activeListIndex === overListIndex) return;

    const activeList = itinerary[activeListIndex]!;
    const overList = itinerary[overListIndex]!;

    // Add the activeList and overList ids to the affected list if they're not already included
    if (!affectedListsRef.current.includes(activeList.id)) {
      affectedListsRef.current.push(activeList.id);
    }
    if (!affectedListsRef.current.includes(overList.id)) {
      affectedListsRef.current.push(overList.id);
    }

    // Handle dragging of a list within the itinerary.
    if (activeType === "list") {
      const newItinerary = arrayMove(itinerary, activeListIndex, overListIndex);

      [activeList.date, overList.date] = [overList.date, activeList.date]; // Swap dates between dragged and target lists.
      if (activeItem) setActiveItem?.({ ...activeItem, date: activeList.date }); // Update overlay list date

      // Correct the dayIndex for places in both swapped days.
      newItinerary[activeListIndex]!.places.map((place) => (place.dayIndex = activeListIndex));
      newItinerary[overListIndex]!.places.map((place) => (place.dayIndex = overListIndex));

      setItinerary(newItinerary);
      return;
    }

    const activeItems = filterItems(activeList.places, true);
    const draggedItems = filterDraggedItems(activeList.places);

    const targetIndex = findTargetIndex(active, over, overList, overType);

    const newItinerary = structuredClone(itinerary);
    newItinerary[activeListIndex]!.places = updateItemsPlacement(activeItems, activeListIndex);
    newItinerary[overListIndex]!.places = insertItemsAt(
      overList.places,
      draggedItems,
      targetIndex,
      overListIndex,
    );

    setItinerary(newItinerary);

    recentlyMovedToNewList.current = true;
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

    const activeList = itinerary[activeListIndex]!;
    const overList = itinerary[overListIndex]!;

    // Handle dragging of single or multiple items to the trash.
    if (over.id === "trash" && activeType === "item" && activeItem) {
      deleteItems(selectedIds.length ? selectedIds : [active.id as string]);
      setActiveItem(null);
      setSelectedIds([]);
      affectedListsRef.current = [];
      return;
    }

    // Skip if dragging is NOT within the same list or if the drag type is a list. Both cases are handled in `DragOver`.
    if (
      (!!activeItem && "dayIndex" in activeItem && activeItem.dayIndex !== activeListIndex) ||
      activeListIndex !== overListIndex ||
      activeType === "list" ||
      overType === "list"
    ) {
      let actionDesc = "Move place";
      if (activeType === "list") actionDesc = "Move day";
      else if (selectedIds.length > 1) actionDesc = `Move ${selectedIds.length} places`;

      setItinerary(itinerary, actionDesc);
      onItemsMove?.(tripId, getMovedItemsDetails(itinerary, [activeList.id]));

      setActiveItem(null);
      affectedListsRef.current = [];
      return;
    }

    const listItems = filterItems(activeList.places);
    const draggedItems = filterDraggedItems(activeList.places);

    const initialIndex = listItems.findIndex((place) => place.id === active.id);
    const targetIndex = findTargetIndex(active, over, overList, overType);

    // Use arrayMove to relocate the item to the desired placement.
    // Then remove the relocated item at the target index to avoid duplication,
    // since it's already included in the draggedItems that we insert at that spot.
    const rearrangedItems = arrayMove(listItems, initialIndex, targetIndex).toSpliced(
      targetIndex,
      1,
      ...draggedItems,
    );

    const newItinerary = structuredClone(itinerary);
    newItinerary[activeListIndex]!.places = updateItemsPlacement(rearrangedItems, activeListIndex);

    setItinerary(
      newItinerary,
      selectedIds.length > 1 ? `Move ${selectedIds.length} places` : "Move place",
    );
    onItemsMove?.(tripId, getMovedItemsDetails(newItinerary, [activeList.id]));

    setActiveItem(null);
    affectedListsRef.current = [];
  };
  const handleDragCancel = () => {
    setItinerary(-1);
    setActiveItem(null);
    affectedListsRef.current = [];
  };
  //#endregion

  //#region Dnd-kit misc
  const lastOverId = useRef<string | null>(null);
  const recentlyMovedToNewList = useRef(false);

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
        // If the active item is an list, return the closestCenter detection strategy with droppable's of the type "list"
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
        const intersectingListItemsIds = itinerary
          .find((day) => day.id === overId)
          ?.places.map((place) => place.id);
        const intersectingRect = args.droppableContainers.find(
          (droppable) => droppable.id === overId,
        )?.rect.current;
        const pointerX = args.pointerCoordinates?.x;

        if (intersectingListItemsIds && intersectingRect && pointerX) {
          const placesWidthWithinContainer =
            intersectingRect.left + intersectingListItemsIds.length * PLACE_WIDTH;
          const isPointerWithinPlaces =
            intersectingListItemsIds.length > 0 && pointerX < placesWidthWithinContainer;

          if (isPointerWithinPlaces) {
            return closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (droppable) =>
                  droppable.id !== overId &&
                  intersectingListItemsIds.includes(droppable.id as string),
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
      if (recentlyMovedToNewList.current) lastOverId.current = activeItem?.id ?? null;

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
    requestAnimationFrame(() => (recentlyMovedToNewList.current = false));
  }, [itinerary]);
  //#endregion

  // Deselect ids when pressing the escape key or when clicking without ctrl key
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (selectedIds.length === 0) return;

      // Ignore clicks on elements with the class "ignore-deselect"
      if (e.target instanceof Element && e.target.closest(".ignore-deselect")) return;

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

      selectItem,
      createItem,
      updateItem,
      deleteItems,
    }),
    [userId, tripId, placeCount, placeLimit, selectItem, createItem, updateItem, deleteItems],
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
                  items={filterItems(day.places).map((place) => place.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {filterItems(day.places).map((place) => (
                    <Place
                      key={place.id}
                      place={place}
                      dayIndex={index}
                      isSelected={selectedIds.includes(place.id)}
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

  function findTargetIndex(
    active: Active,
    over: Over,
    overList: DaySchema,
    overType: "list" | "item",
  ) {
    const filteredOverListItems = filterItems(overList.places);
    const totalItems = filteredOverListItems.length;

    if (overType === "list") {
      if (!active.rect.current.translated) return totalItems;

      // This calculation is necessary for when a user drags an item downwards.
      // Instead of hitting the item below, they might hit the list due to the margin on top of each list container.
      // This margin exists because the itinerary calendar is taller than the items to create visual gap between gap-less lists.
      // Thus, a different solution is needed to accurately calculate the target index.

      const activeRelativeLeft =
        active.rect.current.translated.left - over.rect.left - DAY_CALENDAR_WIDTH - LIST_GAP;

      // Directly calculate the target index based on the width of a place
      const targetIndex = Math.floor(activeRelativeLeft / PLACE_WIDTH);

      // Ensure the target index is within the bounds of total places
      return Math.min(targetIndex, totalItems);

      //#region For varied width of items
      // Calculate the target index based on the active item's left position
      // const NOTE_WIDTH = 80;
      // let accumulatedWidth = 0;
      // let targetIndex = 0;

      // // Iterate through the items to find where the active item fits based on its left position
      // for (const item of overDay.items) {
      //   const itemWidth = item.type === 'place' ? PLACE_WIDTH : NOTE_WIDTH;
      //   if (activeRelativeLeft < accumulatedWidth + itemWidth) break;
      //   accumulatedWidth += itemWidth;
      //   targetIndex++;
      // }

      // return Math.min(targetIndex, totalPlaces);
      //#endregion
    }

    // A nuanced behavior dnd-kit.
    // When a item is dragged over a list that already has items, it appears as if it's being dragged over the list.
    // However, the system interprets this action as dragging over the last item in that list.
    // Should the item be dragged beyond the last item, its position is adjusted to append it at the end of the list.
    const isDraggedPastOverItem =
      over &&
      active.rect.current.translated &&
      active.rect.current.translated.left >= over.rect.left + over.rect.width;
    const positionAdjustment = isDraggedPastOverItem ? 1 : 0;

    const overItemIndex = filteredOverListItems.findIndex((place) => place.id === over.id);
    const validIndex = overItemIndex >= 0 && overItemIndex + positionAdjustment <= totalItems;

    return validIndex ? overItemIndex + positionAdjustment : totalItems;
  }
  function findListIndexByItemId(id: string, itinerary: ItinerarySchema, dayIndex?: number) {
    return dayIndex ?? itinerary.findIndex((day) => day.places.some((place) => place.id === id));
  }

  // Items Filters
  /**
   * Filters out selected events from the provided array during a drag operation.
   * An event is excluded if its id is included in the list of selected events ids
   * or if `excludeActiveEvent` is true then also the active event.
   *
   * @param places - The array of events to filter.
   * @param excludeActiveItem - Optional. If true, the active event is excluded from the new array. Default is false.
   * @returns  A new array of events excluding the selected ones and optionally the active event.
   */
  function filterItems(places: PlaceSchema[], excludeActiveItem = false): PlaceSchema[] {
    if (!activeItem) return places;

    if (excludeActiveItem)
      return places.filter(
        (place) => place.id !== activeItem.id && !selectedIds.includes(place.id),
      );
    return places.filter((event) => event.id === activeItem.id || !selectedIds.includes(event.id));
  }
  /**
   * Filters the provided array of events to return only the events that are currently being dragged.
   * An event is considered to be dragged if it's either the active event or its id is included in the list of selected events ids.
   *
   * @param places - The array of events to filter.
   * @returns An array of events that are currently being dragged or the original array.
   */
  function filterDraggedItems(places: PlaceSchema[]): PlaceSchema[] {
    if (!activeItem) return places;
    return places.filter((place) => place.id === activeItem.id || selectedIds.includes(place.id));
  }
  /**
   * Filters the provided array of events to return only the events whose ids are not included in the provided ids array.
   *
   * @param places - The array of events to filter.
   * @param ids - The array of ids to exclude.
   * @returns An array of events whose ids are not included in the provided ids array.
   */
  function filterPlacesExcludingIds(places: PlaceSchema[], ids: string[]): PlaceSchema[] {
    return places.filter((place) => !ids.includes(place.id));
  }

  function insertItemsAt(
    listOfItems: PlaceSchema[],
    toInsertItems: PlaceSchema[],
    atIndex: number,
    dayIndex: number,
  ): PlaceSchema[] {
    const combinedList = [
      ...listOfItems.slice(0, atIndex),
      ...toInsertItems,
      ...listOfItems.slice(atIndex),
    ];

    return updateItemsPlacement(combinedList, dayIndex);
  }
  function updateItemsPlacement(places: PlaceSchema[], dayIndex?: number): PlaceSchema[] {
    return places.map((place, index) => ({
      ...place,
      dayIndex: dayIndex ?? place.dayIndex,
      sortIndex: index,
    }));
  }
}
