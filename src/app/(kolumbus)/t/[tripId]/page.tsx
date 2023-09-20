"use client";

import React, { useEffect } from "react";
// import { createPortal } from "react-dom";

import useAppdata from "@/context/appdata";

import DndItinerary from "@/components/dnd-itinerary";
import ActionBar from "@/components/kolumbus/itinerary/action-bar";
import Main from "@/components/kolumbus/main";
// import { Modal } from "@/components/ui/modal";
import { FindTripIndex } from "@/lib/utils";
import { ItinerarySkeleton } from "@/components/loading/itinerary-skeleton";

type ItineraryProps = {
  params: { tripId: string };
};
export default function Itinerary({ params: { tripId } }: ItineraryProps) {
  const {
    userTrips,
    dispatchUserTrips,
    selectedTrip,
    setSelectedTrip,
    isLoading,
    isModalShown,
    modalChildren,
  } = useAppdata();

  useEffect(() => {
    setSelectedTrip(FindTripIndex(userTrips, tripId));
  }, [setSelectedTrip, userTrips, tripId]);

  // console.log("length", userTrips?.length !== 0);
  // console.log("typeof", typeof userTrips[selectedTrip]?.itinerary !== "undefined");

  return (
    <Main>
      <ActionBar />

      <section className="ml-6 overflow-scroll pr-6">
        {!isLoading &&
        userTrips?.length !== 0 &&
        typeof userTrips[selectedTrip]?.itinerary !== "undefined" ? (
          <DndItinerary
            userTrips={userTrips}
            dispatchUserTrips={dispatchUserTrips}
            selectedTrip={selectedTrip}
          />
        ) : (
          <ItinerarySkeleton />
        )}
      </section>

      {/* {createPortal(<Modal showModal={isModalShown} modalChildren={modalChildren} />, document.body)} */}
    </Main>
  );
}
