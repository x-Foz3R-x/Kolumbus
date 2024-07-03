"use client";

import { cn } from "~/lib/utils";
import { Button, Icons } from "../ui";

export default function Dock(props: {
  windows: {
    itinerary: { isOpen: boolean; isMinimized: boolean };
    devTools: { isOpen: boolean; isMinimized: boolean };
    calendar: { isOpen: boolean; isMinimized: boolean };
    history: { isOpen: boolean; isMinimized: boolean };
  };
  resetWindow: (windowName: keyof typeof props.windows) => void;
}) {
  return (
    <div className="w-full">
      <div className="relative z-10 mx-auto flex w-fit items-center justify-center gap-2 rounded-2xl bg-white/60 fill-gray-800 p-2 pb-3 shadow-xl backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
        <Button
          onClick={() => props.resetWindow("itinerary")}
          variant="unset"
          size="unset"
          className={cn(
            "flex size-10 items-center justify-center rounded-lg bg-white fill-kolumblue-500 shadow-sm",
            props.windows.itinerary.isOpen &&
              "after:absolute after:bottom-0.5 after:size-1 after:rounded-full after:bg-black/50",
          )}
          tooltip={{
            placement: "top",
            offset: { mainAxis: 14 },
            className:
              "bg-white/60 shadow-md text-gray-700 px-3.5 rounded backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter",
            children: "Itinerary",
          }}
        >
          <Icons.itinerary className="size-full rounded-lg px-1 py-2 shadow-sm" />
        </Button>

        <Button
          onClick={() => props.resetWindow("calendar")}
          variant="unset"
          size="unset"
          className={cn(
            "flex size-10 items-center justify-center rounded-lg bg-gradient-to-b from-blue-500 to-sky-300 fill-white shadow-sm",
            props.windows.calendar.isOpen &&
              "after:absolute after:bottom-0.5 after:size-1 after:rounded-full after:bg-black/50",
          )}
          tooltip={{
            placement: "top",
            offset: { mainAxis: 14 },
            className:
              "bg-white/60 shadow-md text-gray-700 px-3.5 rounded backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter",
            children: "Calendar",
          }}
        >
          <Icons.rangeCalendarOg className="size-full rounded-lg px-1 py-2 shadow-sm" />
        </Button>

        <Button
          onClick={() => props.resetWindow("history")}
          variant="unset"
          size="unset"
          className={cn(
            "flex size-10 items-center justify-center rounded-full bg-green-400 fill-black shadow-sm",
            props.windows.history.isOpen &&
              "after:absolute after:bottom-0.5 after:size-1 after:rounded-full after:bg-black/50",
          )}
          tooltip={{
            placement: "top",
            offset: { mainAxis: 14 },
            className:
              "bg-white/60 shadow-md text-gray-700 px-3.5 rounded backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter",
            children: "History",
          }}
        >
          <span className="size-full rounded-full py-2 shadow-sm">his</span>
        </Button>

        <Button
          onClick={() => props.resetWindow("devTools")}
          variant="unset"
          size="unset"
          className={cn(
            "flex size-10 items-center justify-center rounded-lg bg-gradient-to-b from-gray-700 to-gray-800 text-sm font-semibold tracking-tighter text-white shadow-sm",
            props.windows.devTools.isOpen &&
              "after:absolute after:bottom-0.5 after:size-1 after:rounded-full after:bg-black/50",
          )}
          tooltip={{
            placement: "top",
            offset: { mainAxis: 14 },
            className:
              "bg-white/60 shadow-md text-gray-700 px-3.5 rounded backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter",
            children: "Dev Tools",
          }}
        >
          <span className="size-full rounded-lg py-2.5 shadow-sm">{"< />"}</span>
        </Button>
      </div>
    </div>
  );
}
