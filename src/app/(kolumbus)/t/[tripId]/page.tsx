"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
const Portal = dynamic(() => import("@/components/portal"), { ssr: false });

import useAppdata from "@/context/appdata";

import DndItinerary from "@/components/dnd-itinerary";
import ActionBar from "@/components/itinerary/action-bar";
import { Modal } from "@/components/ui/modal";
import { ItinerarySkeleton } from "@/components/loading/itinerary-skeleton";
import ActionBarSkeleton from "@/components/loading/action-bar-skeleton";

export default function Itinerary({ params: { tripId } }: { params: { tripId: string } }) {
  const { userTrips, selectedTrip, setSelectedTrip, isLoading, isModalShown, modalChildren } = useAppdata();

  useEffect(() => {
    setSelectedTrip(userTrips.findIndex((trip) => trip.id === tripId));
  }, [setSelectedTrip, userTrips, tripId]);

  return (
    <>
      {!isLoading ? <ActionBar activeTrip={userTrips[selectedTrip]} /> : <ActionBarSkeleton />}
      <div className="flex flex-col px-6">{!isLoading ? <DndItinerary userTrips={userTrips} /> : <ItinerarySkeleton />}</div>

      <Portal>
        <Modal showModal={isModalShown} modalChildren={modalChildren} />
      </Portal>
    </>
  );
}
