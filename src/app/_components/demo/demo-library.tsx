"use client";

import { useState } from "react";
import Brand from "~/components/brand";
import { CreateTripModal } from "~/components/create-trip-modal";
import TripCard from "~/app/library/_components/trip-card";
import NewTripCard from "~/app/library/_components/new-trip-card";
import { Button } from "~/components/ui";
import { DEMO_LIMITS, type DemoTrip, type DemoTripDefinition } from "./use-demo-library";

export default function DemoLibrary(props: {
  trips: DemoTrip[];
  onOpen: (id: string) => void;
  onCreate: (details: DemoTripDefinition) => void;
  onExample: () => void;
  onDuplicate: (trip: DemoTrip) => void;
  onDelete: (id: string) => void;
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const canCreate = props.trips.length < DEMO_LIMITS.trips;

  return (
    <>
      <header className="flex min-h-14 shrink-0 items-center justify-between gap-4 border-b border-gray-100 bg-white px-5">
        <Brand className="text-lg [&_svg]:size-7" />
        <div className="flex items-center gap-3">
          <span className="font-belanosima text-base text-gray-700">Library</span>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-auto bg-gray-50 px-5">
        <section
          className="mx-auto max-w-screen-lg space-y-5 py-5"
          aria-labelledby="demo-library-heading"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id="demo-library-heading" className="text-xl font-semibold text-gray-400">
              Your Trips
            </h3>
            <p className="text-[11px] text-gray-400">
              {props.trips.length} / {DEMO_LIMITS.trips} local trips
            </p>
          </div>
          <ul className="grid w-full grid-cols-[repeat(auto-fill,minmax(14.25rem,14.25rem))] justify-center gap-x-4 gap-y-8 pb-4">
            {props.trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={{
                  ...trip,
                  eventCount: trip.itinerary.reduce((count, day) => count + day.places.length, 0),
                }}
                onOpen={() => props.onOpen(trip.id)}
                onDuplicate={canCreate ? () => props.onDuplicate(trip) : undefined}
                onDelete={() => props.onDelete(trip.id)}
                showShare={false}
              />
            ))}
            {canCreate && <NewTripCard onClick={() => setCreateOpen(true)} />}
          </ul>
          {!props.trips.length && (
            <div className="pb-5 text-center text-xs text-gray-500">
              <p>A new adventure starts here.</p>
              <Button
                onClick={props.onExample}
                size="sm"
                className="mt-2 bg-transparent text-kolumblue-600"
              >
                Open the example trip
              </Button>
            </div>
          )}
          {!canCreate && (
            <p className="pb-4 text-xs text-gray-400">
              The demo holds {DEMO_LIMITS.trips} trips. Delete a trip to make room for another.
            </p>
          )}
        </section>
      </div>
      <CreateTripModal
        isOpen={createOpen}
        setOpen={setCreateOpen}
        maxDays={DEMO_LIMITS.days}
        returnFocus={false}
        onCreate={(name, startDate, endDate) => props.onCreate({ name, startDate, endDate })}
      />
    </>
  );
}
