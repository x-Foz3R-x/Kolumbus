import { usePathname } from "next/navigation";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import type { Trip, TripDB, Itinerary, Day, Event } from "@/types";

/**
 * Formats a given date into a db safe string.
 * @param date The date object to format.
 * @param includeDateTime Whether to include date with time in the formatted string (default is false).
 * @returns The formatted date string.
 */
export function FormatDate(date: Date | string, includeDateTime: boolean = false): string {
  if (typeof date === "string") date = new Date(date);

  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");

  if (!includeDateTime) return `${year}-${month}-${day}T00:00:00.000Z`;

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
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
 * Generates an itinerary for a trip based on the provided trip details and events.
 * @param trip - The trip details.
 * @param events - The list of events.
 * @returns An array representing the itinerary.
 */
export function GenerateItinerary(trip: Omit<Trip, "itinerary">, events: Event[] = []) {
  const itinerary: Itinerary = [];
  let iteratedDate = new Date(trip.startDate);

  // events.forEach((event) => (event.dragType = "event"));

  // Generate the itinerary for each day of the trip
  for (let i = 0; i < trip.days; i++) {
    const currentDate = FormatDate(iteratedDate);
    const currentDateEvents: Event[] = events.filter((event) => FormatDate(event.date) === currentDate);

    // Create a day object with the current date and associated events
    const Day: Day = {
      id: `d${i}@${trip.id}`,
      date: currentDate,
      dragType: "day",
      events: currentDateEvents ?? [],
    };

    itinerary.push(Day);
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
