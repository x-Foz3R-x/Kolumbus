import { arrayMove } from "@dnd-kit/sortable";
import type { Day, Event, Itinerary } from "@/types";

/**
 * Function to get Day from the Itinerary based on its ID
 * @param itinerary
 * @param id
 * @returns The day if found
 */
export function GetDay(itinerary: Itinerary, id: string): Day {
  const day = itinerary.find((day) => day.id === id);
  return day as Day;
}

/**
 * Function to get Event from Events based on its ID
 * @param events
 * @param id
 * @returns The event if found
 */
export function GetEvent(events: Event[], id: string): Event {
  const event = events.find((event) => event.id === id);
  return event as Event;
}

/**
 * Function to get an item (day or event) from the itinerary based on its ID
 * @param itinerary
 * @param events
 * @param id
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
 * Function to get the index of a day or event in the itinerary based on its ID and type
 * @param itinerary
 * @param type
 * @param id
 * @returns The event index or undefined if not found
 */
export function GetIndex(itinerary: Itinerary, events: Event[], type: "day" | "event", id: string): number {
  if (type === "day") {
    // Find the index of the day with the matching ID
    const dayIndex = itinerary.findIndex((day) => day.id === id);
    return dayIndex as number;
  } else if (type === "event") {
    // Find the index of the event with the matching ID within the current day
    const eventIndex = events.find((event) => event.id === id);
    return eventIndex?.position || -1;
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
  activeDate: Date | string,
  overIndex: number,
  overDate: Date | string
): Itinerary | undefined {
  if (activeDate === overDate) return;

  // Find the index of the active day in the itinerary
  const activeDayIndex = itinerary.findIndex((day) => day.date === activeDate);

  const newItinerary = [...itinerary];
  const activeEvent = GetItem(itinerary, events, activeId); // Get the event being dragged
  const pushIndex = newItinerary[overIndex].events.length; // Get the event push position in destination day

  // Insert the active event into the destination day's event array at the specified index
  newItinerary[overIndex].events.splice(pushIndex, 0, activeEvent as Event);

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
  const activeEvent = GetItem(itinerary, events, activeId);

  const _itinerary = [...itinerary];

  // Move within the same day
  if (activeDate === overDate) {
    // Move the active event within the same day by rearranging the event array
    const currentEvents = _itinerary[activeDayIndex].events;
    _itinerary[activeDayIndex].events = arrayMove(currentEvents, activeIndex, overIndex);
  }
  // Move to a different day
  else if (activeDate !== overDate) {
    // Insert the active event into the over day's event array at the specified index
    _itinerary[overDayIndex].events.splice(overIndex, 0, activeEvent as Event);

    // Remove the active event from the active day's event array
    _itinerary[activeDayIndex].events.splice(activeIndex, 1);
  }

  return _itinerary;
}
