import React from "react";

import PlusSVG from "@/assets/svg/Plus.svg";

interface Props {
  tripDay: number;
}

export default function CalendarHeader({ tripDay }: Props) {
  return (
    <header className="relative flex h-5 w-32 items-center justify-center bg-kolumblue-500 text-xs font-medium uppercase text-white/75 group-first/calendar:rounded-t-xl">
      <button className="group/addEventBtn peer absolute right-0 h-5 w-6">
        <PlusSVG className="absolute right-2 top-[0.375rem] h-2 w-2 fill-white/75" />
        <span className="absolute right-0 top-[0.125rem] h-4 w-20 origin-right scale-x-0 uppercase opacity-0 duration-300 ease-kolumb-flow group-hover/addEventBtn:right-6 group-hover/addEventBtn:scale-x-100 group-hover/addEventBtn:opacity-100">
          add event
        </span>
      </button>
      <div className="origin-center duration-300 ease-kolumb-flow peer-hover:scale-0">
        {"day " + tripDay}
      </div>
    </header>
  );
}
