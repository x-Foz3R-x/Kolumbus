import { addDays, differenceInCalendarDays, format } from "date-fns";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { env } from "~/env";

import type { Event } from "./validations/event";
import type { Day, Itinerary } from "./validations/trip";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function os() {
  if (typeof window === "undefined") return null;
  const userAgent = window.navigator.userAgent.toLowerCase();

  if (/(macintosh|macintel|macppc|mac68k|macos)/i.test(userAgent)) return "macos";
  else if (/(iphone|ipad|ipod)/i.test(userAgent)) return "ios";
  else if (/(win32|win64|windows|wince)/i.test(userAgent)) return "windows";
  else if (/android/.test(userAgent)) return "android";
  else if (/linux/.test(userAgent)) return "linux";

  return null;
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

/**
 * Generates a random ID string.
 * @param length The length of the ID string. Defaults to 16.
 * @returns A random ID string.
 */
export function createId(length = 16) {
  return customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", length)();
}

/**
 * Calculate the days difference between two dates.
 * @param exclusive - Whether to exclude the first date in the calculation.
 */
export function differenceInDays(
  startDate: Date | string,
  endDate: Date | string,
  exclusive?: boolean,
): number {
  const daysDifference = Math.abs(differenceInCalendarDays(new Date(endDate), new Date(startDate)));
  return exclusive ? daysDifference : daysDifference + 1;
}

/**
 * Formats a date into a string in the format "YYYY-MM-DD".
 */
export function formatDate(date: Date | string): string {
  return format(new Date(date), "yyyy-MM-dd");
}

/**
 * Encodes permissions based on a given permissions object and permissions template.
 * @param permissions - The permissions object or boolean value.
 * @param permissionsTemplate - The permissions template (enum).
 * @returns The encoded permissions as a number.
 */
export function encodePermissions(
  permissions: Record<string, boolean> | boolean,
  permissionsTemplate: unknown,
): number {
  const pEnum = permissionsTemplate as Record<string, number>;

  if (typeof permissions === "boolean") return permissions ? -1 : 0;
  return Object.entries(permissions).reduce(
    (encoded, [key, value]) => (value ? encoded | pEnum[key]! : encoded),
    0,
  );
}

/**
 * Decodes the encoded permissions using the provided permissions template.
 * @param encoded - The encoded permissions value.
 * @param permissionsTemplate - The permissions template (enum).
 * @returns An object representing the decoded permissions.
 */
export function decodePermissions<T extends Record<string, boolean>>(
  encoded: number,
  permissionsTemplate: unknown,
): T {
  const pEnum = permissionsTemplate as Record<string, number>;
  const permissions: Partial<Record<string, boolean>> = {};

  Object.keys(pEnum).forEach((key) => {
    if (isNaN(Number(key))) permissions[key] = (encoded & pEnum[key]!) !== 0;
  });

  return permissions as T;
}

/**
 * Generates an itinerary based on the provided start and end dates, and events.
 * @param startDate - The start date of the itinerary. Can be a string or a Date object.
 * @param endDate - The end date of the itinerary. Can be a string or a Date object.
 * @param events - An array of events to include in the itinerary.
 * @returns The generated itinerary is an array of Day objects.
 */
export function generateItinerary(
  startDate: string | Date,
  endDate: string | Date,
  events: Event[],
): Itinerary {
  const totalDays = differenceInDays(startDate, endDate);
  const beginningDate = new Date(startDate);
  const itinerary: Itinerary = [];

  for (let i = 0; i < totalDays; i++) {
    const date = formatDate(addDays(beginningDate, i));
    const day: Day = { id: `d${i}`, date, events: events.filter((event) => event.date === date) };

    itinerary.push(day);
  }

  return itinerary;
}
