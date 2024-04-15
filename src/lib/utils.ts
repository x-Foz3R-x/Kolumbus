import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import clsx, { ClassValue } from "clsx";
import { z } from "zod";

import type { Itinerary, Day, Event } from "@/types";

/**
 * Compares two arrays for equality.
 * @param a - The first array to compare.
 * @param b - The second array to compare.
 * @returns True if the arrays are equal, false otherwise.
 */
export function compareArrays<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every((element, index) => element === b[index]);
}

/**
 * Calculate the number of days between two dates.
 * @param firstDate - The first date
 * @param secondDate - The second date
 * @param inclusive - Whether to include the first date in the calculation (defaults to true).
 * @returns The number of days between the two dates.
 */
export function calculateDays(firstDate: Date | string, secondDate: Date | string, inclusive = true): number {
  // Calculate the time difference (in milliseconds)
  const timeDifference = Math.abs(new Date(firstDate).getTime() - new Date(secondDate).getTime());

  // Calculate the number of days by dividing the time difference by the number of milliseconds in a day
  const daysDifference = Math.ceil(timeDifference / 86400000);

  return inclusive ? daysDifference + 1 : daysDifference;
}

/**
 * Calculate the size of a JavaScript object in kilobytes (KB).
 * @param object The object to calculate the size for.
 * @returns The size in kilobytes (KB).
 */
export function calculateObjectSize<T extends object>(object: T): number {
  // Serialize the object to JSON and calculate its length in bytes
  const objectSizeInBytes = JSON.stringify(object).length;

  // Convert the size from bytes to kilobytes (KB) and round it to 2 decimal places
  return parseFloat((objectSizeInBytes / 1024).toFixed(2));
}

/**
 * Formats a date into a string in the format "YYYY-MM-DD".
 * @param date - The date to be formatted.
 * @returns The formatted date string.
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear().toString();

  return `${year}-${month}-${day}`;
}

/**
 * Generates an itinerary for a trip.
 *
 * @param tripId - The ID of the trip.
 * @param startDate - The start date of the trip.
 * @param endDate - The end date of the trip.
 * @param events - An array of events for the trip. Defaults to an empty array.
 * @returns An array representing the itinerary for the trip.
 */
