import { useEffect } from "react";
import { add, getDayOfYear, getMonth, getWeekOfMonth, getYear } from "date-fns";

import useHistoryState from "./use-history-state";
import { formatDate } from "~/lib/utils";
import type { EventSchema, ItinerarySchema } from "~/lib/types";

import itineraries from "~/assets/itineraries.json";

type Algorithm = "random" | "by-day";
type Trip = { startDate: string; endDate: string; itinerary: ItinerarySchema };

export default function useRandomTrip(algorithm: Algorithm, customItineraries?: ItinerarySchema) {
  const [trip, setTrip, { changes, position, jumpTo, replaceHistory }] = useHistoryState<Trip>(
    algorithm === "random"
      ? {
          startDate: formatDate(new Date()),
          endDate: formatDate(new Date()),
          itinerary: [
            { id: "d0", date: "2004-03-08", events: [] },
            { id: "d1", date: "2004-03-09", events: [] },
            { id: "d2", date: "2004-03-10", events: [] },
          ],
        }
      : generateTrip({ algorithm: "by-day", customItineraries }),
  );

  const updateItinerary = (itineraryOrIndex: ItinerarySchema | number, desc?: string) => {
    setTrip(
      typeof itineraryOrIndex === "number"
        ? itineraryOrIndex
        : { ...trip, itinerary: itineraryOrIndex },
      desc,
    );
  };
  const randomise = () => {
    setTrip(
      generateTrip({ algorithm: "random", customItineraries, startDate: trip.startDate }),
      "Random trip",
    );
  };

  // Generate a random trip on mount when the algorithm is set to "random"
  useEffect(() => {
    if (algorithm === "random") {
      const trip = generateTrip({ algorithm: "random", customItineraries });

      setTrip(trip);
      replaceHistory([{ value: trip, desc: "Open" }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { trip, setTrip, updateItinerary, changes, position, jumpTo, randomise };
}

function generateTrip(props: {
  algorithm: Algorithm;
  customItineraries?: ItinerarySchema;
  startDate?: string;
}): Trip {
  const maxAttempts = 6; // Maximum number of attempts in the by-day algorithm
  const chosenItineraries = props.customItineraries ?? (itineraries as unknown as ItinerarySchema);

  const itineraryIndex = getRandomValue(props.algorithm, chosenItineraries.length);
  const itinerary = chosenItineraries[itineraryIndex] as unknown as ItinerarySchema;

  // If startDate is not provided, generate a random start date between 1 and 20 days from now
  const startDateIndex = getRandomValue(props.algorithm, 20) + 1;
  const startDate = props.startDate ?? formatDate(add(new Date(), { days: startDateIndex }));
  const endDate = formatDate(add(new Date(startDate), { days: itinerary.length - 1 }));

  const eventCountTarget = itinerary.length + 1;
  const multiEventDays = itinerary.filter((day) => day.events.length > 1);
  const requiredDaysCount = eventCountTarget - itinerary.length; // count of days that need two events
  const pickedDays: string[] = [];

  let attempt = 0;
  // Pick days that will have two events, ensuring each picked day is unique
  while (
    pickedDays.length < requiredDaysCount &&
    pickedDays.length < multiEventDays.length &&
    attempt < maxAttempts
  ) {
    const dayIndex = getRandomValue(props.algorithm, multiEventDays.length, attempt);
    const dayId = multiEventDays[dayIndex]!.id;
    if (!pickedDays.includes(dayId)) pickedDays.push(dayId);
    if (props.algorithm === "by-day") attempt++;
  }

  // Construct the itinerary with randomized events for each day
  const generatedItinerary = itinerary.map((day, index) => {
    day = {
      ...day,
      id: `d${index}`,
      date: formatDate(add(new Date(startDate), { days: index })),
    };
    const eventsToPick = pickedDays.includes(day.id) ? 2 : 1;
    const events: EventSchema[] = [];

    let attempt = 0;
    // Randomly select unique events for the day until the required number of events is reached
    while (events.length < eventsToPick && attempt < maxAttempts) {
      const randomEventIndex = getRandomValue(props.algorithm, day.events.length, attempt);
      const event = { ...day.events[randomEventIndex]!, date: day.date, position: events.length };
      if (!events.some((e) => e.id === event.id)) events.push(event);
      if (props.algorithm === "by-day") attempt++;
    }

    return { ...day, events };
  });

  return { startDate, endDate, itinerary: generatedItinerary };
}

function getRandomValue(algorithm: Algorithm, maxValue: number, attempt?: number) {
  if (algorithm === "random") {
    return Math.floor(Math.random() * maxValue);
  } else {
    const date = new Date();
    let seed;
    switch (attempt) {
      case 1:
        seed = getWeekOfMonth(date);
        break;
      case 2:
        seed = getDayOfYear(date);
        break;
      case 3:
        seed = Math.ceil(getDayOfYear(date) / 7); // Week of the year
        break;
      case 4:
        seed = getMonth(date) + 1;
        break;
      case 5:
        seed = Math.floor((getMonth(date) + 1) / 3); // Quarter of the year
        break;
      case 6:
        seed = getYear(date);
        break;
      default:
        seed = date.getDate();
        break;
    }
    return seed % maxValue;
  }
}
