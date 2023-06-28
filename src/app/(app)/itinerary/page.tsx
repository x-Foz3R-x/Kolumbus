"use client";

import useUserTrips from "@/hooks/api/use-user-trips";
import useSelectedTrip from "@/hooks/use-selected-trip";

import Main from "../../../components/app/main";
import ActionBar from "../../../components/app/itinerary/action-bar";

import DndItinerary from "@/components/dnd-itinerary";

export default function Itinerary() {
  const { userTrips, dispatchUserTrips, selectedTrip, loadingTrips } =
    useUserTrips();

  return (
    <Main>
      <ActionBar />
      <section className="mt-10 h-[calc(100vh-9.5rem)] overflow-scroll px-5">
        {!loadingTrips &&
          userTrips?.length !== 0 &&
          typeof userTrips[selectedTrip]?.position !== "undefined" && (
            <DndItinerary
              key={userTrips[selectedTrip]?.position}
              userTrips={userTrips}
              dispatchUserTrips={dispatchUserTrips}
              selectedTrip={selectedTrip}
            />
          )}
      </section>
    </Main>
  );
}
