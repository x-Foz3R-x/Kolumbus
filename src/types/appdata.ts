import { z } from "zod";
import { Trip as PrismaTrip, Event as PrismaEvent, Currency } from "@prisma/client";
import { PlaceOpeningHours } from "./google";

export type Event = z.infer<typeof eventSchema>;
export const eventSchema = z.object({
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

export type Day = z.infer<typeof daySchema>;
export const daySchema = z.object({
  id: z.string(),
  date: z.string().datetime(),
  events: z.array(eventSchema),
});

export type Itinerary = z.infer<typeof itinerarySchema>;
export const itinerarySchema = z.array(daySchema);

export type Trip = z.infer<typeof tripSchema>;
export const tripSchema = z.object({
  id: z.string().cuid2("Invalid trip id"),
  userId: z.string(),
  name: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  position: z.number(),
  itinerary: itinerarySchema,
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export type TripDB = PrismaTrip;
export type EventDB = PrismaEvent;

/**
 * Enum representing the different types of updates that can be made to the appdata.
 */
export enum UT {
  // TRIPS
  REPLACE = "replace_trips_state",

  // TRIP
  CREATE_TRIP = "create_trip_in_state",
  UPDATE_TRIP = "update_trip_in_state",
  DELETE_TRIP = "delete_trip_in_state",

  // EVENT
  CREATE_EVENT = "add_event_to_state",
  UPDATE_EVENT = "update_event_in_state",
  DELETE_EVENT = "delete_event_in_state",
}

/**
 * DispatchAction is a union type that represents all possible actions that can be dispatched to the state.
 * Each action has a `type` property that specifies the type of action being performed, as well as any additional
 * properties required for that action.
 */
export type DispatchAction =
  | {
      type: UT.REPLACE;
      trips: Trip[];
    }
  | {
      type: UT.CREATE_TRIP;
      trip: Trip;
    }
  | {
      type: UT.UPDATE_TRIP;
      trip: Trip;
    }
  | {
      type: UT.DELETE_TRIP;
      trip: Trip;
    }
  | {
      type: UT.CREATE_EVENT;
      payload: { tripIndex: number; dayIndex: number; event: Event; placeAt: "start" | "end" };
    }
  | {
      type: UT.UPDATE_EVENT;
      payload: { tripIndex: number; dayIndex: number; event: Event };
    }
  | {
      type: UT.DELETE_EVENT;
      payload: { tripIndex: number; dayIndex: number; event: Event };
    };
