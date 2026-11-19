"use client";

import { useState } from "react";
import useLibraryContext from "./library-provider";

import { CreateTripModal } from "~/components/create-trip-modal";
import TripCard from "./trip-card";
import NewTripCard from "./new-trip-card";

export default function MyTrips() {
  const { memberships, userType, loadingTripId, createTrip, duplicateTrip, leaveTrip, deleteTrip } =
    useLibraryContext();

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <section className="mx-auto max-w-screen-lg space-y-5 py-5">
      <h2 className="text-xl font-semibold text-gray-400">Your Trips</h2>

      <ul className="grid w-full grid-cols-[repeat(auto-fill,minmax(14.25rem,_14.25rem))] justify-center gap-x-4 gap-y-8">
        {memberships.map((membership) => {
          return (
            <TripCard
              key={membership.tripId}
              trip={membership.trip}
              onDuplicate={() => duplicateTrip(membership.tripId)}
              onLeave={() => leaveTrip(membership.tripId)}
              onDelete={() => deleteTrip(membership.tripId)}
              loading={loadingTripId === membership.tripId}
            />
          );
        })}

        {/* Create Trip Modal */}
        {memberships.length > userType.maxMemberships ? null : (
          <>
            <NewTripCard onClick={() => setModalOpen(true)} />

            <CreateTripModal
              isOpen={isModalOpen}
              setOpen={setModalOpen}
              maxDays={14}
              onCreate={createTrip}
            />
          </>
        )}
      </ul>
    </section>
  );
}
