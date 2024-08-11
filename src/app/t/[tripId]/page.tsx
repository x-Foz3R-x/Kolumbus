"use client";

import { useTripContext } from "./_components/trip-provider";
import { DndItinerary } from "~/components/dnd-itinerary";

import type { UpdatePlaceSchema } from "~/lib/types";

export default function Trip() {
  const { userId, trip, permissions, updateItinerary, getItineraryEntry } = useTripContext();

  const onPlaceUpdated = (tripId: string, placeId: string, data: UpdatePlaceSchema["data"]) => {
    console.log("place", placeId, data);
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
        onPlaceUpdated={onPlaceUpdated}
        dndTrash={permissions.editItinerary}
      />
    </div>
  );
}
