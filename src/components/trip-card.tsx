import { memo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import api from "@/app/_trpc/client";
import { TRIP_IMG_FALLBACK } from "@/lib/config";
import { calculateDays } from "@/lib/utils";
import { DispatchAction, Trip, UT } from "@/types";

import Icon from "./icons";
import { ScrollIndicator } from "./ui";
import { Menu, MenuLink, MenuOption } from "./ui/menu";
import { ConfirmTripDelete } from "./confirm-trip-delete";

type TripCardProps = {
  trip: Trip;
  userTrips: Trip[];
  dispatchUserTrips: React.Dispatch<DispatchAction>;
};
export const TripCard = memo(function TripCard({ trip, userTrips, dispatchUserTrips }: TripCardProps) {
  const updateTrip = api.trip.update.useMutation();
  const deleteTrip = api.trip.delete.useMutation();

  const [isModalOpen, setModalOpen] = useState(false);

  const scrollRef = useRef<HTMLHeadingElement>(null);

  const totalEvents = trip.itinerary.flatMap((day) => day.events).length;
  const photos = trip.itinerary
    .flatMap((day) => day.events)
    .filter((event) => event.photo !== null)
    .slice(0, 3)
    .map((event) => event.photo!)
    .join(",");

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const tripDuration = calculateDays(startDate, endDate);

  const deleteSelectedTrip = () => {
    // Update the position of the trips that are after the trip being deleted
    const handleUpdateTrip = (tripId: string, i: number) => {
      updateTrip.mutate(
        { tripId, data: { position: trip.position + i } },
        {
          onError(error) {
            console.error(error);
            dispatchUserTrips({ type: UT.REPLACE, trips: userTrips });
          },
        },
      );
    };

    dispatchUserTrips({ type: UT.DELETE_TRIP, trip });

    const tripsToUpdate = [...userTrips].slice(trip.position + 1);
    tripsToUpdate.forEach((trip, i) => handleUpdateTrip(trip.id, i));

    deleteTrip.mutate(
      { tripId: trip.id },
      {
        onError(error) {
          console.error(error);
          dispatchUserTrips({ type: UT.REPLACE, trips: userTrips });
        },
      },
    );
  };

  return (
    <div className="relative origin-bottom overflow-hidden rounded-xl border-2 border-white bg-white shadow-borderXL duration-400 ease-kolumb-flow hover:scale-105 hover:shadow-borderSplashXl">
      <Link href={`/t/${trip.id}`}>
        {/* Image */}
        <div className="relative h-56 w-56 overflow-hidden rounded-b-[10px] bg-gray-200">
          <Image
            src={`${photos ? `/api/get-trip-image?photoRefs=${photos}` : TRIP_IMG_FALLBACK}`}
            alt="Trip photo"
            sizes="244px"
            priority
            fill
          />
        </div>

        <div className="px-3 py-2">
          <h2 ref={scrollRef} className="relative w-full overflow-hidden whitespace-nowrap pb-1 text-center" aria-label={trip.name}>
            {trip.name}
            <ScrollIndicator scrollRef={scrollRef} />
          </h2>

          <div className="flex flex-col gap-0.5 text-xs text-gray-500">
            <span className="block">
              {startDate.getDate()} {startDate.toLocaleString("default", { month: "short" })}
              {" - "}
              {endDate.getDate()} {endDate.toLocaleString("default", { month: "short" })}
            </span>

            <span className="block">{`${tripDuration} ${tripDuration > 1 ? "days" : "day"}`}</span>

            <span className="block">{`${totalEvents} ${totalEvents > 1 ? "events" : "event"}`}</span>
          </div>
        </div>
      </Link>

      <Menu
        placement="bottom-start"
        className="w-32"
        buttonProps={{
          variant: "unset",
          size: "icon",
          className: "absolute bottom-3.5 right-1 z-50 rotate-90 rounded-full p-3 hover:bg-gray-50",
          children: <Icon.horizontalDots className="w-4" />,
        }}
      >
        <MenuLink label="open" href={`/t/${trip.id}`}>
          Open
        </MenuLink>
        <MenuOption label="share" disabled>
          Share
        </MenuOption>
        <MenuOption label="duplicate" disabled>
          Duplicate
        </MenuOption>
        <MenuOption label="Delete" onClick={() => setModalOpen(true)} variant="danger">
          Delete
        </MenuOption>
      </Menu>

      <ConfirmTripDelete isOpen={isModalOpen} setOpen={setModalOpen} onDelete={deleteSelectedTrip} />
    </div>
  );
});
