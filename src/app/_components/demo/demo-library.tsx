"use client";

import { useState } from "react";
import { format } from "date-fns";

import { Button, Icons } from "~/components/ui";
import { differenceInDays } from "~/lib/utils";
import type { DemoTrip } from "./use-demo-library";

export default function DemoLibrary(props: {
  trips: DemoTrip[];
  onOpen: (id: string) => void;
  onCreate: (template?: number) => void;
  onDuplicate: (trip: DemoTrip) => void;
  onDelete: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);

  return (
    <div className="p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-belanosima text-2xl font-semibold text-gray-700">Your library</h3>
          <p className="mt-1 text-xs text-gray-500">
            A home for your next adventures, saved in this browser.
          </p>
        </div>
        <Button
          onClick={() => props.onCreate()}
          className="flex items-center gap-2 bg-kolumblue-500 text-white"
          size="sm"
        >
          <Icons.plus className="size-3 fill-white" /> New trip
        </Button>
      </div>

      {props.trips.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 p-6 text-center">
          <Icons.library className="size-10 fill-kolumblue-400" />
          <h4 className="font-belanosima text-xl">Where shall we go?</h4>
          <p className="max-w-64 text-sm text-gray-500">
            Start with a blank trip or explore a ready-made plan for Kraków.
          </p>
          <Button onClick={() => props.onCreate(0)} size="sm">
            Open example trip
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {props.trips.map((trip) => (
            <li
              key={trip.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <button
                onClick={() => props.onOpen(trip.id)}
                className="group block w-full text-left focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-kolumblue-400"
              >
                <div className="relative flex h-28 items-center justify-center overflow-hidden bg-kolumblue-100">
                  <Icons.defaultTrip className="h-24 w-36 opacity-80 transition-transform duration-300 group-hover:scale-110" />
                  <span className="absolute bottom-2 right-2 rounded-md bg-white/90 px-2 py-1 text-[11px] text-gray-600">
                    {differenceInDays(trip.startDate, trip.endDate, true)} days
                  </span>
                </div>
                <div className="px-4 pb-3 pt-4">
                  <h4 className="truncate font-semibold text-gray-700">{trip.name}</h4>
                  <p className="mt-1 text-xs text-gray-500">
                    {format(new Date(trip.startDate), "d MMM")} –{" "}
                    {format(new Date(trip.endDate), "d MMM yyyy")}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {trip.itinerary.flatMap((day) => day.places).length}{" "}
                    {trip.itinerary.flatMap((day) => day.places).length === 1 ? "place" : "places"}{" "}
                    to discover
                  </p>
                </div>
              </button>
              <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-3 py-2">
                {deleting === trip.id ? (
                  <>
                    <Button size="sm" onClick={() => setDeleting(null)}>
                      Keep trip
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-50 text-red-600"
                      onClick={() => {
                        props.onDelete(trip.id);
                        setDeleting(null);
                      }}
                    >
                      Delete trip
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={() => props.onDuplicate(trip)}
                      aria-label={`Duplicate ${trip.name}`}
                      className="flex items-center gap-1.5 bg-transparent text-gray-500"
                    >
                      <Icons.duplicate className="size-3 fill-current" /> Duplicate
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setDeleting(trip.id)}
                      aria-label={`Delete ${trip.name}`}
                      className="bg-transparent text-gray-400 hover:text-red-500"
                    >
                      <Icons.trash className="size-3 fill-current" />
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
