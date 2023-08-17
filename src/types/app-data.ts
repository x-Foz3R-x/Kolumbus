import { Geometry, PlaceOpeningHours } from "./google";

export interface Trip {
  [key: string]: any;
  id: string;
  owner_id: string;
  participants_id?: string[];
  display_name: string;
  start_date: string;
  end_date: string;
  days: number;
  position: number;
  itinerary: Itinerary;
  metadata: { created_at: number; updated_at: number };
}

export type Itinerary = Day[];
export interface Day {
  [key: string]: any;
  id: string;
  date: string;
  drag_type: "day";
  events: Event[];
}

export interface Event {
  [key: string]: any;
  id: string;
  display_name: string;
  date: string;
  position: number;
  address?: string;
  cost?: number;
  phone_number?: string;
  website?: string;
  type?: string;
  google?: Google;
  drag_type: "event";
}

export interface Google {
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
}
