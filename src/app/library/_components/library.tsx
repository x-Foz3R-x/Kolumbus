"use client";

// import { createTrip as insertTrip } from "~/server/queries";
// import type { Trip } from "~/server/db/schema";

import Icon from "~/components/icons";
import { Progress } from "~/components/ui";
import TripCard from "./trip-card";
import { CreateTripModal } from "./create-trip-modal";
import { buildMembership, buildTrip } from "~/lib/templates";
import { createId } from "~/lib/db";
import type { MyMembership, MyRole } from "~/types";
import { createTrip } from "./actions";
import { useState } from "react";

export default function Library({
  tripMemberships,
  sharedTripMemberships,
  role,
}: {
  tripMemberships: MyMembership[];
  sharedTripMemberships: MyMembership[];
  role: MyRole;
}) {
  const [memberships, setMemberships] = useState(tripMemberships);
  const [sharedMemberships, setSharedMemberships] = useState(sharedTripMemberships);
  // const {
  //   isSaving,
  //   createTrip,
  //   duplicateTrip,
  //   leaveTrip,
  //   deleteTrip,
  // } = useLibraryContext();

  const handleCreate = async (name: string) => {
    const newTripPosition = memberships.length;

    const newTrip = buildTrip({ id: createId(10), name });
    const newMembership = buildMembership({
      userId: "",
      tripId: newTrip.id,
      tripPosition: newTripPosition,
      owner: true,
    });

    const newExtendedMembership: MyMembership = {
      ...newMembership,
      trip: {
        name: newTrip.name,
        startDate: newTrip.startDate,
        endDate: newTrip.endDate,
        image: newTrip.image,
        events: [],
        eventCount: 0,
      },
    };

    setMemberships([...memberships, newExtendedMembership]);

    await createTrip(newTrip, newTripPosition);
  };

  return (
    <main className="bg-gray-50 p-5 font-inter">
      {/* {isSaving && "saving..."} */}
      <div className="m-auto flex w-full max-w-screen-lg justify-between pb-5">
        <h1 className="inline-block text-xl font-semibold text-gray-400">Your Trips</h1>

        <Progress
          outsideLabel={{ left: "Trips", right: { type: "value/max" } }}
          value={memberships.length}
          max={role.membershipsLimit}
          levels={[{ level: 100, is: "==", className: { progressValue: "bg-red-400" } }]}
          className={{
            progress: "w-24 gap-0 text-[13px]",
            progressBar: "h-2",
            progressValue: "min-h-2 bg-gray-400",
            label: "text-gray-400",
          }}
        />
      </div>

      <div className="mx-auto grid w-full max-w-screen-lg grid-cols-[repeat(auto-fill,minmax(14.25rem,_14.25rem))] justify-center gap-x-4 gap-y-8 px-2 pb-8">
        {memberships.map((membership) => {
          const eventImagesRefs: string | null =
            membership.trip.events
              .map((event) => event.images?.[event.imageIndex])
              .filter(Boolean)
              .join(",") || null;
          const trip = { id: membership.tripId, eventImagesRefs, ...membership.trip };

          return (
            <TripCard
              key={membership.tripId}
              trip={trip}
              // onDelete={() => deleteTrip(trip.id)}
              // onDuplicate={() => duplicateTrip(trip.id)}
            />
          );
        })}

        {memberships.length > role.membershipsLimit ? null : (
          <CreateTripModal
            onCreate={handleCreate}
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
                    <rect
                      x="1"
                      y="1"
                      width="229px"
                      height="325px"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="8 8"
                      rx="12"
                    />
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
        {sharedMemberships.map((membership) => {
          const eventImagesRefs: string | null =
            membership.trip.events
              .map((event) => event.images?.[event.imageIndex])
              .filter(Boolean)
              .join(",") || null;
          const trip = { id: membership.tripId, eventImagesRefs, ...membership.trip };

          return (
            <TripCard
              key={membership.tripId}
              trip={trip}
              // onLeave={() => leaveTrip(trip.id)}
              shared
            />
          );
        })}
      </div>
    </main>
  );
}
