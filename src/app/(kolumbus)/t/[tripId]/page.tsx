"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
const Portal = dynamic(() => import("@/components/portal"), { ssr: false });

import useAppdata from "@/context/appdata";

import DndItinerary from "@/components/dnd-itinerary";
import ActionBar from "@/components/itinerary/action-bar";
import { ModalOld } from "@/components/ui/modalOld";
import { ItinerarySkeleton } from "@/components/loading/itinerary-skeleton";
import ActionBarSkeleton from "@/components/loading/action-bar-skeleton";

export default function Itinerary({ params: { tripId } }: { params: { tripId: string } }) {
  const { userTrips, selectedTrip, setSelectedTrip, isLoading, isModalShown, modalChildren } = useAppdata();

  useEffect(() => {
    setSelectedTrip(userTrips.findIndex((trip) => trip.id === tripId));
  }, [setSelectedTrip, userTrips, tripId]);

  return (
    <>
      {/* This span ensures that action bar isn't first to focus and the warning about position sticky disappears */}
      <span />

      {!isLoading && userTrips[selectedTrip] ? <ActionBar activeTrip={userTrips[selectedTrip]} /> : <ActionBarSkeleton />}
      {!isLoading && userTrips[selectedTrip] ? <DndItinerary userTrips={userTrips} tripId={tripId} /> : <ItinerarySkeleton />}

      <Portal>
        <ModalOld showModal={isModalShown} modalChildren={modalChildren} />
      </Portal>
    </>
  );
}
