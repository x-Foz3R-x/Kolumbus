"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAfter, isBefore } from "date-fns";

import { api } from "~/trpc/react";
import { useTripContext } from "./trip-provider";
import { toastHandler } from "~/lib/trpc";
import type { DaySchema } from "~/lib/validations/trip";
import { differenceInDays, formatDate, generateItinerary } from "~/lib/utils";

import TripStack from "./trip-stack";
import MembersDropdown from "./members-dropdown";
import { DatePicker } from "~/components/date-picker";
import { Icons } from "~/components/ui";
import { ExcludedDaysModal } from "./excluded-days-modal";

export default function TopNav() {
  const { trip, setTrip, deleteEvent } = useTripContext();

  const router = useRouter();
  const updateTrip = api.trip.update.useMutation(toastHandler("Trip dates changed"));

  const [isOpenModal, setIsOpenModal] = useState(false);

  const datesRef = useRef<{ startDate: Date; endDate: Date }>({
    startDate: new Date(trip.startDate),
    endDate: new Date(trip.endDate),
  });
  const daysToDeleteRef = useRef<DaySchema[]>([]);

  const updateTripData = (startDate: Date, endDate: Date) => {
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

  const applyDateRange = (startDate: Date, endDate: Date) => {
    // If the new start and end dates are within selected date range, update the trip (no conflicts).
    if (isBefore(startDate, new Date(trip.startDate)) && isAfter(endDate, new Date(trip.endDate))) {
      updateTripData(startDate, endDate);
      return;
    }

    const lastIndex = trip.itinerary.length - 1;
    const startOffset = isAfter(startDate, new Date(trip.startDate))
      ? differenceInDays(startDate, trip.startDate, true)
      : 0;
    const endOffset = isBefore(endDate, new Date(trip.endDate))
      ? lastIndex - differenceInDays(endDate, trip.endDate, true)
      : lastIndex;

    daysToDeleteRef.current = trip.itinerary.filter(
      (_, index) => index < startOffset || index > endOffset,
    );

    // If there are no events to delete, update the trip and exit (no conflicts).
    if (daysToDeleteRef.current.flatMap((day) => day.events).length === 0) {
      updateTripData(startDate, endDate);
      return;
    }

    datesRef.current = { startDate, endDate };
    // Show a confirmation modal if events scheduled on days being deleted
    // Are affected by the date change, requiring user input to proceed.
    setIsOpenModal(true);
  };

  // todo
  const handleDeleteEvents = (startDate: Date, endDate: Date) => {
    console.log(startDate, endDate);
    updateTripData(startDate, endDate);
    setIsOpenModal(false);

    // Delete the events scheduled on the days being deleted.
    daysToDeleteRef.current
      .flatMap((day) => day.events)
      .forEach((event) => {
        deleteEvent(event);
        console.log(event.id);
        // dispatchUserTrips({ type: UT.DELETE_EVENT, payload: { event, tripId: activeTrip.id } });
        // deleteEvent.mutate(
        //   { eventId: event.id },
        //   {
        //     onError(error) {
        //       console.error(error);
        //       dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: { ...activeTrip, itinerary: deepCloneItinerary(activeTrip.itinerary) } });
        //     },
        //   },
        // );
      });
  };

  return (
    <>
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

      <ExcludedDaysModal
        isOpen={isOpenModal}
        setOpen={setIsOpenModal}
        startDate={datesRef.current.startDate}
        endDate={datesRef.current.endDate}
        daysToDelete={daysToDeleteRef.current}
        onDeleteEvents={handleDeleteEvents}
      />
    </>
  );
}
