"use client";

import Link from "next/link";
import { format } from "date-fns";

import type { TripContext } from "~/lib/validations/trip";

import TripStack from "./trip-stack";
import MembersDropdown from "./members-dropdown";
import { DatePicker } from "~/components/date-picker";
import { Icons } from "~/components/ui";

export default function TopNav(props: {
  trip: TripContext["trip"];
  myMemberships: TripContext["myMemberships"];
}) {
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

        <TripStack
          tripId={props.trip.id}
          tripName={props.trip.name}
          myMemberships={props.myMemberships}
        />
      </section>

      <section className="flex h-full flex-shrink-0 items-center justify-end gap-2">
        <Icons.calendar className="h-8 fill-kolumblue-500" />
        <Icons.rangeCalendar className="h-8 fill-kolumblue-500" />
        <DatePicker
          startDate={props.trip.startDate}
          endDate={props.trip.endDate}
          daysLimit={14}
          onApply={(startDate, endDate) => {
            console.log(startDate, endDate);
          }}
          includeDays
          buttonProps={{
            variant: "unset",
            size: "unset",
            className: "relative h-[38px] w-[82px]",
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
                <Icons.rangeCalendar className="h-full w-full fill-kolumblue-500" />
                <div className="absolute inset-y-0 left-0 flex w-[35px] flex-col items-center justify-between pb-0.5 pt-[5px] leading-none">
                  <span className="text-[10px] font-medium uppercase leading-[13px] tracking-tight text-white">
                    {format(new Date(props.trip.startDate), "MMM").toUpperCase()}
                  </span>
                  <span className="text-sm leading-[18px]">
                    {format(new Date(props.trip.startDate), "d")}
                  </span>
                </div>

                <div className="absolute inset-y-0 right-0 flex w-[35px] flex-col items-center justify-between pb-0.5 pt-[5px] leading-none">
                  <span className="text-[10px] font-medium uppercase leading-[13px] tracking-tight text-white">
                    {format(new Date(props.trip.endDate), "MMM").toUpperCase()}
                  </span>
                  <span className="text-sm leading-[18px]">
                    {format(new Date(props.trip.endDate), "d")}
                  </span>
                </div>
              </>
            ),
          }}
        />
        <MembersDropdown
          tripId={props.trip.id}
          tripInviteCode={props.trip.inviteCode}
          tripMembers={props.trip.members}
        />
      </section>
    </nav>
  );
}
