"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { useTripContext } from "./trip-provider";
import { toastHandler } from "~/lib/trpc";
import { formatDate, generateItinerary } from "~/lib/utils";

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
    const events = trip.itinerary.flatMap((day) => day.events);
    const itinerary = generateItinerary(startDate, endDate, events);

    setTrip(
      {
        ...trip,
        itinerary,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        updatedAt: new Date(),
      },
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
        <DatePicker
          startDate={trip.startDate}
          endDate={trip.endDate}
          maxDays={14}
          onApply={applyDateRange}
          includeDays
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
