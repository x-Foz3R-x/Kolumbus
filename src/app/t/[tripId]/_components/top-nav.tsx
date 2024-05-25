"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { api } from "~/trpc/react";
import { useTripContext } from "./trip-provider";
import { toastHandler } from "~/lib/trpc";
import { formatDate } from "~/lib/utils";

import TripStack from "./trip-stack";
import MembersDropdown from "./members-dropdown";
import { DatePicker } from "~/components/date-picker";
import { Icons } from "~/components/ui";

// todo: check if changed date has required action with events in applyDateRange

export default function TopNav() {
  const { trip, setTrip } = useTripContext();

  const router = useRouter();
  const updateTrip = api.trip.update.useMutation(toastHandler("Trip dates changed"));

  const applyDateRange = (startDate: Date, endDate: Date) => {
    setTrip(
      { ...trip, startDate: formatDate(startDate), endDate: formatDate(endDate) },
      "Change trip dates",
    );

    updateTrip.mutate(
      { id: trip.id, startDate: formatDate(startDate), endDate: formatDate(endDate) },
      { onError: () => router.refresh() },
    );
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b bg-white/80 px-[1.375rem] backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
      <section className="flex h-full flex-shrink-0 items-center justify-end gap-2">
        <Link
          href="/"
          className="flex origin-left items-center gap-2 font-belanosima text-lg font-bold text-kolumblue-500"
        >
          <Icons.logo2 className="h-6 fill-kolumblue-500" />
        </Link>

        <Icons.slash className="size-[22px] stroke-gray-300" />

        <TripStack />
      </section>

      <section className="flex h-full flex-shrink-0 items-center justify-end gap-2">
        <div id="trash-container" />
        <Icons.rangeCalendarOg className="h-[38px] fill-kolumblue-500" />
        <DatePicker
          startDate={trip.startDate}
          endDate={trip.endDate}
          maxDays={14}
          onApply={applyDateRange}
          includeDays
          includeTooltip
        />
        <DatePicker
          startDate={trip.startDate}
          endDate={trip.endDate}
          maxDays={14}
          onApply={(startDate, endDate) => {
            console.log(startDate, endDate);
          }}
          buttonProps={{
            variant: "unset",
            size: "unset",
            className: "relative h-10 fill-kolumblue-500",
            tooltip: {
              placement: "bottom",
              offset: 8,
              arrow: true,
              focus: { enabled: false },
              zIndex: 50,
              children: "Date Picker",
            },
            children: (
              <>
                <Icons.rangeCalendar4 className="h-full" />
                <div className="absolute inset-y-0 left-0 flex w-[40px] flex-col items-center justify-between pb-1 pl-1 pr-[7px] pt-[7px] leading-none">
                  <span className="text-[10px] font-medium uppercase leading-[14px] tracking-tight text-white">
                    {format(new Date(trip.startDate), "MMM").toUpperCase()}
                  </span>
                  <span className="text-sm leading-[15px]">
                    {format(new Date(trip.startDate), "d")}
                  </span>
                </div>

                <div className="absolute inset-y-0 right-0 flex w-[40px] flex-col items-center justify-between pb-1 pl-[7px] pr-1 pt-[7px] leading-none">
                  <span className="text-[10px] font-medium uppercase leading-[14px] tracking-tight text-white">
                    {format(new Date(trip.endDate), "MMM").toUpperCase()}
                  </span>
                  <span className="text-sm leading-[15px]">
                    {format(new Date(trip.endDate), "d")}
                  </span>
                </div>
              </>
            ),
          }}
        />
        <MembersDropdown
          tripId={trip.id}
          tripInviteCode={trip.inviteCode}
          tripMembers={trip.members}
        />
      </section>
    </nav>
  );
}
