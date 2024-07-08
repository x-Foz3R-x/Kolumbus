import { useEffect } from "react";
import { add } from "date-fns";

import useHistoryState from "./use-history-state";
import { formatDate } from "~/lib/utils";
import type { EventSchema, ItinerarySchema } from "~/lib/types";

import itineraries from "~/assets/itineraries.json";

export default function useRandomTrip(customItineraries?: ItinerarySchema) {
  const chosenItineraries = customItineraries ?? (itineraries as unknown as ItinerarySchema);

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

  const randomise = () => setTrip(generateTrip({ startDate: trip.startDate }), "Random trip");
  const generateTrip = (props?: { startDate: string }) => {
    // Randomly select an itinerary
    const randomIndex = Math.floor(Math.random() * chosenItineraries.length);
    const itinerary = chosenItineraries[randomIndex] as unknown as ItinerarySchema;

    // Randomly select start date for the trip if not provided
    const randomStartDateIndex = Math.floor(Math.random() * 13) + 1;
    const startDate =
      props?.startDate ?? formatDate(add(new Date(), { days: randomStartDateIndex }));
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
  };
  const updateItinerary = (itineraryOrIndex: ItinerarySchema | number, desc?: string) => {
    setTrip(
      typeof itineraryOrIndex === "number"
        ? itineraryOrIndex
        : { ...trip, itinerary: itineraryOrIndex },
      desc,
    );
  };

  // Randomise the itinerary on mount
  useEffect(() => {
    const trip = generateTrip();

    setTrip(trip);
    replaceHistory([{ value: trip, desc: "Open" }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { trip, setTrip, updateItinerary, changes, position, jumpTo, randomise };
}
