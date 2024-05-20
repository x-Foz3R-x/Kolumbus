"use client";

import { format } from "date-fns";
import { useTripContext } from "./_components/trip-context";

export default function Itinerary() {
  const { trip } = useTripContext();

  return (
    <div className="h-screen pl-20 pt-14">
      Itinerary {trip.id} {trip.name}
      <div>
        {format(new Date(trip.startDate), "yyyy MMMM dd")}__ TO __
        {format(new Date(trip.endDate), "yyyy MMMM dd")}
      </div>
    </div>
  );
}
