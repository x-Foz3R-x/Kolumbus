"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { toastHandler } from "~/lib/trpc";
import type { PlaceDetailsSchema, PlaceSchema } from "~/lib/types";

import { useTripContext } from "./_components/trip-provider";
import { DndItinerary } from "~/components/dnd-itinerary";

export default function Trip() {
  const router = useRouter();

  const createPlace = api.place.create.useMutation(toastHandler("Place created"));
  const updatePlace = api.place.update.useMutation(toastHandler("Place updated"));
  const movePlace = api.place.move.useMutation(toastHandler("Place moved"));
  const deletePlace = api.place.delete.useMutation(toastHandler("Place deleted"));
  const { userId, trip, permissions, updateItinerary, getItineraryEntry } = useTripContext();

  const onPlaceCreate = (place: PlaceSchema) => {
    createPlace.mutate(place, { onError: () => router.refresh() });
  };
  const onPlaceUpdate = (
    tripId: string,
    placeId: string,
    modifiedFields: Partial<PlaceDetailsSchema>,
  ) => {
    updatePlace.mutate({ tripId, placeId, modifiedFields }, { onError: () => router.refresh() });
  };
  const onPlaceMove = (
    tripId: string,
    places: { id: string; dayIndex: number; sortIndex: number }[],
  ) => {
    movePlace.mutate({ tripId, places: places }, { onError: () => router.refresh() });
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
        onItemUpdate={onPlaceUpdate}
        onItemsMove={onPlaceMove}
        onItemsDelete={onPlaceDelete}
        dndTrash={permissions.editItinerary}
      />
    </div>
  );
}
