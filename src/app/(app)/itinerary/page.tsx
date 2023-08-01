"use client";

import { createPortal } from "react-dom";

import useUserTrips from "@/hooks/use-user-trips";
import useAppData from "@/context/app-data";

import DndItinerary from "@/components/dnd-itinerary";
import ActionBar from "@/components/app/itinerary/action-bar";
import Main from "@/components/app/main";
import { Modal } from "@/components/ui/modal";
import { ItinerarySkeleton } from "@/components/loading/itinerary-skeleton";

export default function Itinerary() {
  const { selectedTrip, isModalShown, modalChildren } = useAppData();
  const { userTrips, dispatchUserTrips, loadingTrips, tripsError } =
    useUserTrips();

  return (
    <Main>
      <ActionBar />
      <section className="mt-8 overflow-scroll px-8">
        {tripsError && (
          <div className="w-full rounded-md bg-red-100 px-3 pt-6 text-center text-sm text-red-600">
            {tripsError}
          </div>
        )}

        {!loadingTrips &&
        userTrips?.length !== 0 &&
        typeof userTrips[selectedTrip]?.itinerary !== "undefined" &&
        userTrips[selectedTrip]?.position === selectedTrip ? (
          <DndItinerary
            key={userTrips[selectedTrip]?.position}
            userTrips={userTrips}
            dispatchUserTrips={dispatchUserTrips}
            selectedTrip={selectedTrip}
          />
        ) : (
          <ItinerarySkeleton />
        )}
      </section>

      {createPortal(
        <Modal showModal={isModalShown} modalChildren={modalChildren} />,
        document.body
      )}
    </Main>
  );
}
