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
  link?: string;
  type?: string;
  google_place?: GooglePlace;
  drag_type: "event";
}

export interface GooglePlace {
  place_id: string;
}
