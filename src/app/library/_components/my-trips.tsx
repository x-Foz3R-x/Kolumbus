"use client";

import { Icons } from "~/components/ui";
import { CreateTripModal } from "./create-trip-modal";
import useLibraryContext from "./provider";
import TripCards from "./trip-cards";

export default function MyTrips() {
  const { memberships, userRoleLimits, createTrip } = useLibraryContext();

  return (
    <section className="mx-auto max-w-screen-lg space-y-5 py-5">
      <h2 className="text-xl font-semibold text-gray-400">Your Trips</h2>

      <ul className="grid w-full grid-cols-[repeat(auto-fill,minmax(14.25rem,_14.25rem))] justify-center gap-x-4 gap-y-8">
        <TripCards memberships={memberships} />

        {/* Create Trip Modal */}
        {memberships.length > userRoleLimits.membershipsLimit ? null : (
          <CreateTripModal
            onCreate={createTrip}
            buttonProps={{
              variant: "unset",
              size: "unset",
              className:
                "relative flex h-[20.25rem] items-center justify-center gap-1 rounded-xl fill-gray-400 stroke-gray-300 font-medium text-gray-400 duration-200 ease-kolumb-flow bg-stripes-60-gray-500/10 hover:fill-gray-600 hover:stroke-gray-500 hover:text-gray-600 hover:bg-stripes-60-gray-500/15",
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
                  <Icons.plus className="w-2.5" />
                  New trip
                </>
              ),
            }}
          />
        )}
      </ul>
    </section>
  );
}
