"use client";

import { useEffect, useState } from "react";
import useHistoryState from "~/hooks/use-history-state";

import type { EventSchema, ItinerarySchema } from "~/lib/types";

import Dock from "./dock";
import Window from "./window";
import { DndItinerary } from "../dnd-itinerary";
import itineraries from "./itineraries.json";
import { Button } from "../ui";

export default function Desktop() {
  const [itinerary, setItinerary, { changes }] = useHistoryState<ItinerarySchema>([], {
    limit: 15,
  });
  const [windows, setWindows] = useState({
    itinerary: { isOpen: true, isMinimized: false },
    calendar: { isOpen: true, isMinimized: false },
    history: { isOpen: true, isMinimized: false },
    devTools: { isOpen: false, isMinimized: false },
  });

  // Randomise the itinerary on mount
  useEffect(() => {
    setItinerary(randomItinerary());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetWindow = (windowName: keyof typeof windows) => {
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

  return (
    <div className="flex w-full flex-1 flex-col justify-between p-3">
      <div className="flex justify-between pb-3">
        <Window
          title="Itinerary"
          state={windows.itinerary}
          onClose={() => closeWindow("itinerary")}
          onMinimize={() => minimizeWindow("itinerary")}
        >
          <DndItinerary
            tripId="demo"
            userId="guest"
            itinerary={itinerary}
            setItinerary={setItinerary}
            eventLimit={5}
            calendar="left-0 mb-0"
          />
        </Window>

        <Window
          title="Calendar"
          state={windows.calendar}
          onClose={() => closeWindow("calendar")}
          onMinimize={() => minimizeWindow("calendar")}
        >
          Calendar
        </Window>

        <div>
          <Window
            title="History"
            state={windows.history}
            onClose={() => closeWindow("history")}
            onMinimize={() => minimizeWindow("history")}
          >
            {changes.map((change, index) => (
              <div key={index} className="flex items-center gap-2">
                <div>{index + 1}.</div>
                <div>{change}</div>
              </div>
            ))}
          </Window>

          <Window
            title="Dev Tools"
            state={windows.devTools}
            onClose={() => closeWindow("devTools")}
            onMinimize={() => minimizeWindow("devTools")}
          >
            <Button onClick={() => setItinerary(randomItinerary())}>Random Trip</Button>
          </Window>
        </div>
      </div>

      <Dock windows={windows} resetWindow={resetWindow} />
    </div>
  );
}

function randomItinerary(restrictToTripleDays = false) {
  let itinerary: ItinerarySchema;

  do {
    const randomIndex = Math.floor(Math.random() * itineraries.length);
    itinerary = itineraries[randomIndex] as unknown as ItinerarySchema;
  } while (restrictToTripleDays && itinerary.length !== 3);

  const targetEvents = restrictToTripleDays ? itinerary.length : itinerary.length + 1;
  const multiEventDays = itinerary.filter((day) => day.events.length > 1);
  const requiredDoubleEventDays = targetEvents - itinerary.length;

  // Randomly select days for double events
  const chosenDays = new Set();
  while (chosenDays.size < requiredDoubleEventDays && chosenDays.size < multiEventDays.length) {
    const randomDayIndex = Math.floor(Math.random() * multiEventDays.length);
    chosenDays.add(multiEventDays[randomDayIndex]!.id);
  }

  // Randomly select events for each day in the itinerary
  return itinerary.map((day) => {
    const eventsToPick = chosenDays.has(day.id) ? 2 : 1;
    const events = new Set<EventSchema>();

    // Randomly select unique events for the day
    while (events.size < eventsToPick) {
      const randomEventIndex = Math.floor(Math.random() * day.events.length);
      events.add(day.events[randomEventIndex]!);
    }

    return { ...day, events: Array.from(events) };
  });
}
