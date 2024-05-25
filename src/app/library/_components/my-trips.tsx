"use client";

import { useState } from "react";
import useLibraryContext from "./library-provider";

import TripCards from "./trip-cards";
import { CreateTripModal } from "~/components/create-trip-modal";
import { Button, Icons } from "~/components/ui";

export default function MyTrips() {
  const { memberships, userType, createTrip } = useLibraryContext();

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <section className="mx-auto max-w-screen-lg space-y-5 py-5">
      <h2 className="text-xl font-semibold text-gray-400">Your Trips</h2>

      <ul className="grid w-full grid-cols-[repeat(auto-fill,minmax(14.25rem,_14.25rem))] justify-center gap-x-4 gap-y-8">
        <TripCards memberships={memberships} />

        {/* Create Trip Modal */}
        {memberships.length > userType.maxMemberships ? null : (
          <>
            <Button
              onClick={() => setModalOpen(true)}
              variant="unset"
              size="unset"
              className="relative flex h-[20.25rem] items-center justify-center gap-1 rounded-xl fill-gray-400 stroke-gray-300 font-medium text-gray-400 duration-200 ease-kolumb-flow bg-stripes-60-gray-500/10 hover:fill-gray-600 hover:stroke-gray-500 hover:text-gray-600 hover:bg-stripes-60-gray-500/15"
            >
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
            </Button>

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
