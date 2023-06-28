interface Props {
  totalDays: number;
}

export default function CalendarEnd({ totalDays }: Props) {
  return (
    <div className="z-10 flex h-5 w-32 items-center justify-center rounded-b-xl bg-kolumblue-500 text-xs font-medium text-white/75">
      Total {totalDays} days
    </div>
  );
}
