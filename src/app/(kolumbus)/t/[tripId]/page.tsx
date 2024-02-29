"use client";

import { useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";

import useAppdata from "@/context/appdata";

import ActionBar from "@/components/itinerary/action-bar";
import { DndItinerary } from "@/components/dnd-itinerary";
import { ActionBarSkeleton, ItinerarySkeleton } from "@/components/skeletons";

export default function Itinerary({ params: { tripId } }: { params: { tripId: string } }) {
  const { user } = useUser();
  const { userTrips, setSelectedTrip, isLoading } = useAppdata();

  const activeTrip = useMemo(() => userTrips.find((trip) => trip.id === tripId), [userTrips, tripId]);
  const selectedTripIndex = useMemo(() => userTrips.findIndex((trip) => trip.id === tripId), [userTrips, tripId]);

  useEffect(() => {
    setSelectedTrip(selectedTripIndex);
  }, [setSelectedTrip, selectedTripIndex]);

  return !isLoading && user && activeTrip ? (
    <>
      {/* This span ensures that action bar isn't first to focus and the warning about position sticky disappears */}
      <span />
      <ActionBar activeTrip={activeTrip} />
      <div className="relative mt-28 px-2 pt-3 font-inter">
        <DndItinerary userId={user.id} tripId={tripId} itinerary={activeTrip.itinerary} />
      </div>
    </>
  ) : (
    <>
      <ActionBarSkeleton />
      <ItinerarySkeleton />
    </>
  );
}
