"use client";

import useUserTripsInfo from "@/hooks/api/use-user-trips-info";
import useUserTrips from "@/hooks/api/use-user-trips";

import Spinner from "@/components/loading/spinner";
import DefaultTripSVG from "@/assets/svg/DefaultTrip.svg";

export default function Trips() {
  const {
    userTripsInfo,
    selectedTrip,
    setSelectedTrip,
    loadingTripsInfo,
    tripsError,
  } = useUserTripsInfo();
  const { fetchMoreTrips } = useUserTrips();

  const handleTripClick = (index: number) => {
    sessionStorage.setItem("selected_trip", index.toString());
    setSelectedTrip(index);
    fetchMoreTrips();
  };

  return (
    <section className="flex flex-col gap-2 px-3 pb-3">
      <h1 className="font-adso text-2xl font-bold text-tintedGray-500">
        Trips
      </h1>

      {tripsError && (
        <div className="rounded-md bg-red-100 p-3 text-center text-sm text-red-600">
          {tripsError}
        </div>
      )}

      {loadingTripsInfo ? (
        <Spinner />
      ) : (
        <section className="flex flex-col">
          {userTripsInfo?.map((trip: any, index: number) => {
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
                    "h-4 w-4 flex-none duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem] group-hover/tripsSection:fill-kolumblue-500 " +
                    (index != selectedTrip
                      ? "fill-tintedGray-500 "
                      : "fill-kolumblue-500 ")
                  }
                />
                <span className="overflow-hidden text-ellipsis duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem]">
                  {trip?.["trip_name"]}
                </span>
              </button>
            );
          })}
        </section>
      )}
    </section>
  );
}
