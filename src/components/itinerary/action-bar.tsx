"use client";

import { createContext, useContext, useState } from "react";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { Trip, UT } from "@/types";

import Icon from "@/components/icons";
import DatePicker from "@/components/ui/date-picker";
import DaysPicker from "@/components/ui/days-picker";
import { Button, Input } from "../ui";

const ActionBarContext = createContext<{
  activeTrip: Trip;
} | null>(null);
export function useActionBarContext() {
  const context = useContext(ActionBarContext);
  if (!context) throw new Error("useActionBarContext must be used within a ActionBarContext.Provider");
  return context;
}

export default function ActionBar({ activeTrip }: { activeTrip: Trip }) {
  const { dispatchUserTrips, isSaving, setSaving } = useAppdata();
  const updateTrip = api.trip.update.useMutation();

  const [tripName, setTripName] = useState(activeTrip.name);

  const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const trip = { ...activeTrip, name: e.target.value };

    setSaving(true);

    dispatchUserTrips({ type: UT.UPDATE_TRIP, trip });
    updateTrip.mutate(
      { tripId: activeTrip.id, data: { name: e.target.value } },
      {
        onSuccess(updatedTrip) {
          if (!updatedTrip) return;
          dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: { ...trip, updatedAt: updatedTrip.updatedAt } });
        },
        onError(error) {
          console.error(error);
          dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: activeTrip });
        },
        onSettled: () => setSaving(false),
      },
    );
  };

  return (
    <ActionBarContext.Provider value={{ activeTrip }}>
      <section className="sticky left-0 right-0 top-14 z-[30] flex w-full min-w-min pb-3 pl-3 pr-6 font-inter">
        <div className="flex h-14 w-full items-center justify-between gap-5 rounded-lg border border-gray-100 bg-white/80 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
          <div className="flex h-full w-full items-center gap-1.5 overflow-x-auto pl-3">
            <Input
              id="Trip-name"
              type="text"
              value={tripName}
              onChange={handleChange}
              onInput={(e) => setTripName(e.currentTarget.value)}
              spellCheck="false"
              variant="unstyled"
              size="unstyled"
              dynamicWidth
              preventEmpty
              className="h-8 cursor-pointer rounded bg-transparent px-2 py-1 duration-300 ease-kolumb-flow hover:bg-black/5 hover:shadow-soft focus:cursor-text focus:bg-white focus:shadow-focus"
            />

            <Button
              variant="button"
              size="icon"
              whileTap={{ scale: 0.98 }}
              onClick={() => navigator.clipboard.writeText(tripName)}
              className="flex w-8 items-center justify-center rounded bg-black/5"
            >
              <Icon.copy className="h-4 shrink-0 fill-gray-800" />
            </Button>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2 pr-5">
            {isSaving && <p>saving...</p>}

            <DaysPicker maxTripsDays={30} />
            <DatePicker />
          </div>
        </div>
      </section>
    </ActionBarContext.Provider>
  );
}
