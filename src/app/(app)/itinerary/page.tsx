"use client";

import useUserTripsInfo from "@/hooks/api/use-user-trips-info";
import useUserTrips from "@/hooks/api/use-user-trips";
import useSelectedTrip from "@/hooks/use-selected-trip";

import Main from "../components/Main";
import ActionBar from "./components/ActionBar";

import RenderCalendarSection from "./components/calendar/RenderCalendarSection";
import DaysSection from "./components/days/DaysSection";

import Spinner from "@/components/loading/Spinner";

import DndItinerary from "@/components/DndItinerary";

export default function Itinerary() {
  const { userTripsInfo, loadingTrips, tripsError } = useUserTripsInfo();
  const { userTrips, dispatchUserTrips } = useUserTrips();
  const [selectedTrip] = useSelectedTrip();

  return (
    <Main>
      <ActionBar />
      {loadingTrips ? (
        <Spinner />
      ) : (
        <div className="mt-9 flex overflow-hidden px-5">
          <section className="flex flex-col gap-10">
            {RenderCalendarSection(userTripsInfo, selectedTrip)}
            {RenderCalendarSection(userTripsInfo, selectedTrip)}
          </section>

          <section className="ml-5 flex w-[calc(100vw-384px)] flex-col gap-10 overflow-scroll">
            {userTrips.length !== 0 && (
              <DndItinerary
                userTrips={userTrips}
                dispatchUserTrips={dispatchUserTrips}
                selectedTrip={selectedTrip}
              />
            )}
            {/* <DaysSection /> */}
            {/* <DaysSection /> */}
          </section>
        </div>
      )}
    </Main>
  );
}
