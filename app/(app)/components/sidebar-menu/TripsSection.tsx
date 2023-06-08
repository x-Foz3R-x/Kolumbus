"use client";

// Importing necessary dependencies and custom hooks
import useUserTrips from "@/hooks/api/use-user-trips";
import useTripsEvents from "@/hooks/api/use-trips-events";
import useSelectedTrip from "@/hooks/use-selected-trip";

import Spinner from "@/components/loading-indicator/Spinner";
import DefaultTripSVG from "@/assets/svg/DefaultTrip.svg";

// TripsSection component
export default function TripsSection() {
  // Using custom hooks to fetch user trips and trips events
  const { userTrips, loadingTrips, tripsError } = useUserTrips();
  const { refetchEvents } = useTripsEvents();

  // Using the useSelectedTrip hook to get the selected trip
  const [selectedTrip, setSelectedTrip] = useSelectedTrip();

  // Function to handle trip selection
  const handleTripClick = (index: number) => {
    setSelectedTrip(index);
    sessionStorage.setItem("selected_trip", index.toString());
    refetchEvents();
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

      {loadingTrips ? (
        <Spinner />
      ) : (
        <section className="flex flex-col">
          {userTrips?.map((trip: any, index: number) => {
            return (
              // Rendering each trip as a button
              <button
                key={index}
                onClick={() => {
                  handleTripClick(index);
                }}
                className={
                  // Styling the trip button based on the selected state
                  "group/tripsSection flex items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium hover:z-10 hover:bg-kolumblue-100 hover:shadow-kolumblueHover " +
                  (index == selectedTrip
                    ? "bg-kolumblue-200 fill-kolumblue-500 text-kolumblue-500 shadow-kolumblueSelected "
                    : " ")
                }
              >
                <DefaultTripSVG
                  className={
                    // Styling the trip SVG icon based on the selected state
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
