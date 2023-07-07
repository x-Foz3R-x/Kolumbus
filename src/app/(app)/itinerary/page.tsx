"use client";

import useUserTrips from "@/hooks/use-user-trips";

import Main from "../../../components/app/main";
import ActionBar from "../../../components/app/itinerary/action-bar";

import DndItinerary from "@/components/dnd-itinerary";
import { ItinerarySkeleton } from "@/components/loading/itinerary-skeleton";

export default function Itinerary() {
  const {
    userTrips,
    dispatchUserTrips,
    selectedTrip,
    loadingTrips,
    tripsError,
  } = useUserTrips();
  return (
    <Main>
      <ActionBar />
      <section className="mt-10 overflow-scroll px-10">
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
    </Main>
  );
}
