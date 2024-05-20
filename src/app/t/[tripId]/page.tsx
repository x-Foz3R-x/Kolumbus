"use client";

import { useTripContext } from "./_components/trip-context";

export default function Itinerary() {
  const { trip } = useTripContext();

  return (
    <div className="h-screen pl-20 pt-14">
      Itinerary {trip.id} {trip.name}
    </div>
  );
}
