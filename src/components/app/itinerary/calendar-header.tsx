import Icon from "@/components/icons";

interface Props {
  tripDay: number;
  overlay?: boolean;
}

export default function CalendarHeader({ tripDay, overlay, ...props }: Props) {
  return (
    <header className="relative flex h-5 w-32 items-center justify-center bg-kolumblue-500 text-xs font-medium text-white/75 group-first/calendar:rounded-t-xl">
      <button
        className="group/move peer absolute left-0 h-5 w-6 cursor-grab"
        {...props}
      >
        <Icon.gripDots className="absolute left-2 top-[5px] h-[0.625rem] w-[0.625rem] fill-white/75" />
        <p
          className={
            "absolute left-0 top-[2px] h-4 w-20 origin-left scale-x-0 select-none capitalize opacity-0 duration-200 ease-kolumb-flow group-hover/move:left-6 group-hover/move:scale-x-100 " +
            (!overlay && "group-hover/move:opacity-100")
          }
        >
          move
        </p>
      </button>

      <button className="group/add peer absolute right-0 h-5 w-6">
        <Icon.plus className="absolute right-2 top-[5px] h-[0.625rem] w-[0.625rem] fill-white/75" />
        <p
          className={
            "absolute right-0 top-[2px] h-4 w-20 origin-right scale-x-0 select-none capitalize opacity-0 duration-200 ease-kolumb-flow group-hover/add:right-6 group-hover/add:scale-x-100 " +
            (!overlay && "group-hover/add:opacity-100")
          }
        >
          add event
        </p>
      </button>

      <div
        className={
          "origin-center capitalize duration-200 ease-kolumb-flow " +
          (!overlay && "peer-hover:scale-0 ")
        }
      >
        {!overlay ? "day " + tripDay : "moving"}
      </div>
    </header>
  );
}
