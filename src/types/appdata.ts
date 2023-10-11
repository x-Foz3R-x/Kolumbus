import { z } from "zod";
import { Trip as PrismaTrip, Event as PrismaEvent, Currency } from "@prisma/client";
import { PlaceOpeningHours } from "./google";

export type Event = z.infer<typeof EventSchema>;
export const EventSchema = z.object({
  id: z.string().cuid2("Invalid event id"),
  tripId: z.string().cuid2("Invalid trip id"),
  placeId: z.string().nullable(),

  name: z.string().nullable(),
  address: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  cost: z.number().nullable(),
  currency: z.nativeEnum(Currency),
  website: z.string().nullable(),
  url: z.string().nullable(),
  note: z.string().nullable(),
  openingHours: PlaceOpeningHours,
  photoAlbum: z.array(z.string()),
  photo: z.string().nullable(),

  date: z.string().datetime(),
  position: z.number(),
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
  position: z.number(),
  itinerary: ItinerarySchema,
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export type TripDB = PrismaTrip;
export type EventDB = PrismaEvent;

export enum UT {
  // TRIPS
  REPLACE = "replace_trips_state",

  // TRIP
  UPDATE_TRIP = "update_trip_in_state",

  // EVENT
  ADD_EVENT = "add_event_to_state",
  UPDATE_EVENT = "update_event_in_state",
  DELETE_EVENT = "delete_event_in_state",
}

export type DispatchAction =
  | {
      type: UT.REPLACE;
      userTrips: Trip[];
    }
  | {
      type: UT.UPDATE_TRIP;
      payload: { trip: Trip };
    }
  | {
      type: UT.ADD_EVENT;
      payload: { selectedTrip: number; dayIndex: number; placeAt: "start" | "end"; event: Event };
    }
  | {
      type: UT.UPDATE_EVENT;
      payload: { selectedTrip: number; dayIndex: number; event: Event };
    }
  | {
      type: UT.DELETE_EVENT;
      payload: { selectedTrip: number; dayIndex: number; event: Event };
    };
