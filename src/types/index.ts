export interface IconProps {
  key?: string | number;
  className?: string;
}

//#region app
export type Trips = Trip[];
export interface Trip {
  id?: string;
  owner_id: string | number;
  participants_id: string | number[];
  name: string;
  start_date: string;
  end_date: string;
  days: number;
  position: number;
  itinerary: Days;
  created_at: string;
  updated_at: string;
}

export type Days = Day[];
export interface Day {
  id: string;
  date: string;
  drag_type: string;
  events: Events;
}

export type Events = Event[];
export interface Event {
  id: string;
  name: string;
  date: string;
  position: number;
  address?: string;
  type?: string;
  cost?: number;
  link?: string;
  drag_type: string;
}
//#endregion
