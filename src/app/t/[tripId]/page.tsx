"use client";

import { useTripContext } from "./_components/trip-context";
import { DndItinerary } from "~/components/dnd-itinerary";

export default function Itinerary() {
  const { userId, trip, permissions } = useTripContext();

  return (
    <div className="h-screen pl-20 pt-14">
      <DndItinerary
        userId={userId}
        tripId={trip.id}
        itinerary={trip.itinerary}
        eventLimit={100}
        dndTrash={permissions.deleteEvents}
      />
    </div>
  );
}
