"use client";

import useUserTrips from "@/hooks/use-user-trips";
import Icon from "./icons";
import { memo } from "react";

const Trips = memo(function T() {
  const {
    userTrips,
    selectedTrip,
    setSelectedTrip,
    tripsError,
    fetchMoreTrips,
  } = useUserTrips();

  const handleTripClick = (index: number) => {
    sessionStorage.setItem("selected_trip", index.toString());
    setSelectedTrip(index);
    fetchMoreTrips();
  };

  return (
    <section className="flex flex-col">
      {tripsError && (
        <div className="rounded-md bg-red-100 px-3 pt-6 text-center text-sm text-red-600">
          {tripsError}
        </div>
      )}

      {userTrips?.map((trip: any, index: number) => (
        <button
          key={index}
          onClick={() => {
            handleTripClick(index);
          }}
          className={
            "group/tripsSection flex h-9 items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium hover:z-10 hover:bg-kolumblue-100 hover:shadow-kolumblueHover " +
            (index == selectedTrip
              ? "bg-kolumblue-200 fill-kolumblue-500 text-kolumblue-500 shadow-kolumblueSelected "
              : " ")
          }
        >
          <Icon.defaultTrip
            className={
              "h-4 w-4 flex-none duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem] group-hover/tripsSection:fill-kolumblue-500 " +
              (index !== selectedTrip
                ? "fill-tintedGray-500 "
                : "fill-kolumblue-500 ")
            }
          />
          <span className="overflow-hidden text-ellipsis duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem]">
            {trip?.name}
          </span>
        </button>
      ))}
    </section>
  );
});

export default Trips;
