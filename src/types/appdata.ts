import { z } from "zod";
import { Trip as PrismaTrip, Event as PrismaEvent, EventType } from "@prisma/client";
import {
  AddressComponent,
  Geometry,
  PlaceEditorialSummary,
  PlaceOpeningHours,
  PlacePhoto,
  PlaceReview,
} from "./google";

export type Place = z.infer<typeof PlaceSchema>;
export const PlaceSchema = z.object({
  placeId: z.string(),
  types: z.array(z.object({ name: z.string() })),

  name: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  addressComponents: z.array(AddressComponent).nullable().optional(),
  photoReference: z.string().nullable().optional(),
  photos: z.array(PlacePhoto).nullable().optional(),
  url: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  internationalPhoneNumber: z.string().nullable().optional(),
  rating: z.number().nullable().optional(),
  userRatingsTotal: z.number().nullable().optional(),
  priceLevel: z.number().nullable().optional(),

  businessStatus: z.string().nullable().optional(),
  currentOpeningHours: PlaceOpeningHours.nullable().optional(),
  openingHours: PlaceOpeningHours.nullable().optional(),
  secondaryOpeningHours: PlaceOpeningHours.nullable().optional(),
  editorialSummary: PlaceEditorialSummary.nullable().optional(),
  reviews: z.array(PlaceReview).nullable().optional(),

  vicinity: z.string().nullable().optional(),
  geometry: Geometry.nullable().optional(),
  utcOffset: z.number().nullable().optional(),

  curbsidePickup: z.boolean().nullable().optional(),
  delivery: z.boolean().nullable().optional(),
  dineIn: z.boolean().nullable().optional(),
  reservable: z.boolean().nullable().optional(),
  servesBeer: z.boolean().nullable().optional(),
  servesBreakfast: z.boolean().nullable().optional(),
  servesBrunch: z.boolean().nullable().optional(),
  servesDinner: z.boolean().nullable().optional(),
  servesLunch: z.boolean().nullable().optional(),
  servesVegetarianFood: z.boolean().nullable().optional(),
  servesWine: z.boolean().nullable().optional(),
  takeout: z.boolean().nullable().optional(),
  wheelchairAccessibleEntrance: z.boolean().nullable().optional(),
});

export type Event = z.infer<typeof EventSchema>;
const EventSchema = z.object({
  id: z.string(),
  tripId: z.string(),

  name: z.string(),
  date: z.string().datetime(),
  position: z.number(),
  address: z.string().nullable(),
  cost: z.number().nullable(),
  phoneNumber: z.string().nullable(),
  website: z.string().nullable(),
  note: z.string().nullable(),
  photo: z.string().nullable(),

  type: z.nativeEnum(EventType).nullable(),
  place: PlaceSchema.nullable().optional(),
  placeId: z.string().nullable(),

  createdBy: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
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
  id: z.string().cuid2("Not a cuid2"),
  userId: z.string(),

  name: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  days: z.number(),
  position: z.number(),
  itinerary: ItinerarySchema,

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
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
