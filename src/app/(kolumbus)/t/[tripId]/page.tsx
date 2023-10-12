"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import useAppdata from "@/context/appdata";
import DndItinerary from "@/components/dnd-itinerary";
import ActionBar from "@/components/itinerary/action-bar";
import { Modal } from "@/components/ui/modal";
import { ItinerarySkeleton } from "@/components/loading/itinerary-skeleton";
import ActionBarSkeleton from "@/components/loading/action-bar-skeleton";

type ItineraryProps = {
  params: { tripId: string };
};
export default function Itinerary({ params: { tripId } }: ItineraryProps) {
  const { userTrips, dispatchUserTrips, selectedTrip, setSelectedTrip, isLoading, isModalShown, modalChildren } = useAppdata();

  useEffect(() => {
    setSelectedTrip(userTrips.findIndex((trip) => trip.id === tripId));
  }, [setSelectedTrip, userTrips, tripId]);

  return (
    <>
      {!isLoading ? <ActionBar activeTrip={userTrips[selectedTrip]} /> : <ActionBarSkeleton />}
      <div className="flex flex-col px-6">
        {!isLoading ? (
          <DndItinerary userTrips={userTrips} dispatchUserTrips={dispatchUserTrips} selectedTrip={selectedTrip} />
        ) : (
          <ItinerarySkeleton />
        )}
      </div>

      {createPortal(<Modal showModal={isModalShown} modalChildren={modalChildren} />, document.body)}
    </>
  );
}
