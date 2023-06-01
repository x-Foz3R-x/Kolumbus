import React from "react";

interface Props {
  tripDay: number;
}

export default function CalendarHeader({ tripDay }: Props) {
  return (
    <header className="relative flex h-5 w-32 items-center justify-center bg-kolumblue-500 text-xs font-medium uppercase text-white/75 group-first:rounded-t-xl">
      {"day " + tripDay}
      <button className="absolute right-2">+</button>
    </header>
  );
}
