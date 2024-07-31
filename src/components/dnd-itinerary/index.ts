import type { PlaceSchema, UpdatePlaceSchema } from "~/lib/validations/place";

export { DndItinerary } from "./dnd-itinerary";

export type onEventCreated = (event: PlaceSchema) => void;
export type onEventUpdated = (
  eventId: string,
  tripId: string,
  eventData: UpdatePlaceSchema["data"],
) => void;
export type onEventDeleted = (eventIds: string | string[], tripId: string) => void;
