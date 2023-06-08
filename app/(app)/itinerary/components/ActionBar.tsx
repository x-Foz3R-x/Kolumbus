import useUserTrips from "@/hooks/api/use-user-trips";
import useSelectedTrip from "@/hooks/use-selected-trip";
import { ACTION } from "@/hooks/use-actions";

import DatePicker from "@/app/(app)/components/DatePicker";
import DaysPicker from "@/app/(app)/components/DaysPicker";

import SavedSVG from "@/assets/svg/Saved.svg";
import SavingSVG from "@/assets/svg/Saving.svg";

export default function ActionBar() {
  const { userTrips, dispatchUserTrips, loadingTrips } = useUserTrips();
  const [selectedTrip] = useSelectedTrip();

  const handleTripNameChange = (e: any) => {
    dispatchUserTrips({
      type: ACTION.UPDATE,
      trip: selectedTrip,
      field: "trip_name",
      payload: e.target.value,
    });
  };

  return loadingTrips ? (
    <></>
  ) : (
    <section className="sticky top-4 z-20 flex h-14 w-full items-center justify-between gap-4 rounded-lg bg-white/70 px-4 shadow-kolumblue backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
      <input
        type="text"
        placeholder="Untitled"
        spellCheck="false"
        value={userTrips[selectedTrip]["trip_name"]}
        onChange={handleTripNameChange}
        className="w-full bg-transparent px-2 py-1"
      />

      <section className="flex gap-2">
        <DatePicker />
        <DaysPicker maxTripsDays={365} />
        <SavedSVG className="h-9 w-9 fill-kolumblue-500" />
      </section>
    </section>
  );
}
