import type { Event, UpdateEvent } from "~/lib/validations/event";

export { DndItinerary } from "./dnd-itinerary";

export type onEventCreated = (event: Event) => void;
export type onEventUpdated = (
  eventId: string,
  tripId: string,
  eventData: UpdateEvent["data"],
) => void;
export type onEventDeleted = (eventIds: string | string[], tripId: string) => void;
