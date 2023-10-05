import { usePathname } from "next/navigation";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import type { Trip, TripDB, Itinerary, Day, Event, EventDB } from "@/types";

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
 * Calculates the number of days between a start date and an end date.
 * @param startDate The start date as a string or Date object.
 * @param endDate The end date as a string or Date object.
 * @returns The total number of days between the dates.
 */
export function CalculateDays(startDate: string | Date, endDate: string | Date): number {
  // Calculate the difference between the end date and start date in milliseconds
  const difference = new Date(endDate).getTime() - new Date(startDate).getTime();
  const msInDay = 86400000; // Number of milliseconds in a day

  // Calculate the number of days by dividing the difference by the number of milliseconds in a day,
  // rounding the result to the nearest whole number, and adding 1 to include both the start and end dates
  let totalDays = Math.round(difference / msInDay) + 1;

  return totalDays;
}

/**
 * Find the index of a trip with a specific tripId in an array of trips.
 * @param trips - An array of Trip objects
 * @param tripId - The ID of the trip to find
 * @returns The index of the trip in the array if found, or -1 if not found.
 */
export function FindTripIndex(trips: Trip[] | TripDB[], tripId: string): number {
  return trips.findIndex((trip) => trip.id === tripId);
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
export function GenerateItinerary(
  tripId: string,
  startDate: string | Date,
  days: number,
  events: Event[] | EventDB[] = []
) {
  const itinerary: Itinerary = [];
  const iteratedDate = new Date(startDate);

  // Convert date properties of events to ISO strings if they are Date objects.
  events = events.map((event) => {
    if (event.date instanceof Date) event.date = event.date.toISOString();
    if (event.createdAt instanceof Date) event.createdAt = event.createdAt.toISOString();
    if (event.updatedAt instanceof Date) event.updatedAt = event.updatedAt.toISOString();

    return event as Event;
  });

  for (let i = 0; i < days; i++) {
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

/**
 * Checks if the current pathname matches the provided link
 * @param link The link to compare with the current pathname
 * @returns A boolean value indicating whether the current pathname matches the link.
 */
export function CheckCurrentPathname(link: string): boolean {
  return usePathname() === link ? true : false;
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
  if (error && typeof error === "object" && "message" in error)
    return new Response(String(error.message), { status: 500 });

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
 * Calculate the size of a JavaScript object when serialized to JSON in kilobytes (KB).
 * @param object The object to calculate the size for.
 * @returns The size in kilobytes (KB).
 */
export function calculateJsonSizeInKB(object: {}): number {
  // Serialize the object to JSON and calculate its length in bytes
  const jsonSizeInBytes = JSON.stringify(object).length;

  // Convert the size from bytes to kilobytes (KB) and round it to 2 decimal places
  const sizeInKB = Number((jsonSizeInBytes / 1024).toFixed(2));

  return sizeInKB;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//#endregion
