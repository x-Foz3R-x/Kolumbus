"use client";

import useUserTrips from "@/hooks/api/use-user-trips";
import useSelectedTrip from "@/hooks/use-selected-trip";

import Main from "../components/Main";
import ActionBar from "./components/ActionBar";

import RenderCalendarSection from "./components/calendar/RenderCalendarSection";
import DaysSection from "./components/days/DaysSection";

import Spinner from "@/components/loading-indicator/Spinner";

export default function Itinerary() {
  const { userTrips, loadingTrips, tripsError } = useUserTrips();
  const [selectedTrip] = useSelectedTrip();

  return (
    <Main>
      <ActionBar />
      {loadingTrips ? (
        <Spinner />
      ) : (
        <div className="mt-8 flex overflow-hidden px-4">
          <section className="flex flex-col gap-10">
            {RenderCalendarSection(userTrips, selectedTrip)}
            {RenderCalendarSection(userTrips, selectedTrip)}
          </section>

          <section className="flex w-[calc(100vw-384px)] flex-col gap-10 overflow-scroll">
            <DaysSection />
            {/* <DaysSection /> */}
          </section>
        </div>
      )}
    </Main>
  );
}
