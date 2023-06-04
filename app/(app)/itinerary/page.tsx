"use client";

import { useEffect } from "react";

import { useAuth } from "@/context/auth";
import { useUserTrips } from "@/context/user-trips";
import useFetchUserTrips from "@/hooks/useFetchUserTrips";

import Main from "../components/Main";
import ActionBar from "./components/ActionBar";

import Calendar from "./components/calendar/Calendar";
import CalendarWeather from "./components/calendar/CalendarWeather";
import CalendarEnd from "./components/calendar/CalendarEnd";

export default function Itinerary() {
  const { currentUser } = useAuth();
  const { loading, error, userTrips, dispatch, ACTIONS } = useFetchUserTrips();
  // const { userTrips, dispatch, ACTIONS } = useUserTrips();

  // useEffect(() => {
  //   if (!loading) {
  //     setTimeout(() => {
  //       dispatch({ type: ACTIONS.REPLACE, payload: payload });
  //     }, 0);
  //   }
  // }, [loading]);

  return (
    <Main>
      <ActionBar />
      {loading && <div>Loading...</div>}
      {!loading && (
        <div className="mt-8 flex px-4">
          <section className="flex flex-col gap-10">
            <section className="h-fit w-fit rounded-xl shadow-default">
              <CalendarWeather tripDay={1} dayOfWeek={3} dayOfMonth={8} />
              <CalendarWeather tripDay={2} dayOfWeek={4} dayOfMonth={9} />
              <Calendar tripDay={3} dayOfWeek={5} dayOfMonth={10} />
              <Calendar tripDay={4} dayOfWeek={6} dayOfMonth={11} />
              <Calendar tripDay={5} dayOfWeek={0} dayOfMonth={12} />
              <Calendar tripDay={6} dayOfWeek={1} dayOfMonth={13} />
              <Calendar tripDay={7} dayOfWeek={2} dayOfMonth={14} />
              <CalendarEnd totalDays={7} />
            </section>

            <section className="h-fit w-fit rounded-xl shadow-kolumblue">
              <Calendar tripDay={3} dayOfWeek={5} dayOfMonth={10} />
              <Calendar tripDay={4} dayOfWeek={6} dayOfMonth={11} />
              <Calendar tripDay={5} dayOfWeek={0} dayOfMonth={12} />
              <Calendar tripDay={6} dayOfWeek={1} dayOfMonth={13} />
              <CalendarEnd totalDays={7} />
            </section>
          </section>

          <section>
            {error}
            <div className="">itinerary!!</div>
            <section className="flex flex-col">
              {userTrips.map((trip: any, index: number) => {
                return (
                  <button
                    key={index}
                    className={
                      "group/tripsSection flex items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium hover:z-10 hover:bg-kolumblue-100 hover:shadow-kolumblueHover "
                    }
                  >
                    <span className="duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem]">
                      {trip?.["trip_name"]}
                    </span>
                  </button>
                );
              })}
            </section>
          </section>
        </div>
      )}
    </Main>
  );
}
