"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { toastHandler } from "~/lib/trpc";

import { useTripContext } from "./_components/trip-provider";
import { DndItinerary } from "~/components/dnd-itinerary";

export default function Trip() {
  const router = useRouter();

  const updatePlacement = api.place.updatePlacement.useMutation(toastHandler());
  const { userId, trip, permissions, updateItinerary, getItineraryEntry } = useTripContext();

  const onPlaceMoved = (
    tripId: string,
    items: { id: string; dayIndex: number; sortIndex: number }[],
  ) => {
    // console.log("place", placeId, dayIndex, sortIndex);
    updatePlacement.mutate({ tripId, items }, { onError: () => router.refresh() });
  };

  return (
    <div className="h-screen pl-20 pt-14">
      <DndItinerary
        userId={userId}
        tripId={trip.id}
        itinerary={trip.itinerary}
        setItinerary={updateItinerary}
        getEntry={getItineraryEntry}
        placeLimit={100}
        onItemsMove={onPlaceMoved}
        dndTrash={permissions.editItinerary}
      />
    </div>
  );
}
