"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { add } from "date-fns";
import useHistoryState from "~/hooks/use-history-state";

import { cn, differenceInDays, formatDate } from "~/lib/utils";
import type { EventSchema, ItinerarySchema } from "~/lib/types";

// import Dock from "./dock";
import Window from "./window";
import PortalWindow from "./portal-window";
import { DatePicker } from "../date-picker";
import { DndItinerary } from "../dnd-itinerary";
import { Button } from "../ui";

import itineraries from "~/config/itineraries.json";

export default function Desktop() {
  type Trip = { startDate: string; endDate: string; itinerary: ItinerarySchema };
  const [trip, setTrip, { changes, position, jumpTo, replaceHistory }] = useHistoryState<Trip>({
    startDate: formatDate(new Date()),
    endDate: formatDate(new Date()),
    itinerary: [
      { id: "d0", date: "2004-03-08", events: [] },
      { id: "d1", date: "2004-03-09", events: [] },
      { id: "d2", date: "2004-03-10", events: [] },
    ],
  });

  const [itineraryWidth, setItineraryWidth] = useState(0);
  const [windows, setWindows] = useState({
    itinerary: true,
    calendar: true,
    history: false,
    tasks: true,
    devTools: true,
  });

  const [tasks, setTasks] = useState({
    moveEvent: false,
    moveMultipleEvents: false,
    moveDay: false,
    deleteEvent: false,
    changeDate: false,
  });

  const updateItinerary = (itineraryOrIndex: ItinerarySchema | number, desc?: string) => {
    setTrip(
      typeof itineraryOrIndex === "number"
        ? itineraryOrIndex
        : { ...trip, itinerary: itineraryOrIndex },
      desc,
    );
  };

  const openWindow = (windowName: keyof typeof windows) => {
    setWindows({ ...windows, [windowName]: true });
  };

  const closeWindow = (windowName: keyof typeof windows) => {
    setWindows({ ...windows, [windowName]: false });
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

    setTrip(
      {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        itinerary,
      },
      "Change date",
    );
  };

  const autoOpenHistory = useRef(true);
  // Update tasks based on changes and auto open history window
  useEffect(() => {
    // Auto open history window when there are more than one changes
    if (autoOpenHistory.current && changes.length > 1) {
      autoOpenHistory.current = false;
      openWindow("history");
    }

    // Update tasks based on changes
    setTasks({
      moveEvent: changes.includes("Move event"),
      moveMultipleEvents: changes.some((change) => /Move \d+ events/.test(change)),
      moveDay: changes.includes("Move day"),
      deleteEvent: changes.includes("Delete event"),
      changeDate: changes.includes("Change date"),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changes.length]);

  // Calculate the width of the itinerary window based on the number of events
  useLayoutEffect(() => {
    // const totalPadding = 20;
    // const dayCalendarWidth = 128;
    // const calendarGap = 20;
    // const composerGap = 16;
    // const composerWidth = 32 || 312;
    // 20 + 128 + 20 + 16 + 32 = 216
    const preComputedStaticWidth = 216;

    const activityWidth = 160;
    const eventGap = 8;

    const highestEventCount = Math.max(...trip.itinerary.map((day) => day.events.length));

    setItineraryWidth(
      preComputedStaticWidth + activityWidth * highestEventCount + eventGap * highestEventCount,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip]);

  const listRef = useRef<HTMLUListElement>(null);
  // Scroll to the bottom of the history list when there are new changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [changes.length]);

  // Randomise the itinerary on mount
  useEffect(() => {
    const trip = randomTrip();

    setTrip(trip);
    replaceHistory([{ value: trip, desc: "Open" }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full flex-1 flex-col justify-between gap-4 p-3">
      <div className="flex justify-center gap-4">
        <Window
          title="Itinerary"
          isOpen={windows.itinerary}
          onClose={() => closeWindow("itinerary")}
          style={{ width: itineraryWidth + "px" }}
        >
          <DndItinerary
            tripId="discover"
            userId="guest"
            itinerary={trip.itinerary}
            setItinerary={updateItinerary}
            eventLimit={5}
            dndTrash={{ variant: "inset", className: "h-32" }}
            calendar="left-0 mb-0"
          />
        </Window>

        <div className="flex-shrink-0">
          <Window
            title="Calendar"
            isOpen={windows.calendar}
            onClose={() => closeWindow("calendar")}
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
          className="absolute right-4 top-24 z-50"
          classNames={{ body: "h-32 relative" }}
        />

        <div className="flex flex-col gap-4">
          <Window title="History" isOpen={windows.history} onClose={() => closeWindow("history")}>
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

          <Window title="Tasks" isOpen={windows.tasks} onClose={() => closeWindow("tasks")}>
            <ul className="list-inside list-disc text-[13px]">
              <li className={cn(tasks.moveEvent && "line-through")}>Move at least 1 Event</li>
              <li className={cn(tasks.moveMultipleEvents && "line-through")}>
                Move multiple Events at the same time
              </li>
              <li className={cn(tasks.moveDay && "line-through")}>Move whole Day</li>
              <li className={cn(tasks.deleteEvent && "line-through")}>Put any event in trash</li>
              <li className={cn(tasks.changeDate && "line-through")}>Pick new Date</li>
            </ul>
          </Window>

          <Window
            title="Dev Tools"
            isOpen={windows.devTools}
            onClose={() => closeWindow("devTools")}
            className="flex h-16 justify-center gap-4"
          >
            <Button
              onClick={() => setTrip(randomTrip({ startDate: trip.startDate }), "Random trip")}
              variant="button"
              className="border-kolumblue-600 bg-kolumblue-500 font-medium text-white"
            >
              Random Trip
            </Button>

            <Button
              onClick={() => {
                setTasks({
                  moveEvent: true,
                  moveMultipleEvents: true,
                  moveDay: true,
                  deleteEvent: true,
                  changeDate: true,
                });
              }}
              variant="button"
              className="border-kolumblue-600 bg-kolumblue-500 font-medium text-white"
            >
              Complete tasks
            </Button>
          </Window>
        </div>
      </div>

      {/* <Dock windows={windows} openWindow={openWindow} /> */}
    </div>
  );
}

function randomTrip(props?: { itineraries?: ItinerarySchema; startDate: string }) {
  const chosenItineraries = props?.itineraries ?? (itineraries as unknown as ItinerarySchema);

  // Randomly select an itinerary
  const randomIndex = Math.floor(Math.random() * chosenItineraries.length);
  const itinerary = chosenItineraries[randomIndex] as unknown as ItinerarySchema;

  // Randomly select start date for the trip if not provided
  const randomStartDateIndex = Math.floor(Math.random() * 13) + 1;
  const startDate = props?.startDate ?? formatDate(add(new Date(), { days: randomStartDateIndex }));
  const endDate = formatDate(add(new Date(startDate), { days: itinerary.length - 1 }));

  //#region Randomise the events for each day
  const targetEvents = itinerary.length + 1;
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
