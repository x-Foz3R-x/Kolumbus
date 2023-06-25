import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  memo,
  useCallback,
} from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  getFirstCollision,
  rectIntersection,
} from "@dnd-kit/core";
import {
  useSortable,
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { produce } from "immer";

// Mockup data
const numOfDay = 5;
const numOfAttraction = 2;
const defaultPlan = (() => {
  let attractionIndex = 1;
  let dayNum = 1;
  const plan = [];
  while (dayNum <= numOfDay) {
    plan.push({
      id: dayNum,
      day: dayNum,
      dragType: "day",
      attractions: (() => {
        let i = 1;
        const attractions = [];
        while (i <= numOfAttraction) {
          attractions.push({
            id: `a${attractionIndex}`,
            name: `Attraction ${attractionIndex}`,
            dragType: "attraction",
            day: dayNum,
          });
          i++;
          attractionIndex++;
        }
        return attractions;
      })(),
    });
    dayNum++;
  }
  return {
    id: "myPlan",
    name: "My plan",
    plan,
  };
})();

console.log(defaultPlan);

export default function DnDComponent() {
  const [activePlan, setActivePlan] = useState(defaultPlan);
  const { plan, ...planInfo } = activePlan;
  const attractions = plan.map((day) => day.attractions).flat();

  const dayIds = plan.map((day) => day.id);
  const attractionIds = attractions.map((attraction) => attraction?.id).flat();

  const [activeId, setActiveId] = useState(null);
  const lastOverId = useRef(null);
  const recentlyMovedToNewContainer = useRef(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [dayIds]);

  async function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  function handleDragEnd() {
    setActiveId(null);
  }

  function handleDragOver({ active, over }) {
    const activeId = active?.id;
    const overId = over?.id;
    if (!activeId || !overId || activeId === overId) return;

    const activeType = active?.data?.current?.item?.dragType;
    const overType = over?.data?.current?.item?.dragType;
    console.log(activeType, overType);
    if (!activeType || !overType) return;

    const activeIndex = getIndex(activeType, activeId);
    if (typeof activeIndex !== "number" || activeIndex < 0) return;
    const activeDay = getDayNumber(activeId);
    if (typeof activeDay !== "number" || activeDay < 0) return;

    const overIndex = getIndex(overType, overId);
    if (typeof overIndex !== "number" || overIndex < 0) return;
    const overDay = getDayNumber(overId);
    if (typeof overDay !== "number" || overDay < 0) return;

    const dragDirection = getDragDirection({ active, over });
    if (!dragDirection) return;

    let newPlan;
    console.log("133", activeType, overType);
    if (activeType === "day" && overType === "day") {
      console.log("day over day");
      newPlan = arrayMove(plan, activeIndex, overIndex);
    } else if (activeType === "attraction" && overType === "day") {
      console.log("attraction over day");
      newPlan = attractionOverDay({
        activeId,
        activeIndex,
        activeDay,
        overIndex,
        overDay,
      });
    } else if (activeType === "attraction" && overType === "attraction") {
      console.log("attraction over attraction");
      newPlan = attractionOverAttraction({
        activeId,
        activeIndex,
        activeDay,
        overId,
        overIndex,
        overDay,
        dragDirection,
      });
    }
    if (!newPlan) return;
    // Update day and attractionIndex fields
    newPlan = produce(newPlan, (draft) => {
      let attractionIndex = 1;
      draft.forEach((day, dayIndex) => {
        const newDay = dayIndex + 1;
        day.day = newDay;
        day.attractions.forEach((attraction) => {
          attraction.day = newDay;
          attraction.attractionIndex = attractionIndex++;
        });
      });
    });
    recentlyMovedToNewContainer.current = true;
    setActivePlan({ plan: newPlan, ...planInfo });
  }

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (dayIds.includes(activeId)) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            dayIds?.includes(container?.id)
          ),
        });
      } else if (attractionIds.includes(activeId)) {
        // Start by finding any intersecting droppable
        const pointerIntersections = pointerWithin(args);
        const intersections =
          pointerIntersections.length > 0
            ? // If there are droppables intersecting with the pointer, return those
              pointerIntersections
            : rectIntersection(args);
        let overId = getFirstCollision(intersections, "id");

        if (overId != null) {
          if (dayIds.includes(overId)) {
            const attractions = plan.find(
              (day) => day.id === overId
            )?.attractions;

            if (attractions.length > 0) {
              // Return the closest droppable within that day
              overId = closestCenter({
                ...args,
                droppableContainers: args.droppableContainers.filter(
                  (container) =>
                    container.id !== overId &&
                    attractions.includes(container.id)
                ),
              })[0]?.id;
            }
          }

          lastOverId.current = overId;

          return [{ id: overId }];
        }

        // When a draggable item moves to a new container, the layout may shift
        // and the `overId` may become `null`. We manually set the cached `lastOverId`
        // to the id of the draggable item that was moved to the new container, otherwise
        // the previous `overId` will be returned which can cause items to incorrectly shift positions
        if (recentlyMovedToNewContainer.current) {
          lastOverId.current = activeId;
        }

        // If no droppable is matched, return the last match
        return lastOverId.current ? [{ id: lastOverId.current }] : [];
      }
    },
    [plan, activeId, attractionIds, dayIds]
  );

  function attractionOverAttraction({
    activeId,
    activeIndex,
    activeDay,
    overId,
    overIndex,
    overDay,
    dragDirection,
  }) {
    const activeDayIndex = activeDay - 1;
    const overDayIndex = overDay - 1;
    if (activeDayIndex < 0 || overDayIndex < 0) return;

    const targetIndex = (index) => {
      if (dragDirection === "fromAbove") {
        return index;
      } else if (dragDirection === "fromBelow") {
        return index + 1;
      }
    };

    const activeAttraction = getItem(activeId);

    let newPlan;
    // move within the same day
    if (activeId === overId) return;
    if (activeDay === overDay) {
      newPlan = produce(plan, (draft) => {
        const currentDay = draft?.[activeDayIndex];
        const currentAttractions = currentDay?.attractions;

        const newOrder = arrayMove(currentAttractions, activeIndex, overIndex);
        currentDay.attractions = newOrder;
      });
    }
    // move to a different day
    else if (activeDay !== overDay) {
      newPlan = produce(plan, (draft) => {
        const targetDay = draft?.[overDayIndex];
        const targetAttractions = targetDay?.attractions;

        // add to the new index
        const newIndex = targetIndex(overIndex);
        targetAttractions.splice(newIndex, 0, activeAttraction);
        // remove from original position
        const currentDay = draft?.[activeDayIndex];
        const currentAttractions = currentDay?.attractions;
        const newAttractions = currentAttractions.filter(
          (attraction) => attraction.id !== activeId
        );
        if (newAttractions) draft[activeDayIndex].attractions = newAttractions;
      });
    }
    return newPlan;
  }

  function attractionOverDay({ activeIndex, activeDay, overIndex, overDay }) {
    // Skip if the attraction is dragged over the same day element
    if (activeDay === overDay) return;

    const activeDayIndex = activeDay - 1;

    const newPlan = produce(plan, (draft) => {
      const overAttractions = draft?.[overIndex]?.attractions;
      const overAttractionsLength = overAttractions?.length;
      const activeAttraction = getItem(activeId);
      // To an empty day
      if (overAttractionsLength === 0) {
        overAttractions.push(activeAttraction);
        const sourceAttractions = draft?.[activeDayIndex]?.attractions;
        sourceAttractions.splice(activeIndex, 1);
      }
    });

    return newPlan;
  }

  function getDragDirection({ active, over }) {
    const activeBottom = active?.rect?.current?.initial?.bottom;
    const overTop = over?.rect?.top;
    if (activeBottom < overTop) return "fromAbove";
    if (activeBottom > overTop) return "fromBelow";
  }

  function getItem(id) {
    const day = plan.find((day) => day.id === id);
    const attraction = attractions.find((attraction) => attraction.id === id);
    return day ? day : attraction ? attraction : undefined;
  }

  function getIndex(type, id) {
    if (type === "day") {
      return plan.findIndex((day) => day.id === id);
    } else if (type === "attraction") {
      let result;
      plan.forEach((day) => {
        const index = day.attractions.findIndex(
          (attraction) => attraction.id === id
        );
        if (index > -1) result = index;
      });
      return result;
    }
  }

  function getDayNumber(id) {
    const item = getItem(id);
    return item?.day;
  }

  return (
    <ul className="my-5 flex h-full w-full flex-col gap-5">
      <DndContext
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={dayIds} strategy={verticalListSortingStrategy}>
          {dayIds.map((dayId) => (
            <Day key={dayId} day={getItem(dayId)} activeId={activeId} />
          ))}
        </SortableContext>

        <DragOverlay>
          {dayIds.includes(activeId) ? (
            <MemoDayItem day={getItem(activeId)} className="z-10" />
          ) : attractionIds.includes(activeId) ? (
            <MemoAttractionItem
              attraction={getItem(activeId)}
              className="z-10 bg-white"
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </ul>
  );
}

const Day = memo(function Core({ day, activeId, ...props }) {
  const { id } = day;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      item: day,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      id={id}
      ref={setNodeRef}
      style={{ ...style }}
      className={
        "flex h-[6.75rem] w-full touch-none duration-300 ease-kolumb-overflow " +
        (id === activeId ? "z-10" : "z-0")
      }
    >
      <MemoDayItem
        day={day}
        ref={setActivatorNodeRef}
        activeId={activeId}
        {...attributes}
        {...listeners}
        {...props}
      />
    </li>
  );
});

