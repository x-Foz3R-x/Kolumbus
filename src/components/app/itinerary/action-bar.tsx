import useUserTrips from "@/hooks/use-user-trips";
import { UT } from "@/config/actions";

import DatePicker from "@/components/app/date-picker";
import DaysPicker from "@/components/app/days-picker";

import SavedSVG from "@/assets/svg/Saved.svg";
import SavingSVG from "@/assets/svg/Saving.svg";

export default function ActionBar() {
  const { userTrips, dispatchUserTrips, loadingTrips, selectedTrip } =
    useUserTrips();

  const handleTripNameChange = (e: any) => {
    dispatchUserTrips({
      type: UT.UPDATE_FIELD,
      payload: {
        regenerate: false,
        selectedTrip: selectedTrip,
        field: "name",
        value: e.target.value,
      },
    });
  };

  return (
    <section className="sticky top-5 z-20 mx-5 flex h-14 w-[calc(100%-2.5rem)] items-center justify-between gap-4 rounded-lg bg-white/70 px-5 shadow-kolumblue backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
      {!loadingTrips &&
        typeof userTrips[selectedTrip]?.name !== "undefined" && (
          <>
            <input
              type="text"
              placeholder="Untitled"
              spellCheck="false"
              value={userTrips[selectedTrip].name}
              onChange={handleTripNameChange}
              className="w-full bg-transparent px-2 py-1"
            />

            <section className="flex gap-2">
              <DatePicker />
              <DaysPicker maxTripsDays={90} />
              <SavedSVG className="h-9 w-9 fill-kolumblue-500" />
            </section>
          </>
        )}
    </section>
  );
}
