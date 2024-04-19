import { differenceInCalendarDays, format } from "date-fns";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
