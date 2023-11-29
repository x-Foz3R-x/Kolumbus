import { createContext, useContext } from "react";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";

import { StatelessInput } from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import DaysPicker from "@/components/ui/days-picker";
import Icon from "@/components/icons";

import { Trip, UT } from "@/types";
import Button from "../ui/button";

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

  /**
   * Handles the change event of the input element and updates the active trip name.
   * @param e - The focus event of the input element.
   */
  const handleChange = (e: React.FocusEvent<HTMLInputElement>): void => {
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
        onSettled() {
          setSaving(false);
        },
      },
    );
  };

  return (
    <ActionBarContext.Provider value={{ activeTrip }}>
      <section className="sticky left-0 right-0 top-0 z-[999] flex w-full min-w-min pb-3 pl-3 pr-6">
        <div className="flex h-14 w-full items-center justify-between gap-5 rounded-lg border border-gray-100 bg-white/80 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
          <section className="flex h-full w-full items-center gap-1.5 overflow-x-auto pl-3">
            <StatelessInput
              id="Trip-name"
              type="text"
              value={activeTrip.name}
              onChange={handleChange}
              spellCheck="false"
              variant="unstyled"
              dynamicWidth
              preventEmpty
              className="h-8 cursor-pointer rounded bg-transparent px-2 py-1 duration-300 ease-kolumb-flow hover:bg-black/5 hover:shadow-soft focus:cursor-text focus:bg-white focus:shadow-focus"
            />

            <Button
              variant="button"
              size="icon"
              whileTap={{ scale: 0.98 }}
              onClick={() => navigator.clipboard.writeText(activeTrip.name)}
              className="flex w-8 items-center justify-center rounded bg-black/5"
            >
              <Icon.copy className="h-4 shrink-0 fill-gray-800" />
            </Button>
          </section>

          <section className="flex flex-shrink-0 items-center gap-2 pr-5">
            {/* <p>cost: unavailable</p> */}
            <DaysPicker maxTripsDays={90} />
            <DatePicker />
            {isSaving && <p>saving...</p>}
          </section>
        </div>
      </section>
    </ActionBarContext.Provider>
  );
}
