"use client";

import { useCallback, useEffect, useState } from "react";
import { add, nextSaturday } from "date-fns";
import superjson from "superjson";
import { z } from "zod";

import itineraries from "~/assets/itineraries.json";
import { constructPlace } from "~/lib/constructors";
import { createId, differenceInDays, formatDate } from "~/lib/utils";
import { itinerarySchema } from "~/lib/validations/trip";

const tripSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  imageUrl: z.string().default("/trip-covers/2.webp"),
  itinerary: itinerarySchema,
  updatedAt: z.date(),
});

const librarySchema = z.object({
  version: z.literal(1),
  trips: tripSchema.array(),
  completed: z.string().array().default([]),
});

export type DemoTrip = z.infer<typeof tripSchema>;
export type DemoTripDefinition = Pick<DemoTrip, "name" | "startDate" | "endDate">;
export const DEMO_LIMITS = { trips: 6, days: 14, places: 100 } as const;
const storageKey = "kolumbus-showcase-library";
const previewResetKey = `${storageKey}-gdansk-weekend-preview`;
const cities = ["Kraków", "Warsaw", "Gdańsk", "Wrocław", "Poznań"];
const exampleDays = [
  [
    [0, 0, "Długi Targ", "Start with a slow wander through the old town."],
    [0, 3, "Żuraw nad Motławą", "Follow the river. Leave room for a coffee stop."],
  ],
  [
    [1, 1, "Park Oliwski", "A quiet morning among the trees before heading to the coast."],
    [2, 0, "Plaża w Jelitkowie", "Finish by the sea. A walk, a deep breath, no rush."],
  ],
] as const;

export function createDemoTrip(template?: number, details?: DemoTripDefinition): DemoTrip {
  const id = createId(10);
  const startDate =
    details?.startDate ??
    formatDate(template === 0 ? nextSaturday(new Date()) : add(new Date(), { days: 7 }));
  const requestedEnd =
    details?.endDate ?? formatDate(add(new Date(startDate), { days: template === 0 ? 1 : 2 }));
  const dayCount = Math.min(
    DEMO_LIMITS.days,
    Math.max(1, differenceInDays(startDate, requestedEnd, true)),
  );
  const source =
    template === 0
      ? exampleDays.map((day) => ({
          places: day.map(([dayIndex, placeIndex, name, note]) => ({
            ...itineraries[2]?.[dayIndex]?.places[placeIndex],
            ...(name === "Park Oliwski" && {
              googleId: "ChIJcX9LNssK_UYRQ_j1ulW4AQc",
              address: "Opata Jacka Rybińskiego, 80-320 Gdańsk, Poland",
              website: "http://www.parkoliwski.gdansk.pl/",
              imageUrl: null,
            }),
            name,
            note,
            startTime: null,
            endTime: null,
          })),
        }))
      : template === undefined
        ? null
        : itineraries[template % itineraries.length];
  const providedName = details?.name.trim().slice(0, 100) ?? "";

  return {
    id,
    name:
      providedName.length > 0
        ? providedName
        : source
          ? template === 0
            ? "A weekend in Gdańsk"
            : `A few days in ${cities[template! % cities.length]}`
          : "My next adventure",
    startDate,
    endDate: formatDate(add(new Date(startDate), { days: dayCount - 1 })),
    imageUrl: `/trip-covers/${2 + ((template ?? 1) % 3)}.webp`,
    updatedAt: new Date(),
    itinerary: Array.from({ length: dayCount }, (_, dayIndex) => ({
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
      let saved = localStorage.getItem(storageKey);
      // Refresh this local preview once; retain the old library for recovery.
      if (process.env.NODE_ENV === "development" && !localStorage.getItem(previewResetKey)) {
        if (saved && !localStorage.getItem(`${storageKey}-backup`)) {
          localStorage.setItem(`${storageKey}-backup`, saved);
        }
        localStorage.removeItem(storageKey);
        localStorage.setItem(previewResetKey, "1");
        saved = null;
      }
      const library = saved ? librarySchema.parse(superjson.parse(saved)) : null;
      if (library?.trips.length) {
        setTrips(library.trips);
        setInitialTripId(library.trips[0]!.id);
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
    (template?: number, details?: DemoTripDefinition) => {
      if (trips.length >= DEMO_LIMITS.trips) return null;
      const trip = createDemoTrip(template, details);
      setTrips((current) => [...current, trip]);
      complete("create");
      return trip.id;
    },
    [complete, trips.length],
  );

  const duplicate = (trip: DemoTrip) => {
    if (trips.length >= DEMO_LIMITS.trips) return;
    const id = createId(10);
    const copy = structuredClone(trip);
    copy.id = id;
    copy.name = `${trip.name.slice(0, 93)} (copy)`;
    copy.updatedAt = new Date();
    copy.itinerary.forEach((day) => {
      day.id = createId();
      day.places.forEach((place) => {
        place.id = createId();
        place.tripId = id;
      });
    });
    setTrips((current) => [...current, copy]);
    complete("duplicate");
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
