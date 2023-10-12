import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import clsx, { ClassValue } from "clsx";
import { z } from "zod";

import type { Itinerary, Day, Event, EventDB } from "@/types";

/**
 * Calculate the number of days between two dates.
 * @param firstDate - The first date
 * @param secondDate - The second date
 * @param inclusive - Whether to include the first date in the calculation (default is true).
 * @returns The number of days between the two dates.
 */
export function CalculateDays(firstDate: string | Date, secondDate: string | Date, inclusive = true): number {
  // Calculate the time difference (in milliseconds)
  const timeDifference = Math.abs(new Date(firstDate).getTime() - new Date(secondDate).getTime());

  // Calculate the number of days by dividing the time difference by the number of milliseconds in a day
  const daysDifference = Math.ceil(timeDifference / 86400000);

  return inclusive ? daysDifference + 1 : daysDifference;
}

/**
 * Formats the day of the week to a different representation.
 * Sunday is formatted as 6, Monday as 0, Tuesday as 1, and so on.
 * @param dayOfWeek The day of the week represented as a number (0-6).
 * @returns The formatted representation of the day of the week.
 */
export function FormatDayOfWeek(dayOfWeek: number): number {
  switch (dayOfWeek) {
    case 0:
      return 6;
    case 1:
      return 0;
    case 2:
      return 1;
    case 3:
      return 2;
    case 4:
      return 3;
    case 5:
      return 4;
    case 6:
      return 5;
    default:
      return 0;
  }
}

/**
 * Generates an itinerary for a trip.
 *
 * @param tripId - The ID of the trip.
 * @param startDate - The start date of the trip. Can be a string or Date object.
 * @param days - The number of days in the trip.
 * @param events - An array of events for the trip. Defaults to an empty array.
 * @returns An array representing the itinerary for the trip.
 */
export function GenerateItinerary(tripId: string, startDate: string | Date, endDate: string | Date, events: Event[] | EventDB[] = []) {
  const itinerary: Itinerary = [];
  const iteratedDate = new Date(startDate);

  // Convert date properties of events to ISO strings if they are Date objects.
  events = events.map((event) => {
    if (event.date instanceof Date) event.date = event.date.toISOString();
    if (event.updatedAt instanceof Date) event.updatedAt = event.updatedAt.toISOString();
    if (event.createdAt instanceof Date) event.createdAt = event.createdAt.toISOString();

    return event as Event;
  });

  for (let i = 0; i < CalculateDays(startDate, endDate); i++) {
    const currentDate = iteratedDate.toISOString();
    const currentEvents = events.filter((event) => event.date === currentDate);

    const day: Day = {
      id: `D${i}_@${tripId}`,
      date: currentDate,
      events: currentEvents ?? [],
    };

    itinerary.push(day);
    iteratedDate.setDate(iteratedDate.getDate() + 1);
  }

  return itinerary;
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

//#region misc
/**
 * Calculate the size of a JavaScript object in kilobytes (KB).
 * @param object The object to calculate the size for.
 * @returns The size in kilobytes (KB).
 */
export function CalculateObjectSizeInKB(object: {}): number {
  // Serialize the object to JSON and calculate its length in bytes
  const objectSizeInBytes = JSON.stringify(object).length;

  // Convert the size from bytes to kilobytes (KB) and round it to 2 decimal places
  const sizeInKB = Number((objectSizeInBytes / 1024).toFixed(2));

  return sizeInKB;
}

/**
 * Compares the current URL pathname with the provided URL.
 * @param url - The URL to compare with the current URL pathname.
 * @returns True if the current URL pathname matches the provided URL, false otherwise.
 */
export function CompareURLs(url: string): boolean {
  return usePathname() === url ? true : false;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//#endregion
