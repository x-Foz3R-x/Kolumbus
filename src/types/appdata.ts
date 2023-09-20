import type { Trip as PrismaTrip, Event as PrismaEvent } from "@prisma/client";
import type { Geometry, PlaceOpeningHours } from "./google";

export type TripDB = PrismaTrip;
export type Trip = {
  id: string;
  userId: string;

  name: string;
  startDate: Date | string;
  endDate: Date | string;
  days: number;
  position: number;
  itinerary: {
    id: string;
    date: string;
    events: {
      id: string;
      tripId: string;
      position: number;

      name: string;
      date: Date | string;
      address?: string | null;
      cost?: number | null;
      phoneNumber?: string | null;
      website?: string | null;
      note?: string | null;

      type?: string | null;
      google?: {
        place_id: string;
        photo_reference?: string;
        url?: string;
        types?: string[];
        geometry?: Geometry;
        current_opening_hours?: PlaceOpeningHours;

        price_level?: number;
        rating?: number;
        utc_offset?: number;
        vicinity?: string;

        curbside_pickup?: boolean;
        delivery?: boolean;
        dine_in?: boolean;
        reservable?: boolean;
        serves_beer?: boolean;
        serves_breakfast?: boolean;
        serves_brunch?: boolean;
        serves_dinner?: boolean;
        serves_lunch?: boolean;
        serves_vegetarian_food?: boolean;
        serves_wine?: boolean;
        takeout?: boolean;
        wheelchair_accessible_entrance?: boolean;
      } | null;
      googlePlaceId?: string | null;

      createdBy: string;
      createdAt: Date | string;
      updatedAt: Date | string;
    }[];
    dragType: "day";
  }[];

  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Itinerary = Day[];
export type Day = {
  id: string;
  date: string;
  events: Event[];
  dragType: "day";
};

export type EventDB = PrismaEvent;
export type Event = {
  id: string;
  tripId: string;
  position: number;

  name: string;
  date: Date | string;
  address?: string | null;
  cost?: number | null;
  phoneNumber?: string | null;
  website?: string | null;
  note?: string | null;

  type?: string | null;
  google?: Google | null;
  googlePlaceId?: string | null;

  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Google = {
  place_id: string;
  photo_reference?: string;
  url?: string;
  types?: string[];
  geometry?: Geometry;
  current_opening_hours?: PlaceOpeningHours;

  price_level?: number;
  rating?: number;
  utc_offset?: number;
  vicinity?: string;

  curbside_pickup?: boolean;
  delivery?: boolean;
  dine_in?: boolean;
  reservable?: boolean;
  serves_beer?: boolean;
  serves_breakfast?: boolean;
  serves_brunch?: boolean;
  serves_dinner?: boolean;
  serves_lunch?: boolean;
  serves_vegetarian_food?: boolean;
  serves_wine?: boolean;
  takeout?: boolean;
  wheelchair_accessible_entrance?: boolean;
};

export enum UT {
  REPLACE = "replace_trips_state",
  ADD = "add_trip_to_state",
}

export type DispatchAction =
  | {
      type: UT.REPLACE;
      userTrips: Trip[];
    }
  | {
      type: UT.ADD;
      trip: Trip;
    };
