import useUserTripsInfo from "@/hooks/api/use-user-trips-info";
import useSelectedTrip from "@/hooks/use-selected-trip";

import { ACTIONS } from "@/lib/utils";

import DatePicker from "@/components/app/date-picker";
import DaysPicker from "@/components/app/days-picker";

import SavedSVG from "@/assets/svg/Saved.svg";
import SavingSVG from "@/assets/svg/Saving.svg";

export default function ActionBar() {
  const { userTripsInfo, dispatchUserTripsInfo, loadingTripsInfo } =
    useUserTripsInfo();
  const [selectedTrip] = useSelectedTrip();

  const handleTripNameChange = (e: any) => {
    dispatchUserTripsInfo({
      type: ACTIONS.UPDATE,
      trip: selectedTrip,
      field: "trip_name",
      payload: e.target.value,
    });
  };

  return loadingTripsInfo ? (
    <></>
  ) : (
    <section className="sticky top-5 z-20 mx-5 flex h-14 w-[calc(100%-2.5rem)] items-center justify-between gap-4 rounded-lg bg-white/70 px-4 shadow-kolumblue backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
      <input
        type="text"
        placeholder="Untitled"
        spellCheck="false"
        value={userTripsInfo[selectedTrip]["trip_name"]}
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
