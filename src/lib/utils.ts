import { usePathname } from "next/navigation";
import { Trip, Itinerary, Day, Event } from "@/types";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
 * Formats the day of the week to a different representation.
 * Sunday is formatted as 6, Monday as 0, Tuesday as 1, and so on.
 * @param dayOfWeek The day of the week represented as a number (0-6).
 * @returns The formatted representation of the day of the week.
 */
export function formatDayOfWeek(dayOfWeek: number): number {
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
export function calculateDays(startDate: string | Date, endDate: string | Date): number {
  // Calculate the difference between the end date and start date in milliseconds
  const difference = new Date(endDate).getTime() - new Date(startDate).getTime();
  const msInDay = 86400000; // Number of milliseconds in a day

  // Calculate the number of days by dividing the difference by the number of milliseconds in a day,
  // rounding the result to the nearest whole number, and adding 1 to include both the start and end dates
  let totalDays = Math.round(difference / msInDay) + 1;

  return totalDays;
}

/**
 * Generates an itinerary for a trip based on the provided trip details and events.
 * @param trip - The trip details.
 * @param events - The list of events.
 * @returns An array representing the itinerary.
 */
export function generateItinerary(trip: Trip, events: Event[] = []) {
  const itinerary: Itinerary = [];
  let iteratedDate = new Date(trip.start_date);

  // Generate the itinerary for each day of the trip
  for (let i = 0; i < trip.days; i++) {
    const currentDate = formatDate(iteratedDate);
    const currentDateEvents: Event[] = events.filter((event: Event) => event.date === currentDate);

    // Create a day object with the current date and associated events
    const Day: Day = {
      id: `d${i}@${trip.id}`,
      date: currentDate,
      drag_type: "day",
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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
