"use client";

import { useEffect, useState } from "react";
import { add, format } from "date-fns";

import Calendar from "~/components/calendar";
import { DndItinerary } from "~/components/dnd-itinerary";
import { Button, Icons } from "~/components/ui";
import { Floating } from "~/components/ui/floating";
import useHistoryState from "~/hooks/use-history-state";
import { cn, createId, differenceInDays, formatDate } from "~/lib/utils";
import type { ItinerarySchema } from "~/lib/validations/trip";
import type { DemoTrip } from "./use-demo-library";

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
    const count = differenceInDays(start, end, true);
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
      { ...trip, startDate: formatDate(start), endDate: formatDate(end), itinerary },
      "Change dates",
    );
    onComplete("dates");
  };

  return (
    <>
      <div className="border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
        <div className="mb-3 flex items-center gap-3">
          <Button
            onClick={props.onLibrary}
            size="sm"
            className="flex flex-shrink-0 items-center gap-1.5 bg-gray-50 text-gray-500"
          >
            <Icons.library className="size-3.5 fill-current" /> Library
          </Button>
          <span className="text-gray-200" aria-hidden>
            /
          </span>
          <label className="min-w-0 flex-1">
            <span className="sr-only">Trip name</span>
            <input
              value={trip.name}
              maxLength={100}
              onChange={(event) => setTrip({ ...trip, name: event.target.value })}
              onBlur={() =>
                setTrip({ ...trip, name: trip.name.trim() || "My next adventure" }, "Rename trip")
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
              }}
              className="w-full min-w-0 rounded bg-transparent py-1 font-belanosima text-lg font-semibold text-gray-700 focus-visible:bg-kolumblue-50"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar
              startDate={trip.startDate}
              endDate={trip.endDate}
              maxDays={14}
              onApply={changeDates}
              placement="bottom-start"
              triggerProps={{
                "aria-label": "Change trip dates",
                variant: "unset",
                size: "sm",
                className:
                  "flex items-center gap-2 rounded-lg bg-kolumblue-50 px-3 py-2 text-xs font-medium text-kolumblue-600 hover:bg-kolumblue-100",
                children: (
                  <>
                    <Icons.rangeCalendar className="size-4 fill-current" />
                    <span>
                      {format(new Date(trip.startDate), "d MMM")} –{" "}
                      {format(new Date(trip.endDate), "d MMM")}
                    </span>
                  </>
                ),
              }}
            />
            <span className="hidden text-xs text-gray-400 sm:inline">
              {trip.itinerary.length} days
            </span>
          </div>
          <div className="flex items-center gap-1">
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
          </div>
        </div>
      </div>
      <div className="h-[clamp(320px,60vh,500px)] overflow-auto bg-gray-50/60 p-4 sm:p-6">
        <DndItinerary
          tripId={trip.id}
          userId="guest"
          itinerary={trip.itinerary}
          setItinerary={updateItinerary}
          placeLimit={100}
          dndTrash
          calendar="left-0 mb-0"
        />
      </div>
    </>
  );
}
