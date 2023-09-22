import { Active, Over } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Day, Event, Itinerary } from "@/types";

/**
 * Function to get drag type from dnd event
 * @param event
 * @returns The drag type of event
 */
export function GetDragType(event: Active | Over): "day" | "event" {
  return typeof event?.data.current?.item?.events === "object" ? "day" : "event";
}

/**
 * Function to get Day from the Itinerary based on its ID
 * @param itinerary - The itinerary containing all the days and events.
 * @param id - The id of day to find.
 * @returns The day if found
 */
export function GetDay(itinerary: Itinerary, id: string): Day {
  const day = itinerary.find((day) => day.id === id);
  return day as Day;
}

/**
 * Function to get Event from Events based on its ID
 * @param events - The array of all events.
 * @param id - The id of event to find.
 * @returns The event if found
 */
export function GetEvent(events: Event[], id: string): Event {
  const event = events.find((event) => event.id === id);
  return event as Event;
}

/**
 * Function to get an item (day or event) from the itinerary based on its ID
 * @param itinerary - The itinerary containing all the days and events.
 * @param events - The array of all events.
 * @param id - The id of element to find.
 * @returns The day if found, the event if found, or undefined if neither found
 */
export function GetItem(itinerary: Itinerary, events: Event[], id: string) {
  // Find the day with the matching ID
  const day = itinerary?.find((day) => day.id === id);

  // Find the event with the matching ID
  const event = events?.find((event) => event.id === id);

  return day ? day : event ? event : undefined;
}

/**
 * Function to get the index of a day or event in the itinerary based on its ID and type.
 * @param itinerary - The itinerary containing all the days and events.
 * @param type - The drag type of element
 * @param id - The id of element to find index.
 * @returns The event index or undefined if not found.
 */
export function GetIndex(itinerary: Itinerary, events: Event[], type: "day" | "event", id: string): number {
  if (type === "day") {
    const dayIndex = itinerary.findIndex((day) => day.id === id);
    return dayIndex;
  }

  if (type === "event") {
    const event = events.find((event) => event.id === id);
    const eventIndex = typeof event?.position !== "undefined" ? event.position : -1;
    return eventIndex;
  }

  return -1;
}

/**
 * Moves an event from one day to another in an itinerary.
 * @param itinerary - The itinerary containing all the days and events.
 * @param events - The array of all events.
 * @param activeId - The ID of the event being moved.
 * @param activeIndex - The index of the event in the active day's event array.
 * @param activeDate - The date of the active day.
 * @param overIndex - The index of the day where the event is being moved to.
 * @param overDate - The date of the day where the event is being moved to.
 * @returns - The updated itinerary after moving the event.
 */
export function EventOverDay(
  itinerary: Itinerary,
  events: Event[],
  activeId: string,
  activeIndex: number,
  activeDate: string,
  overIndex: number,
  overDate: string
): Itinerary | undefined {
  if (activeDate === overDate) return;

  // Find the index of the active day in the itinerary
  const activeDayIndex = itinerary.findIndex((day) => day.date === activeDate);

  const newItinerary = [...itinerary];
  const activeEvent = GetEvent(events, activeId); // Get the event being dragged
  const pushIndex = newItinerary[overIndex].events.length; // Get the event push position in destination day

  // Insert the active event into the destination day's event array at the specified index
  newItinerary[overIndex].events.splice(pushIndex, 0, activeEvent);

  // Remove the active event from the active day's event array
  newItinerary[activeDayIndex].events.splice(activeIndex, 1);

  return newItinerary;
}

/**
 * Moves an event over another event within the itinerary.
 * @param itinerary - The itinerary containing all the days and events.
 * @param events - The array of all events.
 * @param activeId - The ID of the event being moved.
 * @param activeIndex - The index of the event in the active day's event array.
 * @param activeDate - The date of the active day.
 * @param overId - The ID of the event being moved over.
 * @param overIndex - The index of the event being moved over in its day's event array.
 * @param overDate - The date of the day where the event is being moved over.
 * @returns The updated itinerary after moving the event.
 */
export function EventOverEvent(
  itinerary: Itinerary,
  events: Event[],
  activeId: string,
  activeIndex: number,
  activeDate: Date | string,
  overId: string,
  overIndex: number,
  overDate: Date | string
): Itinerary | undefined {
  // Find the index of the active day and the day where the event is being moved over
  const activeDayIndex = itinerary.findIndex((day) => day.date === activeDate);
  const overDayIndex = itinerary.findIndex((day) => day.date === overDate);

  // Skip if the active day or the over day is not found, or the active and over IDs are the same
  if (activeDayIndex < 0 || overDayIndex < 0 || activeId === overId) return;

  // Get the active event being dragged
  const activeEvent = GetEvent(events, activeId);
  const newItinerary = [...itinerary];

  // Move within the same day
  if (activeDate === overDate) {
    // Move the active event within the same day by rearranging the event array
    const currentEvents = newItinerary[activeDayIndex].events;
    newItinerary[activeDayIndex].events = arrayMove(currentEvents, activeIndex, overIndex);
  }
  // Move to a different day
  else if (activeDate !== overDate) {
    // Insert the active event into the over day's event array at the specified index
    newItinerary[overDayIndex].events.splice(overIndex, 0, activeEvent);

    // Remove the active event from the active day's event array
    newItinerary[activeDayIndex].events.splice(activeIndex, 1);
  }

  return newItinerary;
}
