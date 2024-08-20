"use client";

// import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { useTripContext } from "./trip-provider";
// import type { DaySchema } from "~/lib/validations/trip";
import { differenceInDays, formatDate, generateItinerary } from "~/lib/utils";
import { toastHandler } from "~/lib/trpc";

import TripStack from "./trip-stack";
import MembersDropdown from "./members-dropdown";
// import { ExcludedDaysModal } from "./excluded-days-modal";
import ProfileButton from "~/components/profile-button";
import Calendar from "~/components/calendar";
import { Icons } from "~/components/ui";

export default function TopNav() {
  const router = useRouter();
  const { trip, setTrip } = useTripContext();
  const updateTrip = api.trip.update.useMutation(toastHandler("Trip dates changed"));
  const movePlace = api.place.move.useMutation(toastHandler());

  // const [isOpenModal, setIsOpenModal] = useState(false);

  // const datesRef = useRef<{ startDate: Date; endDate: Date }>({
  //   startDate: new Date(trip.startDate),
  //   endDate: new Date(trip.endDate),
  // });
  // const daysToDeleteRef = useRef<DaySchema[]>([]);

  const handleUpdate = (startDate: Date, endDate: Date) => {
    const totalDays = differenceInDays(startDate, endDate, true);
    const places = trip.itinerary.flatMap((day) => day.places);

    const firstPlaceDayIndex = places.length > 0 ? places.at(0)!.dayIndex : 0;
    const lastPlaceDay = places.length > 0 ? places.at(-1)!.dayIndex + 1 : 1;
    const minDays = lastPlaceDay - firstPlaceDayIndex;

    // Check if the new date range can accommodate the current itinerary
    if (totalDays < minDays) {
      toast.info(
        "Changing dates requires adjusting your itinerary. Please relocate items to proceed.",
      );
      return;
    }

    // Adjust the day index offset to ensure all places fit within the new date range, if necessary
    const dayIndexOffset = totalDays < lastPlaceDay ? lastPlaceDay - minDays : 0;

    console.log(dayIndexOffset);
    if (dayIndexOffset > 0) {
      console.log("update index");
      places.forEach((place) => (place.dayIndex -= dayIndexOffset));
    }

    const newItinerary = generateItinerary(startDate, endDate, places);

    setTrip(
      { itinerary: newItinerary, startDate: formatDate(startDate), endDate: formatDate(endDate) },
      "Change trip dates",
    );

    updateTrip.mutate(
      { id: trip.id, startDate: formatDate(startDate), endDate: formatDate(endDate) },
      { onError: () => router.refresh() },
    );
    if (dayIndexOffset > 0) {
      const movedPlaces = places.map((place) => ({ id: place.id, dayIndex: place.dayIndex }));
      movePlace.mutate(
        { tripId: trip.id, places: movedPlaces },
        { onError: () => router.refresh() },
      );
    }
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

          <Calendar
            startDate={trip.startDate}
            endDate={trip.endDate}
            maxDays={14}
            onApply={handleUpdate}
          />

          <MembersDropdown
            tripId={trip.id}
            tripInviteCode={trip.inviteCode}
            tripMembers={trip.members}
          />

          <ProfileButton />
        </section>
      </nav>

      {/* <ExcludedDaysModal
        isOpen={isOpenModal}
        setOpen={setIsOpenModal}
        startDate={datesRef.current.startDate}
        endDate={datesRef.current.endDate}
        daysToDelete={daysToDeleteRef.current}
        onDeleteEvents={handleDeleteEvents}
      /> */}
    </>
  );
}
