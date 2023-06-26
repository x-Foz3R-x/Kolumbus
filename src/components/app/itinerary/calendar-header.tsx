import PlusSVG from "@/assets/svg/Plus.svg";

interface Props {
  tripDay: number;
}

export default function CalendarHeader({ tripDay, ...props }: Props) {
  return (
    <header className="relative flex h-5 w-32 items-center justify-center bg-kolumblue-500 text-xs font-medium uppercase text-white/75 group-first/calendar:rounded-t-xl">
      <button
        className="group/addEventBtn peer absolute left-0 h-5 w-6 cursor-grab"
        {...props}
      >
        <PlusSVG className="absolute left-2 top-[0.375rem] h-2 w-2 fill-white/75" />
        <span className="absolute left-0 top-[0.125rem] h-4 w-20 origin-left scale-x-0 select-none capitalize opacity-0 duration-300 ease-kolumb-flow group-hover/addEventBtn:left-6 group-hover/addEventBtn:scale-x-100 group-hover/addEventBtn:opacity-100">
          move
        </span>
      </button>

      <button className="group/addEventBtn peer absolute right-0 h-5 w-6">
        <PlusSVG className="absolute right-2 top-[0.375rem] h-2 w-2 fill-white/75" />
        <span className="absolute right-0 top-[0.125rem] h-4 w-20 origin-right scale-x-0 select-none capitalize opacity-0 duration-300 ease-kolumb-flow group-hover/addEventBtn:right-6 group-hover/addEventBtn:scale-x-100 group-hover/addEventBtn:opacity-100">
          add event
        </span>
      </button>

      <div className="origin-center duration-300 ease-kolumb-flow peer-hover:scale-0">
        {"day " + tripDay}
      </div>
    </header>
  );
}
