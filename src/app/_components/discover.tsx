"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { add } from "date-fns";

import useRandomTrip from "~/hooks/use-random-trip";
import { cn, differenceInDays, formatDate } from "~/lib/utils";

import Window from "~/components/window";
import PortalWindow from "~/components/portal-window";
import { DatePicker } from "~/components/date-picker";
import { DndItinerary } from "~/components/dnd-itinerary";
import { Button } from "~/components/ui";
import Dock from "./dock";

export default function Discover() {
  const { trip, setTrip, updateItinerary, changes, position, jumpTo, randomise } =
    useRandomTrip("random");

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

  return (
    <div className="relative font-inter">
      <div className="h-fit w-full rounded-bl-[3rem] bg-gray-800 px-4 pb-16 pt-16">
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
            className="right-4 top-24"
            classNames={{ body: "h-32 relative" }}
          />

          <div className="flex flex-col gap-4">
            <Window
              title="Dev Tools"
              isOpen={windows.devTools}
              onClose={() => closeWindow("devTools")}
              className="flex h-16 justify-center gap-4"
            >
              <Button
                onClick={randomise}
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
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <span className="relative -z-10 size-12 bg-gray-800 before:absolute before:inset-0 before:rounded-tr-full before:bg-white" />

        <div className="h-28 w-fit rounded-b-[3rem] bg-gray-800 px-4 pt-6">
          <Dock windows={windows} openWindow={openWindow} />
        </div>
      </div>
    </div>
  );
}
