// Importing a function for array element reordering
import { arrayMove } from "@dnd-kit/sortable";
// Importing a library for immutable data manipulation
import { produce } from "immer";

/**
 * Function to get an item (day or event) from the itinerary based on its ID
 * @param {any} itinerary
 * @param {any} events
 * @param {string | number} id
 * @returns The day if found, the event if found, or undefined if neither found
 */
export function getItem(itinerary, events, id) {
  // Find the day with the matching ID
  const day = itinerary?.find((day) => day.id == id);

  // Find the event with the matching ID
  const event = events?.find((event) => event.id == id);

  return day ? day : event ? event : undefined;
}

/**
 * Function to get the index of a day or event in the itinerary based on its ID and type
 * @param {*} itinerary
 * @param {string} type
 * @param {string | number} id
 * @returns The event index or undefined if not found
 */
export function getIndex(itinerary, type, id) {
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
 * Function to determine the horizontal direction of a drag based on the active and over elements' positions
 * @returns Drag direction
 */
export function getDragHorizontalDirection({ active, over }) {
  // Get the right position of the active element
  const activeRight = active?.rect?.current?.initial?.right;
  // Get the left position of the over element
  const overLeft = over?.rect?.left;

  // If the active element is to the left of the over element, return "fromLeft"
  if (activeRight < overLeft) return "fromLeft";

  // If the active element is to the right of the over element, return "fromRight"
  if (activeRight > overLeft) return "fromRight";
}

/**
 * @returns The updated itinerary
 */
export function eventOverDay(
  itinerary,
  events,
  activeId,
  activeIndex,
  activeDate,
  overIndex,
  overDate
) {
  if (activeDate === overDate) return;

  let activeDayIndex;
  itinerary.map((day, index) => {
    // Find the index of the active day in the itinerary
    if (day.date === activeDate) activeDayIndex = index;
  });

  const newItinerary = produce(itinerary, (draft) => {
    // Get the events array of the day being dragged over
    const overEvents = draft?.[overIndex].events;
    // Get the event being dragged
    const activeEvent = getItem(itinerary, events, activeId);

    // Add the active event to the events array of the day being dragged over
    overEvents.push(activeEvent);

    // Remove the active event from its original day's events array
    draft?.[activeDayIndex]?.events.splice(activeIndex, 1);
  });

  return newItinerary;
}

/**
 * @returns The updated itinerary
 */
export function eventOverEvent(
  itinerary,
  events,
  activeId,
  activeIndex,
  activeDate,
  overId,
  overIndex,
  overDate,
  dragDirection
) {
  let activeDayIndex;
  itinerary.map((day, index) => {
    // Find the index of the active day in the itinerary
    if (day.date === activeDate) activeDayIndex = index;
  });
  let overDayIndex;
  itinerary.map((day, index) => {
    // Find the index of the day being dragged over in the itinerary
    if (day.date === overDate) overDayIndex = index;
  });

  // Skip if either day index is not found
  if (activeDayIndex < 0 || overDayIndex < 0) return;

  // Get the active event being dragged
  const activeEvent = getItem(itinerary, events, activeId);

  const targetIndex = (index) => {
    // If dragged from the left, keep the same index
    if (dragDirection === "fromLeft") return index;
    // If dragged from the right, increment the index by 1
    else if (dragDirection === "fromRight") return index + 1;
  };

  let newItinerary;

  if (activeId === overId) return;
  // Move within the same day
  if (activeDate === overDate) {
    newItinerary = produce(itinerary, (draft) => {
      // Get the current day
      const currentDay = draft[activeDayIndex];
      // Get the events array of the current day
      const currentEvents = currentDay?.events;

      // Reorder the events array within the current day
      currentDay.events = arrayMove(currentEvents, activeIndex, overIndex);
    });
  }
  // Move to a different day
  else if (activeDate !== overDate) {
    newItinerary = produce(itinerary, (draft) => {
      // Get the day being dragged over
      const targetDay = draft[overDayIndex];
      // Get the events array of the day being dragged over
      const targetEvents = targetDay?.events;

      // Calculate the target index based on the drag direction
      const newIndex = targetIndex(overIndex);
      // Insert the active event at the target index in the day being dragged over
      targetEvents.splice(newIndex, 0, activeEvent);

      // Get the current day
      const currentDay = draft[activeDayIndex];
      // Get the events array of the current day
      const currentEvents = currentDay?.events;

      // Filter out the active event from the current day's events array
      const newEvents = currentEvents.filter((event) => event.id !== activeId);

      // Update the events array of the current day in the draft itinerary
      if (newEvents) draft[activeDayIndex].events = newEvents;
    });
  }

  return newItinerary;
}
