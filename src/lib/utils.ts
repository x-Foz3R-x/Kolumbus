import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import clsx, { ClassValue } from "clsx";
import { z } from "zod";

import type { Itinerary, Day, Event } from "@/types";

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
 * Formats a date into the "yyyy-mm-dd" format.
 * @param date The date object to be formatted.
 * @returns The formatted date string in "yyyy-mm-dd" format.
 */
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

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
export function GenerateItinerary(tripId: string, startDate: string, endDate: string, events: Event[] = []) {
  const totalDays = CalculateDays(startDate, endDate);
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
