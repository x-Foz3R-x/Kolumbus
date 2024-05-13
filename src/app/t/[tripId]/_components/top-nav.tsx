"use client";

import Link from "next/link";
import type { TripContext } from "~/lib/validations/trip";

import TripStack from "./trip-stack";
import MembersDropdown from "./members-dropdown";
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
        <MembersDropdown
          tripId={props.trip.id}
          tripInviteCode={props.trip.inviteCode}
          tripMembers={props.trip.members}
        />
      </section>
    </nav>
  );
}
