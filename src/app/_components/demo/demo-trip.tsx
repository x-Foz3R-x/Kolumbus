"use client";

import { useEffect, useState } from "react";
import { add } from "date-fns";

import Calendar from "~/components/calendar";
import { DndItinerary } from "~/components/dnd-itinerary";
import { Button, Icons, Input } from "~/components/ui";
import Brand from "~/components/brand";
import TripToolbar from "~/components/trip-toolbar";
import { Floating } from "~/components/ui/floating";
import useHistoryState from "~/hooks/use-history-state";
import { cn, createId, differenceInDays, formatDate } from "~/lib/utils";
import type { ItinerarySchema } from "~/lib/validations/trip";
import { DEMO_LIMITS, type DemoTrip } from "./use-demo-library";

export default function DemoTripEditor(props: {
  initialTrip: DemoTrip;
  onSave: (trip: DemoTrip) => void;
  onLibrary: () => void;
  onComplete: (task: string) => void;
}) {
  const [trip, setTrip, history] = useHistoryState(props.initialTrip, {
    initialDescription: "Open trip",
    limit: 40,
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const { onSave, onComplete } = props;
  const { changes, position, getEntry, undo, redo } = history;

  useEffect(() => {
    onSave(getEntry(position));
  }, [changes, position, getEntry, onSave]);

  const updateItinerary = (value: ItinerarySchema | number, description?: string) => {
    setTrip(typeof value === "number" ? value : { ...trip, itinerary: value }, description);
    if (!description) return;
    if (description.startsWith("Add")) onComplete("add");
    if (description.startsWith("Move")) onComplete("move");
    if (/Move \d+ places/.test(description)) onComplete("multiple");
    if (description === "Update place") onComplete("details");
  };

  const jumpTo = (index: number) => {
    history.jumpTo(index);
    onComplete("history");
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, [contenteditable=true]")
      )
        return;
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return;
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
      onComplete("history");
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [undo, redo, onComplete]);

  const changeDates = (start: Date, end: Date) => {
    const count = Math.min(DEMO_LIMITS.days, Math.max(1, differenceInDays(start, end, true)));
    const boundedEnd = add(start, { days: count - 1 });
    const remainingPlaces = trip.itinerary.slice(count).flatMap((day) => day.places);
    const itinerary = Array.from({ length: count }, (_, index) => ({
      id: trip.itinerary[index]?.id ?? createId(),
      date: formatDate(add(start, { days: index })),
      places: [
        ...(trip.itinerary[index]?.places ?? []),
        ...(index === count - 1 ? remainingPlaces : []),
      ].map((place, sortIndex) => ({ ...place, dayIndex: index, sortIndex })),
    }));
    setTrip(
      { ...trip, startDate: formatDate(start), endDate: formatDate(boundedEnd), itinerary },
      "Change dates",
    );
    onComplete("dates");
  };

  return (
    <>
      <TripToolbar
        className="h-auto min-h-14 shrink-0 flex-wrap gap-x-4 gap-y-2 bg-white px-4 py-2 sm:px-5"
        navigation={
          <>
            <Button
              onClick={props.onLibrary}
              variant="unset"
              size="unset"
              aria-label="Back to library"
              tooltip={{ children: "Back to library" }}
              className="flex shrink-0 items-center gap-2 rounded-lg py-1 text-sm text-gray-500 hover:text-kolumblue-600"
            >
              <Brand compact className="[&_svg]:size-7" />
              <span className="hidden sm:inline">Library</span>
            </Button>
            <Icons.slash aria-hidden="true" className="size-[22px] shrink-0 stroke-gray-300" />
            <Input
              key={position}
              aria-label="Trip name"
              value={trip.name}
              maxLength={100}
              onChange={(event) => setTrip({ ...trip, name: event.target.value })}
              onUpdate={(event) =>
                setTrip(
                  { ...trip, name: event.target.value.trim() || "My next adventure" },
                  "Rename trip",
                )
              }
              className={{
                container: "h-fit min-w-0 max-w-[min(38ch,60vw)]",
                input:
                  "rounded bg-transparent px-0 py-0.5 font-normal shadow-none duration-300 ease-kolumb-flow hover:bg-black/5 hover:shadow-sm focus:bg-white focus:px-2 focus:shadow-focus",
                dynamic: "peer-hover:px-2 peer-focus:px-2",
              }}
              dynamicWidth
            />
          </>
        }
        actions={
          <>
            <Button
              aria-label="Undo last change"
              onClick={() => jumpTo(position - 1)}
              disabled={!history.canUndo}
              size="icon"
              className="bg-transparent text-gray-500"
              tooltip={{ children: "Undo" }}
            >
              <Icons.undo className="size-3.5 fill-current" />
            </Button>
            <Button
              aria-label="Redo change"
              onClick={() => jumpTo(position + 1)}
              disabled={!history.canRedo}
              size="icon"
              className="bg-transparent text-gray-500"
              tooltip={{ children: "Redo" }}
            >
              <Icons.redo className="size-3.5 fill-current" />
            </Button>
            <Floating
              isOpen={historyOpen}
              onOpenChange={(open) => {
                setHistoryOpen(open);
                if (open) onComplete("history");
              }}
              click={{ enabled: true }}
              placement="bottom-end"
              zIndex={45}
              className="w-72 overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-floating"
              triggerProps={{
                "aria-label": "Trip history",
                "aria-expanded": historyOpen,
                size: "sm",
                className: "bg-gray-50 text-gray-500",
                children: "History",
              }}
            >
              <p className="px-2 pb-2 pt-1 text-xs font-semibold text-gray-600">
                Changes since opening this trip
              </p>
              <ol className="max-h-64 overflow-y-auto">
                {changes.map((change, index) => (
                  <li key={index}>
                    <button
                      onClick={() => jumpTo(index)}
                      aria-current={position === index ? "step" : undefined}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-gray-500 hover:bg-gray-50 focus-visible:bg-gray-50",
                        position === index && "bg-kolumblue-50 text-kolumblue-600",
                      )}
                    >
                      {change}
                      {position === index && <Icons.check className="size-2.5 fill-current" />}
                    </button>
                  </li>
                ))}
              </ol>
            </Floating>
            <Calendar
              startDate={trip.startDate}
              endDate={trip.endDate}
              maxDays={DEMO_LIMITS.days}
              onApply={changeDates}
            />
          </>
        }
      />
      <div className="min-h-0 flex-1 overflow-auto bg-white p-4 sm:p-6">
        <DndItinerary
          tripId={trip.id}
          userId="guest"
          itinerary={trip.itinerary}
          setItinerary={updateItinerary}
          placeLimit={DEMO_LIMITS.places}
          dndTrash
          calendar="left-0 mb-0"
        />
      </div>
    </>
  );
}
