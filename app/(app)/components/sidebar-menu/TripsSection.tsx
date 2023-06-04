"use client";

import { useEffect, useState } from "react";

import useFetchUserTrips from "@/hooks/useFetchUserTrips";

import Spinner from "@/components/loading-indicator/Spinner";
import DefaultTripSVG from "@/assets/svg/DefaultTrip.svg";

export default function TripsSection() {
  const { loading, error, userTrips, dispatch, ACTIONS } = useFetchUserTrips();

  const [selectedTrip, setSelectedTrip] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("selected_trip")) {
      setSelectedTrip(
        JSON.parse(sessionStorage.getItem("selected_trip") || "")
      );
    } else {
      sessionStorage.setItem("selected_trip", "0");
    }
  }, []);

  const handleTripClick = (index: number) => {
    setSelectedTrip(index);
    sessionStorage.setItem("selected_trip", index.toString());

    dispatch({ type: ACTIONS.ADD, payload: { trip_name: "kupa" } });

    // const currentUserTrips = [...userTrips];
    // currentUserTrips.slice(index, 1);
    // setUserTrips([{ trip_name: "dupa" }]);
  };

  return (
    <section className="flex flex-col gap-2 px-3 pb-3">
      <h1 className="font-adso text-2xl font-bold text-tintedGray-500">
        Trips
      </h1>

      {!error ? (
        loading ? (
          <Spinner />
        ) : (
          <section className="flex flex-col">
            {userTrips.map((trip: any, index: number) => {
              return (
                <button
                  key={index}
                  onClick={() => {
                    handleTripClick(index);
                  }}
                  className={
                    "group/tripsSection flex items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium hover:z-10 hover:bg-kolumblue-100 hover:shadow-kolumblueHover " +
                    (index == selectedTrip
                      ? "bg-kolumblue-200 fill-kolumblue-500 text-kolumblue-500 shadow-kolumblueSelected "
                      : " ")
                  }
                >
                  <DefaultTripSVG
                    className={
                      "h-4 w-4 duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem] group-hover/tripsSection:fill-kolumblue-500 " +
                      (index == selectedTrip
                        ? "fill-kolumblue-500"
                        : "fill-tintedGray-500 ")
                    }
                  />
                  <span className="duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem]">
                    {trip?.["trip_name"]}
                  </span>
                </button>
              );
            })}
          </section>
        )
      ) : (
        <div className="rounded-md bg-red-100 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}
    </section>
  );
}
