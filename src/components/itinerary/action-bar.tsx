import { createContext, useContext } from "react";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";

import Input from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import DaysPicker from "@/components/ui/days-picker";
import Icon from "@/components/icons";

import { Trip, UT } from "@/types";

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
      }
    );
  };

  return (
    <ActionBarContext.Provider value={{ activeTrip }}>
      <section className="sticky left-0 top-0 z-30 flex w-full p-3">
        <div className="flex h-14 w-full items-center justify-between gap-5 rounded-lg border border-gray-100 bg-white/80 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
          <section className="flex h-full w-full items-center gap-2 overflow-x-auto pl-3">
            <Input
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

            {/* some things */}
            <Icon.x className="h-3 shrink-0" />
            <p className="shrink-0">view / edit</p>
          </section>

          <section className="flex flex-shrink-0 items-center gap-2 pr-5">
            <p>cost: $0</p>
            <DaysPicker maxTripsDays={90} />
            <DatePicker />
            {isSaving && <p>saving...</p>}
          </section>
        </div>
      </section>
    </ActionBarContext.Provider>
  );
}
