import { DragOverlay } from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

import type { Day } from "~/lib/validations/trip";
import type { ActivityEvent, Event } from "~/lib/validations/event";

import DayOverlay from "./day-overlay";
import { ActivityOverlay } from "./events";

const ACTIVITY_WIDTH = 160;

type OverlayProps = {
  activeItem: Day | Event | null;
  selectedIds: string[];
  enableEventComposer: boolean;
};
export default function DndDragOverlay({
  activeItem,
  selectedIds,
  enableEventComposer,
}: OverlayProps) {
  // To keep the cursor over the drag overlay during drag-and-drop of multiple events,
  // The drag overlay is shifted to the right and it equals the activeItem.id index in the selectedIds array times the EVENT_WIDTH
  const translateX =
    activeItem && selectedIds.length > 1 ? selectedIds.indexOf(activeItem.id) * ACTIVITY_WIDTH : 0;

  const modifiers =
    activeItem && "events" in activeItem
      ? [restrictToVerticalAxis, restrictToParentElement]
      : undefined;

  return (
    <DragOverlay modifiers={modifiers} style={{ translate: `${translateX}px 0` }} zIndex={35}>
      <Overlay
        activeItem={activeItem}
        selectedIds={selectedIds}
        enableEventComposer={enableEventComposer}
      />
    </DragOverlay>
  );
}

function Overlay({ activeItem, selectedIds, enableEventComposer }: OverlayProps) {
  if (!activeItem) return null;

  if ("events" in activeItem)
    return <DayOverlay day={activeItem} enableEventComposer={enableEventComposer} />;

  return (
    <ActivityOverlay
      event={activeItem as ActivityEvent}
      selectCount={selectedIds.length ? selectedIds.length : 0}
      hoverShadow
    />
  );
}
