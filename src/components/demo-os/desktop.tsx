"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useHistoryState from "~/hooks/use-history-state";

import type { EventSchema, ItinerarySchema } from "~/lib/types";

import Dock from "./dock";
import Window from "./window";
import { DndItinerary } from "../dnd-itinerary";
import itineraries from "./itineraries.json";
import { Button } from "../ui";
import PortalWindow from "./portal-window";
import { DatePicker } from "../date-picker";
import { add } from "date-fns";
import { cn, differenceInDays, formatDate } from "~/lib/utils";

export default function Desktop() {
  type Trip = { startDate: string; endDate: string; itinerary: ItinerarySchema };
  const [trip, setTrip, { changes, position, jumpTo, replaceHistory }] = useHistoryState<Trip>({
    startDate: formatDate(new Date()),
    endDate: formatDate(new Date()),
    itinerary: [],
  });
  const [windows, setWindows] = useState({
    itinerary: { isOpen: true, isMinimized: false },
    calendar: { isOpen: true, isMinimized: false },
    history: { isOpen: false, isMinimized: false },
    devTools: { isOpen: false, isMinimized: false },
  });
  const [itineraryWidth, setItineraryWidth] = useState(0);

  const updateItinerary = (itineraryOrIndex: ItinerarySchema | number, desc?: string) => {
    setTrip(
      typeof itineraryOrIndex === "number"
        ? itineraryOrIndex
        : { ...trip, itinerary: itineraryOrIndex },
      desc,
    );
  };

  const openWindow = (windowName: keyof typeof windows) => {
    setWindows({
      ...windows,
      [windowName]: { ...windows[windowName], isOpen: true, isMinimized: false },
    });
  };

  const closeWindow = (windowName: keyof typeof windows) => {
    setWindows({
      ...windows,
      [windowName]: { ...windows[windowName], isOpen: !windows[windowName].isOpen },
    });
  };

  const minimizeWindow = (windowName: keyof typeof windows) => {
    setWindows({
      ...windows,
      [windowName]: { ...windows[windowName], isMinimized: !windows[windowName].isMinimized },
    });
  };

  const handleDateSelection = (startDate: Date, endDate: Date) => {
    const days = differenceInDays(new Date(endDate), new Date(startDate));
    const itinerary = Array.from({ length: days }, (_, index) => ({
      id: `d${index + 1}`,
      date: formatDate(add(new Date(startDate), { days: index })),
      events: !!trip.itinerary[index]
        ? trip.itinerary[index].events.map((event) => ({
            ...event,
            date: formatDate(add(new Date(startDate), { days: index })),
          }))
        : [],
    }));

    setTrip({
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      itinerary,
    });
  };

  // Auto open history window when there are more than one changes
  const autoOpenHistory = useRef(true);
  useEffect(() => {
    if (autoOpenHistory.current && changes.length > 1) {
      autoOpenHistory.current = false;
      openWindow("history");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changes.length]);

  useLayoutEffect(() => {
    const totalPadding = 20;
    const dayCalendarWidth = 128;
    const gap = 20;
    const activityWidth = 160;
    const eventGap = 8;
    const composerGap = 16;
    const composerWidth = 32;

    const highestEventCount = Math.max(...trip.itinerary.map((day) => day.events.length));

    setItineraryWidth(
      totalPadding +
        dayCalendarWidth +
        gap * highestEventCount +
        activityWidth * highestEventCount +
        eventGap +
        composerGap +
        composerWidth,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip]);

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Step 2: Scroll to Bottom on New Item
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [changes.length]); // Depend on `changes.length` to detect new additions

  // Randomise the itinerary on mount
  useEffect(() => {
    const trip = randomTrip();

    setTrip(trip);
    replaceHistory([{ value: trip, desc: "Open" }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full flex-1 flex-col justify-between p-3">
      <div className="flex justify-between gap-2 pb-1">
        <Window
          title="Itinerary"
          state={windows.itinerary}
          onClose={() => closeWindow("itinerary")}
          onMinimize={() => minimizeWindow("itinerary")}
          style={{ width: itineraryWidth + "px" }}
        >
          <DndItinerary
            tripId="demo"
            userId="guest"
            itinerary={trip.itinerary}
            setItinerary={updateItinerary}
            eventLimit={5}
            dndTrash={{ variant: "inset", className: "border-none h-32 bg-white" }}
            calendar="left-0 mb-0"
          />
        </Window>

        <div className="flex-shrink-0">
          <Window
            title="Calendar"
            state={windows.calendar}
            onClose={() => closeWindow("calendar")}
            onMinimize={() => minimizeWindow("calendar")}
            className="py-0"
          >
            <DatePicker
              startDate={trip.startDate}
              endDate={trip.endDate}
              maxDays={3}
              onApply={handleDateSelection}
              inline
            />
          </Window>
        </div>

        <PortalWindow
          id="trash-container"
          title="Trash"
          className="absolute right-4 top-12 z-50"
          classNames={{ body: "h-32 relative" }}
        />

        <div className="flex flex-col gap-4">
          <Window
            title="History"
            state={windows.history}
            onClose={() => closeWindow("history")}
            onMinimize={() => minimizeWindow("history")}
          >
            <ul ref={listRef} className="flex max-h-48 flex-col overflow-scroll">
              {changes.map((change, index) => (
                <li
                  key={index}
                  onClick={() => jumpTo(index)}
                  className={cn(
                    "w-full cursor-pointer rounded px-2 py-1 text-[13px] font-medium even:bg-gray-50 hover:underline",
                    position === index && "bg-kolumblue-500 text-white even:bg-blue-500",
                  )}
                >
                  {change}
                </li>
              ))}
            </ul>
          </Window>

          <Window
            title="Dev Tools"
            state={windows.devTools}
            onClose={() => closeWindow("devTools")}
            onMinimize={() => minimizeWindow("devTools")}
          >
            <Button
              onClick={() => setTrip(randomTrip({ startDate: trip.startDate }), "Random trip")}
            >
              Random Trip
            </Button>

            <Button>Complete tasks</Button>
          </Window>

          <Window
            title="Tasks"
            state={windows.devTools}
            onClose={() => closeWindow("devTools")}
            onMinimize={() => minimizeWindow("devTools")}
          >
            tips
          </Window>
        </div>
      </div>

      <Dock windows={windows} openWindow={openWindow} />
    </div>
  );
}

function randomTrip(props?: { startDate: string; restrictToTripleDays?: boolean }) {
  const availableItineraries = props?.restrictToTripleDays
    ? itineraries.filter((itinerary) => itinerary.length === 3)
    : itineraries;

  // Randomly select an itinerary
  const randomIndex = Math.floor(Math.random() * availableItineraries.length);
  const itinerary = availableItineraries[randomIndex] as unknown as ItinerarySchema;

  // Randomly select start date for the trip if not provided
  const randomStartDateIndex = Math.floor(Math.random() * 13) + 1;
  const startDate = props?.startDate ?? formatDate(add(new Date(), { days: randomStartDateIndex }));
  const endDate = formatDate(add(new Date(startDate), { days: itinerary.length - 1 }));

  //#region Randomise the events for each day
  const targetEvents = props?.restrictToTripleDays ? itinerary.length : itinerary.length + 1;
  const multiEventDays = itinerary.filter((day) => day.events.length > 1);
  const requiredDoubleEventDays = targetEvents - itinerary.length;

  // Randomly select days for double events (uses day id to ensure uniqueness)
  const chosenDays = new Set();
  while (chosenDays.size < requiredDoubleEventDays && chosenDays.size < multiEventDays.length) {
    const randomDayIndex = Math.floor(Math.random() * multiEventDays.length);
    chosenDays.add(multiEventDays[randomDayIndex]!.id);
  }

  // Randomly select events for each day in the itinerary
  const randomItinerary = itinerary.map((day, index) => {
    day = {
      id: `d${index}`,
      date: formatDate(add(new Date(startDate), { days: index })),
      events: day.events,
    };
    const eventsToPick = chosenDays.has(day.id) ? 2 : 1;
    const events: EventSchema[] = [];

    // Randomly select unique events for the day
    while (events.length < eventsToPick) {
      const randomEventIndex = Math.floor(Math.random() * day.events.length);
      const event = { ...day.events[randomEventIndex]!, date: day.date, position: events.length };

      if (!events.some((e) => e.id === event.id)) events.push(event);
    }

    return { ...day, events: Array.from(events) };
  });
  //#endregion

  return { startDate, endDate, itinerary: randomItinerary };
}
