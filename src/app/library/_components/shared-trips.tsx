"use client";

import useLibraryContext from "./library-provider";
import TripCard from "./trip-card";

export default function SharedTrips() {
  const { sharedMemberships, loadingTripId, duplicateTrip, leaveTrip, deleteTrip } =
    useLibraryContext();

  if (!sharedMemberships.length) return null;

  return (
    <section className="mx-auto max-w-screen-lg space-y-5 py-5">
      <h2 className="text-xl font-semibold text-gray-400">Shared with You</h2>

      <ul className="grid w-full grid-cols-[repeat(auto-fill,minmax(14.25rem,_14.25rem))] justify-center gap-x-4 gap-y-8 px-2">
        {sharedMemberships.map((membership) => {
          return (
            <TripCard
              key={membership.tripId}
              trip={membership.trip}
              onDuplicate={() => duplicateTrip(membership.tripId)}
              onLeave={() => leaveTrip(membership.tripId)}
              onDelete={() => deleteTrip(membership.tripId)}
              loading={loadingTripId === membership.tripId}
              shared
            />
          );
        })}
      </ul>
    </section>
  );
}
