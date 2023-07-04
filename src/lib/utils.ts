import { usePathname } from "next/navigation";

/**
 * Formats a date into the "yyyy-mm-dd" format.
 * @param date The date object to be formatted.
 * @returns The formatted date string in "yyyy-mm-dd" format.
 */
export function FormatDate(date: Date): string {
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
 * @param startDate The start date.
 * @param endDate The end date.
 * @returns The number of days between the dates.
 */
export function CalculateDays(
  startDate: string | Date,
  endDate: string | Date
): number {
  // Calculate the difference between the end date and start date in milliseconds
  const difference =
    new Date(endDate).getTime() - new Date(startDate).getTime();
  // Number of milliseconds in a day
  const msInDay = 86400000;

  // Calculate the number of days by dividing the difference by the number of milliseconds in a day,
  // rounding the result to the nearest whole number, and adding 1 to include both the start and end dates
  const totalDays = Math.round(difference / msInDay) + 1;

  return totalDays;
}

/**
 * Checks if the current pathname matches the provided link
 * @param link The link to compare with the current pathname
 * @returns A boolean value indicating whether the current pathname matches the link.
 */
export function CheckCurrentPathname(link: string): boolean {
  return usePathname() === link ? true : false;
}
