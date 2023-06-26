import { usePathname } from "next/navigation";

/**
 * Converts date to string
 * @param date The Date to convert
 * @returns The Date in yyyy-mm-dd format
 */
export function FormatDate(date: Date) {
  const DATE = new Date(date);

  let dd: string | number = DATE.getDate();
  let mm: string | number = DATE.getMonth() + 1;
  let yyyy: number = DATE.getFullYear();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return yyyy + "-" + mm + "-" + dd;
}

/**
 * Takes a numeric value representing the day of the week and returns the corresponding index in the week. The index values range from 0 to 6, where 0 represents Monday and 6 represents Sunday
 * @param dayOfWeek A numeric value representing the day of the week
 * @returns The corresponding index in the week
 */
export function FormatDayOfWeek(dayOfWeek: number) {
  // Convert the numeric representation of the day of the week to the corresponding index in the week
  // 0 represents Sunday, 1 represents Monday, and so on
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
      return NaN;
  }
}

/**
 * Checks if the current pathname matches the provided link
 * @param link The link to compare with the current pathname
 * @returns A boolean value indicating whether the current pathname matches the link.
 */
export function CheckCurrentPathname(link: string) {
  return usePathname() === link ? true : false;
}

/**
 * @param ADD > { type: ACTION.ADD, payload: payload }
 * @param EMPTY > { type: ACTION.EMPTY }
 * @param REPLACE > { type: ACTION.REPLACE, payload: payload }
 * @param UPDATE > { type: ACTION.X_UPDATES, trip: selectedTrip, field: string, payload: data }
 * @param X_UPDATES > { type: ACTION.X_UPDATES, trip: selectedTrip, fields: string[], payload: data[] }
 */
export const ACTIONS = {
  // dispatch({ type: ACTION.ADD, payload: payload });
  ADD: "add",

  // dispatch({ type: ACTION.EMPTY });
  EMPTY: "empty",

  // dispatch({ type: ACTION.REPLACE, payload: payload });
  REPLACE: "replace",

  // dispatch({ type: ACTION.REPLACE_TRIP, payload: payload });
  REPLACE_TRIP: "replace_trip",

  // dispatch({ type: ACTION.X_UPDATES, trip: selectedTrip, field: string, payload: data, });
  UPDATE: "update",

  // dispatch({ type: ACTION.X_UPDATES, trip: selectedTrip, fields: string[], payload: data[], });
  X_UPDATES: "x_updates",
};
