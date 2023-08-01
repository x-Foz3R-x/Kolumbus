"use client";

import useUserTrips from "@/hooks/use-user-trips";
import Icon from "./icons";
import { memo } from "react";
import useAppData from "@/context/app-data";
import { tripTemplate } from "@/config/template-data";
import { firebaseCreateTrip } from "@/hooks/use-firebase-operations";
import { useAuth } from "@/context/auth";
import { DocumentReference } from "firebase/firestore";
import { Trip, UT } from "@/types";
import { generateItinerary } from "@/lib/utils";

const Trips = memo(function T() {
  const { currentUser } = useAuth();
  const { selectedTrip, setSelectedTrip } = useAppData();
  const { dispatchUserTrips, userTrips, tripsError, fetchMoreTrips } = useUserTrips();

  const userTripSize = ((JSON.stringify(userTrips)?.length * 2) / 1024).toFixed(2) + " KB";

  const handleTripSelect = (index: number) => {
    sessionStorage.setItem("selected_trip", index.toString());
    setSelectedTrip(index);
    fetchMoreTrips();
  };

  const handleAddTrip = async () => {
    const _tripTemplate: Trip = { ...tripTemplate };
    _tripTemplate.position = userTrips.length;

    const { trip } = await firebaseCreateTrip(currentUser, _tripTemplate);
    trip.itinerary = generateItinerary(trip);

    if ("id" in trip) {
      // Successfully added the event
      dispatchUserTrips({
        type: UT.INSERT_TRIP,
        payload: { trip },
      });
      console.log(trip);
    } else {
      // Handle FirestoreError
      // todo toast error message here
      console.log("Error while adding trip");
      return;
    }
  };

  return (
    <section className="relative flex flex-col">
      {tripsError && (
        <p className="rounded-md bg-red-100 px-3 pt-6 text-center text-sm text-red-600">{tripsError}</p>
      )}

      <p className="absolute -top-8 right-0 text-sm text-kolumbGray-400">{userTripSize}</p>

      {userTrips?.map((trip: any, index: number) => (
        <button
          key={index}
          onClick={() => {
            handleTripSelect(index);
          }}
          className={
            "group/tripsSection flex h-9 items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium hover:z-10 hover:bg-kolumblue-100 hover:shadow-kolumblueHover " +
            (index === selectedTrip
              ? "bg-kolumblue-200 fill-kolumblue-500 text-kolumblue-500 shadow-kolumblueSelected "
              : " ")
          }
        >
          <Icon.defaultTrip
            className={
              "h-4 w-4 flex-none duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem] group-hover/tripsSection:fill-kolumblue-500 " +
              (index !== selectedTrip ? "fill-tintedGray-400 " : "fill-kolumblue-500 ")
            }
          />
          <p className="overflow-hidden text-ellipsis whitespace-nowrap duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem]">
            {trip?.display_name}
          </p>
        </button>
      ))}

      <button
        onClick={handleAddTrip}
        className="mt-1 flex h-9 items-center justify-center gap-1 rounded-md fill-kolumbGray-400 text-sm font-medium capitalize text-kolumbGray-400 duration-300 ease-kolumb-flow hover:bg-kolumbGray-100 hover:fill-kolumbGray-600 hover:text-kolumbGray-600"
      >
        <Icon.plus className="h-3 w-3" />
        <p>add trip</p>
      </button>
    </section>
  );
});

export default Trips;
