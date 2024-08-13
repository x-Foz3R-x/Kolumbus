"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { toastHandler } from "~/lib/trpc";
import type { PlaceSchema } from "~/lib/types";

import { useTripContext } from "./_components/trip-provider";
import { DndItinerary } from "~/components/dnd-itinerary";

export default function Trip() {
  const router = useRouter();

  const createPlace = api.place.create.useMutation(toastHandler("Place created"));
  const updatePlacement = api.place.updatePlacement.useMutation(toastHandler());
  const deletePlace = api.place.delete.useMutation(toastHandler());
  const { userId, trip, permissions, updateItinerary, getItineraryEntry } = useTripContext();

  const onPlaceCreate = (place: PlaceSchema) => {
    createPlace.mutate(place, { onError: () => router.refresh() });
  };
  const onPlaceMove = (
    tripId: string,
    places: { id: string; dayIndex: number; sortIndex: number }[],
  ) => {
    updatePlacement.mutate({ tripId, places: places }, { onError: () => router.refresh() });
  };
  const onPlaceDelete = (tripId: string, placeIds: string[]) => {
    deletePlace.mutate({ tripId, placeIds }, { onError: () => router.refresh() });
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
        onItemCreate={onPlaceCreate}
        onItemsMove={onPlaceMove}
        onItemsDelete={onPlaceDelete}
        dndTrash={permissions.editItinerary}
      />
    </div>
  );
}
