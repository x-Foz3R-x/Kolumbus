export { DndItinerary } from "./dnd-itinerary";

export type onEventCreated = (event: Event, handleError: (error: unknown) => void) => void;
export type onEventUpdated = (
  eventId: string,
  tripId: string,
  eventData: UpdateEventData,
  handleError: (error: unknown) => void,
) => void;
export type onEventDeleted = (
  eventId: string,
  tripId: string,
  handleError: (error: unknown) => void,
) => void;
