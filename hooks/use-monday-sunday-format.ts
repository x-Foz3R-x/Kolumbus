export default function useMondaySundayFormat(dayOfWeek: number) {
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
