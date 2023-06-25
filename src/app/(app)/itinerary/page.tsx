"use client";

import useUserTrips from "@/hooks/api/use-user-trips";
import useSelectedTrip from "@/hooks/use-selected-trip";

import Main from "../components/Main";
import ActionBar from "./components/ActionBar";

import RenderCalendarSection from "./components/calendar/RenderCalendarSection";
import DaysSection from "./components/days/DaysSection";

import Spinner from "@/components/loading-indicator/Spinner";

import DndComponent from "./components/days/test";
import DndItinerary from "@/components/DndItinerary";

export default function Itinerary() {
  const { userTrips, loadingTrips, tripsError } = useUserTrips();
  const [selectedTrip] = useSelectedTrip();

  return (
    <Main>
      <ActionBar />
      {loadingTrips ? (
        <Spinner />
      ) : (
        <div className="mt-9 flex overflow-hidden px-5">
          <section className="flex flex-col gap-10">
            {RenderCalendarSection(userTrips, selectedTrip)}
            {RenderCalendarSection(userTrips, selectedTrip)}
          </section>

          <section className="ml-5 flex w-[calc(100vw-384px)] flex-col gap-10 overflow-scroll">
            <DndItinerary />
            {/* <DndComponent /> */}
            {/* <DaysSection /> */}
            {/* <DaysSection /> */}
          </section>
        </div>
      )}
    </Main>
  );
}