const DayItem = forwardRef(function Core(
  { activeId, day, className, ...props },
  ref
) {
  const { day: dayNumber, attractions } = day;
  const attractionIds = attractions.map((attraction) => attraction.id);

  return (
    <div className={"flex w-full " + className}>
      <div
        ref={ref}
        {...props}
        className="flex-none cursor-grab select-none"
      >{`Day ${dayNumber}:`}</div>
      <SortableContext
        items={attractionIds}
        strategy={horizontalListSortingStrategy}
      >
        <ul className="flex list-none gap-[0.625rem] p-2">
          {attractionIds.map((attractionId) => (
            <Attraction
              key={attractionId}
              attraction={attractions.find(
                (attraction) => attraction?.id === attractionId
              )}
              activeId={activeId}
            />
          ))}
        </ul>
      </SortableContext>
    </div>
  );
});
const MemoDayItem = memo(DayItem);

const Attraction = memo(function Core({ attraction, activeId }) {
  const { id } = attraction;

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      item: attraction,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      id={id}
      ref={setNodeRef}
      style={{ ...style }}
      className={
        "h-[6.75rem] w-36 flex-none touch-none duration-300 ease-kolumb-overflow " +
        (id === activeId
          ? "bg-green-300 duration-300 ease-kolumb-overflow"
          : "bg-white")
      }
    >
      <MemoAttractionItem
        attraction={attraction}
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
      />
    </li>
  );
});

const AttractionItem = forwardRef(function Core(
  { attraction, className, ...props },
  ref
) {
  const { name, attractionIndex } = attraction;
  return (
    <div className={className}>
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full border border-kolumbGray-500 text-center text-xs text-kolumbGray-500"
        {...props}
      >
        {attractionIndex}
      </span>
      <p>{name}</p>
    </div>
  );
});
const MemoAttractionItem = memo(AttractionItem);
