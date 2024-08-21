"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import { useTripContext } from "./trip-provider";
import { differenceInDays, formatDate, generateItinerary } from "~/lib/utils";
import { toastHandler } from "~/lib/trpc";
import type { DaySchema } from "~/lib/types";

import TripStack from "./trip-stack";
import MembersDropdown from "./members-dropdown";
import ProfileButton from "~/components/profile-button";
import Calendar from "~/components/calendar";
import { Modal, ModalBody, ModalControls, ModalHeader, ModalText } from "~/components/ui/modal";
import { Button, Icons, ScrollIndicator } from "~/components/ui";
import { format } from "date-fns";
import { PlaceOverlay } from "~/components/dnd-itinerary/place";

export default function TopNav() {
  const router = useRouter();
  const { trip, setTrip } = useTripContext();
  const updateTrip = api.trip.update.useMutation(toastHandler("Trip dates changed"));
  const movePlace = api.place.move.useMutation(toastHandler());

  const [isModalOpen, setModalOpen] = useState(false);

  // const datesRef = useRef<{ startDate: Date; endDate: Date }>({
  //   startDate: new Date(trip.startDate),
  //   endDate: new Date(trip.endDate),
  // });
  const daysToDeleteRef = useRef<DaySchema[]>([]);

  const handleUpdate = (startDate: Date, endDate: Date) => {
    const totalDays = differenceInDays(startDate, endDate, true);
    const places = trip.itinerary.flatMap((day) => day.places);

    const firstPlaceDayIndex = places.length > 0 ? places.at(0)!.dayIndex : 0;
    const lastPlaceDay = places.length > 0 ? places.at(-1)!.dayIndex + 1 : 1;
    const minDays = lastPlaceDay - firstPlaceDayIndex;

    // Check if the new date range can accommodate the current itinerary
    if (totalDays < minDays) {
      setModalOpen(true);

      // Get all places that day index is bigger than totalDays with offset of firstPlaceDayIndex
      daysToDeleteRef.current = trip.itinerary
        .slice(totalDays + firstPlaceDayIndex)
        .filter((day) => day.places.length > 0);

      console.log(totalDays + firstPlaceDayIndex);
      console.log(trip.itinerary, daysToDeleteRef.current);

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

    console.log("update trip");
    return;

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

      <Modal isOpen={isModalOpen} setOpen={setModalOpen} size="xl">
        <ModalBody.iconDesign variant="danger" icon={<Icons.triangleExclamation />}>
          <ModalHeader className="text-red-500">Changing Dates Will Lead to Deletions</ModalHeader>

          <ModalText className="mb-0">
            Changing dates will permanently delete the following items:
          </ModalText>

          <ScrollIndicator
            indicator={{
              size: 30,
              className: { x: "from-gray-100", left: "rounded-l-xl", right: "rounded-r-xl" },
            }}
            orientation="x"
          >
            <ul className="flex w-[470px] gap-2 overflow-x-auto rounded-xl border-x-[6px] border-gray-100 bg-gray-100 py-1.5">
              {daysToDeleteRef.current.slice(0, 5).map((day, index) => (
                <li key={`dtd_${day.id}`}>
                  <h3 className="mb-0.5 flex items-center justify-between rounded-b rounded-t-lg border-b bg-white px-2 py-1 text-xs font-medium text-gray-500">
                    <span>{format(new Date(day.date), "d MMMM")}</span>
                    <span>Day {(day.places[0]?.dayIndex ?? index) + 1}</span>
                  </h3>

                  <ScrollIndicator
                    indicator={{ offset: { x: 8, bottom: 1 }, size: 40 }}
                    orientation="y"
                  >
                    <ul className="max-h-24 w-44 overflow-y-auto rounded-b-lg rounded-t border-b bg-white px-2">
                      {day.places.map((place, index) => (
                        <Button
                          key={`listItem${index}`}
                          variant="unset"
                          size="unset"
                          className="w-full cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-t border-gray-200/60 py-1.5 text-left text-sm first:border-t-0"
                          tooltip={{
                            placement: "bottom-start",
                            offset: 24,
                            zIndex: 1000,
                            className: "p-0 rounded-lg bg-transparent shadow-floatingHover",
                            followCursor: true,
                            children: <PlaceOverlay place={place} selectCount={0} />,
                          }}
                        >
                          {place.name}
                        </Button>
                      ))}
                    </ul>
                  </ScrollIndicator>
                </li>
              ))}

              {daysToDeleteRef.current.slice(5).flatMap((day) => day.places).length > 0 && (
                <p className="my-auto w-24 flex-shrink-0 text-center text-sm leading-tight text-gray-600">
                  And {daysToDeleteRef.current.slice(5).flatMap((day) => day.places).length} more
                  items...
                </p>
              )}
            </ul>
          </ScrollIndicator>
        </ModalBody.iconDesign>

        <ModalControls>
          <Button onClick={() => setModalOpen(false)} whileHover={{ scale: 1.05 }} animatePress>
            Cancel
          </Button>
          <Button
            // onClick={() => onDeleteEvents(startDate, endDate)}
            whileHover={{ scale: 1.05 }}
            animatePress
            className="bg-red-500 text-white"
          >
            Delete Items
          </Button>
        </ModalControls>
      </Modal>
    </>
  );
}
