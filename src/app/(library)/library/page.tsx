"use client";

import useLibraryContext from "@/context/library-provider";
import { ROLE_BASED_LIMITS } from "@/lib/config";

import Icon from "@/components/icons";
import { Progress } from "@/components/ui";
import { TripCard } from "@/components/trip-card";
import { CreateTripModal } from "@/components/create-trip-modal";

export default function Library() {
  const { tripMemberships, sharedTripMemberships, isLoading, isSaving, createTrip, duplicateTrip, leaveTrip, deleteTrip } =
    useLibraryContext();

  return (
    <main className="bg-gray-50 p-5 font-inter">
      {isSaving && "saving..."}
      <div className="m-auto flex w-full max-w-screen-lg justify-between pb-5">
        <h1 className="inline-block text-xl font-semibold text-gray-400">Your Trips</h1>

        {!isLoading && (
          <Progress
            outsideLabel={{ left: "Trips", right: { type: "value/max" } }}
            value={tripMemberships.length}
            max={ROLE_BASED_LIMITS["explorer"].membershipsLimit}
            levels={[{ level: 100, is: "==", className: { progressValue: "bg-red-400" } }]}
            className={{
              progress: "w-24 gap-0 text-[13px]",
              progressBar: "h-2",
              progressValue: "min-h-2 bg-gray-400",
              label: "text-gray-400",
            }}
          />
        )}
      </div>

      <div className="mx-auto grid w-full max-w-screen-lg grid-cols-[repeat(auto-fill,minmax(14.25rem,_14.25rem))] justify-center gap-x-4 gap-y-8 px-2 pb-8">
        {tripMemberships.map((membership) => {
          const eventPhotoRefs: string | null =
            membership.trip.events
              .map((event) => event.photos?.[event.photoIndex])
              .filter(Boolean)
              .join(",") || null;
          const trip = { id: membership.tripId, eventPhotoRefs, ...membership.trip };

          return (
            <TripCard key={membership.tripId} trip={trip} onDelete={() => deleteTrip(trip.id)} onDuplicate={() => duplicateTrip(trip.id)} />
          );
        })}

        {tripMemberships.length === ROLE_BASED_LIMITS["explorer"].membershipsLimit ? null : (
          <CreateTripModal
            onCreate={createTrip}
            buttonProps={{
              variant: "unset",
              size: "unset",
              className:
                "relative flex h-[20.25rem] items-center justify-center gap-1 rounded-xl fill-gray-400 stroke-gray-300 font-medium text-gray-400 duration-200 ease-kolumb-flow bg-stripes-60-gray-500/10 hover:fill-gray-600 hover:stroke-gray-400 hover:text-gray-600 hover:bg-stripes-60-gray-500/15",
              children: (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none absolute -left-px -top-px h-full w-full overflow-visible fill-transparent"
                  >
                    <rect x="1" y="1" width="229px" height="325px" strokeWidth="2" strokeLinecap="round" strokeDasharray="8 8" rx="12" />
                  </svg>
                  <Icon.plus className="w-2.5" />
                  New trip
                </>
              ),
            }}
          />
        )}
      </div>

      <div className="m-auto flex w-full max-w-screen-lg justify-between py-5">
        <h1 className="inline-block text-xl font-semibold text-gray-400">Shared with You</h1>
      </div>

      <div className="mx-auto grid w-full max-w-screen-lg grid-cols-[repeat(auto-fill,minmax(14.25rem,_14.25rem))] justify-center gap-x-4 gap-y-8 px-2 pb-8">
        {sharedTripMemberships.map((membership) => {
          const eventPhotoRefs: string | null =
            membership.trip.events
              .map((event) => event.photos?.[event.photoIndex])
              .filter(Boolean)
              .join(",") || null;
          const trip = { id: membership.tripId, eventPhotoRefs, ...membership.trip };

          return <TripCard key={membership.tripId} trip={trip} onLeave={() => leaveTrip(trip.id)} shared />;
        })}
      </div>
    </main>
  );
}
