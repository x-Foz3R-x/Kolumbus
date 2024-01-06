"use client";

import { useEffect } from "react";

import useAppdata from "@/context/appdata";

import Portal from "@/components/portal";
import DndItinerary from "@/components/dnd-itinerary";
import ActionBar from "@/components/itinerary/action-bar";
import { ActionBarSkeleton, ItinerarySkeleton } from "@/components/loading";

import { ModalOld } from "@/components/ui/modalOld";

export default function Itinerary({ params: { tripId } }: { params: { tripId: string } }) {
  const { userTrips, selectedTrip, setSelectedTrip, isLoading, isModalShown, modalChildren } = useAppdata();

  useEffect(() => {
    setSelectedTrip(userTrips.findIndex((trip) => trip.id === tripId));
  }, [setSelectedTrip, userTrips, tripId]);

  return (
    <>
      {!isLoading ? (
        <>
          {/* This span ensures that action bar isn't first to focus and the warning about position sticky disappears */}
          <span />
          <ActionBar activeTrip={userTrips[selectedTrip]} />
          <DndItinerary tripId={tripId} />
        </>
      ) : (
        <>
          <ActionBarSkeleton />
          <ItinerarySkeleton />
        </>
      )}

      <Portal>
        <ModalOld showModal={isModalShown} modalChildren={modalChildren} />
      </Portal>
    </>
  );
}
