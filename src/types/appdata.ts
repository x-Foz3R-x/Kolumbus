import { z } from "zod";
import { Trip as PrismaTrip, Event as PrismaEvent, EventType, Currency } from "@prisma/client";
import { PlaceOpeningHours } from "./google";

export type Event = z.infer<typeof EventSchema>;
export const EventSchema = z.object({
  id: z.string().cuid2("Invalid event id"),
  tripId: z.string().cuid2("Invalid trip id"),
  placeId: z.string().nullable(),

  name: z.string(),
  cost: z.number(),
  currency: z.nativeEnum(Currency),
  note: z.string().nullable(),
  photo: z.string().nullable(),
  photoAlbum: z.array(z.string()),

  address: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  url: z.string().nullable(),
  website: z.string().nullable(),
  openingHours: PlaceOpeningHours.or(z.object({})),

  type: z.nativeEnum(EventType),
  position: z.number(),
  date: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
});

export type Day = z.infer<typeof DaySchema>;
const DaySchema = z.object({
  id: z.string(),
  date: z.string().datetime(),
  events: z.array(EventSchema),
});

export type Itinerary = z.infer<typeof ItinerarySchema>;
export const ItinerarySchema = z.array(DaySchema);

export type Trip = z.infer<typeof TripSchema>;
const TripSchema = z.object({
  id: z.string().cuid2("Invalid trip id"),
  userId: z.string(),
  name: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  days: z.number(),
  position: z.number(),
  itinerary: ItinerarySchema,
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export type TripDB = PrismaTrip;
export type EventDB = PrismaEvent;

export enum UT {
  REPLACE = "replace_trips_state",
  ADD = "add_trip_to_state",
  ADD_EVENT = "add_event_to_state",
}

export type DispatchAction =
  | {
      type: UT.REPLACE;
      userTrips: Trip[];
    }
  | {
      type: UT.ADD;
      trip: Trip;
    }
  | {
      type: UT.ADD_EVENT;
      selectedTrip: number;
      dayIndex: number;
      placeAt: "start" | "end";
      event: Event;
    };