export function generateItinerary(startDate: string, endDate: string, events: Event[] = []) {
  const totalDays = calculateDays(startDate, endDate);
  const currentDate = new Date(startDate);
  const itinerary: Itinerary = [];

  for (let i = 0; i < totalDays; i++) {
    const date = formatDate(currentDate);
    const day: Day = { id: `d${i}`, date, events: events.filter((event) => event.date === date) };

    itinerary.push(day);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return itinerary;
}

/**
 * Transforms an itinerary into a cache object.
 * @param itinerary The itinerary to transform.
 * @returns The transformed cache object.
 */
export function transformItineraryToCache(itinerary: Itinerary): Record<string, Event[]> {
  return itinerary.reduce((acc, day) => ({ ...acc, [day.id]: day.events }), {} as Record<string, Event[]>);
}

/**
 * Restores the itinerary from the cache based on the provided parameters.
 *
 * @param itinerary - The original itinerary. An array of day objects, each containing an id and an array of events.
 * @param cache - The cache containing events grouped by day id.
 * @param daysToCheck - Optional. An array of day ids to check for events in the cache.
 * If not provided, all days in the cache will be checked.
 *
 * @returns The restored itinerary. If `daysToCheck` is provided,
 * only the days with ids in `daysToCheck` will be updated with events from the cache.
 * If `daysToCheck` is not provided, all days in the itinerary will be updated with events from the cache.
 * If a day's events in the itinerary match the corresponding day's events in the cache, the day will be returned as is.
 */
export function restoreItineraryFromCache(itinerary: Itinerary, cache: Record<string, Event[]>, daysToCheck?: string[]): Itinerary {
  // If daysToCheck is provided, only include events from those days. Otherwise, include all events from the cache.
  const eventsToRestore = daysToCheck ? daysToCheck.flatMap((dayId) => cache[dayId]) : Object.keys(cache).flatMap((dayId) => cache[dayId]);

  const restoredItinerary = itinerary.map((day) => {
    // If daysToCheck is provided and the current day's id is not in it, return the day as is.
    if (daysToCheck && !daysToCheck.includes(day.id)) return day;

    const cachedEventIds = cache[day.id].map((event) => event.id);
    const dayEventIds = day.events.map((event) => event.id);

    // Return the day as is, if the current day's events match the cached events,
    if (compareArrays(cachedEventIds, dayEventIds)) return day;

    // For each cached event ID, attempt to find the corresponding event in allEvents.
    // If an event is not found for an ID, the .find returns undefined
    // Then .filter(Boolean) removes these undefined values from the array.
    const events = cachedEventIds.map((id) => eventsToRestore.find((event) => event.id === id)).filter(Boolean) as Event[];
    return { ...day, events };
  });

  // Reorder the itinerary based on the order of day IDs in the cache and return it.
  const cacheDayIds = Object.keys(cache);
  return cacheDayIds.map((id) => restoredItinerary.find((day) => day.id === id)).filter(Boolean) as Itinerary;
}

/**
 * Deep clones an itinerary object.
 *
 * @param itinerary - The itinerary to be cloned.
 * @returns The cloned itinerary.
 */
export function deepCloneItinerary(itinerary: Itinerary): Itinerary {
  return restoreItineraryFromCache(itinerary, transformItineraryToCache(itinerary));
}

/**
 * Returns the operating system of the user.
 * @returns The operating system of the user.
 */
export function getOS() {
  if (typeof window === "undefined") return null;
  const userAgent = window.navigator.userAgent.toLowerCase();

  if (/(macintosh|macintel|macppc|mac68k|macos)/i.test(userAgent)) return "macos";
  else if (/(iphone|ipad|ipod)/i.test(userAgent)) return "ios";
  else if (/(win32|win64|windows|wince)/i.test(userAgent)) return "windows";
  else if (/android/.test(userAgent)) return "android";
  else if (/linux/.test(userAgent)) return "linux";

  return null;
}

/**
 * Measures the runtime of a given asynchronous function.
 * @param fn - The function to measure the runtime of.
 * @returns A promise that resolves to the result of the function.
 */
export async function measureRuntime<T>(fn: () => Promise<T>) {
  console.log("⏳ Running...");

  try {
    const start = Date.now();

    const result = await fn();

    const end = Date.now();

    const time = end - start;
    const s = Math.floor(time / 1000);
    const ms = time % 1000;

    if (s > 0) console.log(`✅ Completed in ${s}s ${ms}ms`);
    else console.log(`✅ Completed in ${ms}ms`);

    return result;
  } catch (error) {
    console.error("❌ Failed");
    console.error(error);
  }
}

/**
 * Merges multiple class names into a single class name string.
 * @param inputs - The class names to merge.
 * @returns The merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//#region error handling
/**
 * Logs an error message to the console.
 * @param error - The error from witch message will be logged.
 */
export function logErrorMessage(error: unknown) {
  let message: string;

  if (error instanceof Error) message = error.message;
  else if (error && typeof error === "object" && "message" in error) message = String(error.message);
  else if (typeof error === "string") message = error;
  else if (error instanceof Array && error.length > 0) message = error.join(", ");
  else if (typeof error === "number") message = `Error code: ${error}`;
  else message = "Something went wrong";

  console.error(message);
}

/**
 * Generate an appropriate HTTP response based on the provided error.
 * @param error - The error to generate a response for.
 * @returns A Response object with the appropriate status code and error message.
 */
export function generateErrorResponse(error: unknown) {
  // Check if the error is a specific type of error (z.ZodError) and return a 422 response.
  if (error instanceof z.ZodError) return new Response(error.message, { status: 422 });

  // Check if the error is a general Error object and return a 500 response.
  if (error instanceof Error) return new Response(error.message, { status: 500 });

  // Check if the error is an object with a "message" property and return a 500 response.
  if (error && typeof error === "object" && "message" in error) return new Response(String(error.message), { status: 500 });

  // Check if the error is a string and return a 500 response.
  if (typeof error === "string") return new Response(error, { status: 500 });

  // Check if the error is an array with elements and return a 500 response with joined elements.
  if (error instanceof Array && error.length > 0) return new Response(error.join(", "), { status: 500 });

  // Check if the error is a number and return a 500 response with an "Error code" message.
  if (typeof error === "number") return new Response(`Error code: ${error}`, { status: 500 });

  // If none of the conditions matched, return a generic 500 response.
  return new Response("Something went wrong", { status: 500 });
}
//#endregion

// todo - to be removed
/**
 * Compares the current URL pathname with the provided URL.
 * @param url - The URL to compare with the current URL pathname.
 * @returns True if the current URL pathname matches the provided URL, false otherwise.
 */
export function compareURLs(url: string): boolean {
  return usePathname() === url ? true : false; // eslint-disable-line react-hooks/rules-of-hooks
}
