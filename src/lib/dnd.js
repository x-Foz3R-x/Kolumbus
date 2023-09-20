import { arrayMove } from "@dnd-kit/sortable";
import { Events, Itinerary } from "@/types";

/**
 * Function to get an item (day or event) from the itinerary based on its ID
 * @param {any} itinerary
 * @param {any} events
 * @param {string | null} id
 * @returns The day if found, the event if found, or undefined if neither found
 */
export function GetItem(itinerary, events, id) {
  if (typeof id === null) return;

  // Find the day with the matching ID
  const day = itinerary?.find((day) => day.id === id);

  // Find the event with the matching ID
  const event = events?.find((event) => event.id === id);

  return day ? day : event ? event : undefined;
}

/**
 * Function to get the index of a day or event in the itinerary based on its ID and type
 * @param {*} itinerary
 * @param {string} type
 * @param {string | number} id
 * @returns The event index or undefined if not found
 */
export function GetIndex(itinerary, type, id) {
  if (type === "day") {
    // Find the index of the day with the matching ID
    return itinerary.findIndex((day) => day.id === id);
  } else if (type === "event") {
    let result;

    itinerary.forEach((day) => {
      // Find the index of the event with the matching ID within the current day
      const index = day.events.findIndex((event) => event.id === id);

      // If the event index is found, assign it to the result variable
      if (index >= 0) result = index;
    });

    return result;
  }
}

/**
 * Moves an event from one day to another in an itinerary.
 * @param {Itinerary} itinerary - The itinerary containing all the days and events.
 * @param {Events} events - The array of all events.
 * @param {string} activeId - The ID of the event being moved.
 * @param {number} activeIndex - The index of the event in the active day's event array.
 * @param {string} activeDate - The date of the active day.
 * @param {number} overIndex - The index of the day where the event is being moved to.
 * @param {string} overDate - The date of the day where the event is being moved to.
 * @returns {Array} - The updated itinerary after moving the event.
 */
export function EventOverDay(itinerary, events, activeId, activeIndex, activeDate, overIndex, overDate) {
  if (activeDate === overDate) return;

  // Find the index of the active day in the itinerary
  const activeDayIndex = itinerary.findIndex((day) => day.date === activeDate);

  const _itinerary = [...itinerary];
  const activeEvent = GetItem(itinerary, events, activeId); // Get the event being dragged
  const pushIndex = _itinerary[overIndex].events.length; // Get the event push position in destination day

  // Insert the active event into the destination day's event array at the specified index
  _itinerary[overIndex].events.splice(pushIndex, 0, activeEvent);

  // Remove the active event from the active day's event array
  _itinerary[activeDayIndex].events.splice(activeIndex, 1);

  return _itinerary;
}

/**
 * Moves an event over another event within the itinerary.
 * @param {Itinerary} itinerary - The itinerary containing all the days and events.
 * @param {Events} events - The array of all events.
 * @param {string} activeId - The ID of the event being moved.
 * @param {number} activeIndex - The index of the event in the active day's event array.
 * @param {string} activeDate - The date of the active day.
 * @param {string} overId - The ID of the event being moved over.
 * @param {number} overIndex - The index of the event being moved over in its day's event array.
 * @param {string} overDate - The date of the day where the event is being moved over.
 * @returns {Array} - The updated itinerary after moving the event.
 */
export function EventOverEvent(
  itinerary,
  events,
  activeId,
  activeIndex,
  activeDate,
  overId,
  overIndex,
  overDate
) {
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
    _itinerary[overDayIndex].events.splice(overIndex, 0, activeEvent);

    // Remove the active event from the active day's event array
    _itinerary[activeDayIndex].events.splice(activeIndex, 1);
  }

  return _itinerary;
}
