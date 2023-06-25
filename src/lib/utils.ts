/**
 * Converts date to string
 * @param date Date to convert
 * @returns Date in yyyy-mm-dd format
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
