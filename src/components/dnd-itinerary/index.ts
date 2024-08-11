import type { PlaceSchema, UpdatePlaceSchema } from "~/lib/validations/place";

export { DndItinerary } from "./dnd-itinerary";

export type onEventCreated = (event: PlaceSchema) => void;
export type onPlaceUpdated = (
  tripId: string,
  placeId: string,
  placeData: UpdatePlaceSchema["data"],
) => void;
export type onItemMoved = (
  itemId: string,
  tripId: string,
  dayIndex: number,
  prevDayIndex: number,
  sortIndex: number,
  prevSortIndex: number,
) => void;
export type onEventDeleted = (eventIds: string | string[], tripId: string) => void;
