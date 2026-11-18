"use client";

import { useCallback, useEffect, useState } from "react";
import { add } from "date-fns";
import superjson from "superjson";
import { z } from "zod";

import itineraries from "~/assets/itineraries.json";
import { constructPlace } from "~/lib/constructors";
import { createId, formatDate } from "~/lib/utils";
import { itinerarySchema } from "~/lib/validations/trip";

const tripSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  itinerary: itinerarySchema,
  updatedAt: z.date(),
});

const librarySchema = z.object({
  version: z.literal(1),
  trips: tripSchema.array(),
  completed: z.string().array().default([]),
});

export type DemoTrip = z.infer<typeof tripSchema>;
const storageKey = "kolumbus-showcase-library";
const cities = ["Kraków", "Warsaw", "Gdańsk", "Wrocław", "Poznań"];

export function createDemoTrip(template?: number): DemoTrip {
  const id = createId(10);
  const startDate = formatDate(add(new Date(), { days: 7 }));
  const source = template === undefined ? null : itineraries[template % itineraries.length];

  return {
    id,
    name: source ? `A few days in ${cities[template! % cities.length]}` : "My next adventure",
    startDate,
    endDate: formatDate(add(new Date(startDate), { days: 2 })),
    updatedAt: new Date(),
    itinerary: Array.from({ length: 3 }, (_, dayIndex) => ({
      id: createId(),
      date: formatDate(add(new Date(startDate), { days: dayIndex })),
      places: (source?.[dayIndex]?.places ?? [])
        .slice(0, 2)
        .map((place, sortIndex) =>
          constructPlace({ ...place, userId: "guest", tripId: id, dayIndex, sortIndex }),
        ),
    })),
  };
}

export default function useDemoLibrary() {
  const [trips, setTrips] = useState<DemoTrip[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [initialTripId, setInitialTripId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const library = saved ? librarySchema.parse(superjson.parse(saved)) : null;
      if (library?.trips.length) {
        setTrips(library.trips);
      } else {
        const trip = createDemoTrip(0);
        setTrips([trip]);
        setInitialTripId(trip.id);
      }
      setCompleted(library?.completed ?? []);
    } catch {
      const trip = createDemoTrip(0);
      setTrips([trip]);
      setInitialTripId(trip.id);
      setStorageAvailable(false);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !storageAvailable) return;
    try {
      localStorage.setItem(storageKey, superjson.stringify({ version: 1, trips, completed }));
    } catch {
      setStorageAvailable(false);
    }
  }, [trips, completed, loaded, storageAvailable]);

  const complete = useCallback((task: string) => {
    setCompleted((current) => (current.includes(task) ? current : [...current, task]));
  }, []);

  const save = useCallback((trip: DemoTrip) => {
    setTrips((current) =>
      current.map((saved) => (saved.id === trip.id ? { ...trip, updatedAt: new Date() } : saved)),
    );
  }, []);

  const create = useCallback(
    (template?: number) => {
      const trip = createDemoTrip(template);
      setTrips((current) => [...current, trip]);
      complete("create");
      return trip.id;
    },
    [complete],
  );

  const duplicate = (trip: DemoTrip) => {
    const id = createId(10);
    const copy = structuredClone(trip);
    copy.id = id;
    copy.name = `${trip.name} (copy)`;
    copy.updatedAt = new Date();
    copy.itinerary.forEach((day) => {
      day.id = createId();
      day.places.forEach((place) => {
        place.id = createId();
        place.tripId = id;
      });
    });
    setTrips((current) => [...current, copy]);
    complete("create");
  };

  const remove = (id: string) => setTrips((current) => current.filter((trip) => trip.id !== id));

  return {
    trips,
    completed,
    loaded,
    storageAvailable,
    initialTripId,
    save,
    create,
    duplicate,
    remove,
    complete,
  };
}
