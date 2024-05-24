import type { EventSchema, UpdateEventSchema } from "~/lib/validations/event";

export { DndItinerary } from "./dnd-itinerary";

export type onEventCreated = (event: EventSchema) => void;
export type onEventUpdated = (
  eventId: string,
  tripId: string,
  eventData: UpdateEventSchema["data"],
) => void;
export type onEventDeleted = (eventIds: string | string[], tripId: string) => void;
