import useAppData from "@/context/app-data";
import useUserTrips from "@/hooks/use-user-trips";
import { Key, UT } from "@/types";

import DatePicker from "@/components/app/date-picker";
import DaysPicker from "@/components/app/days-picker";

// import SavedSVG from "@/assets/svg/Saved.svg";
// import SavingSVG from "@/assets/svg/Saving.svg";
import useKeyPress from "@/hooks/use-key-press";
import { useEffect, useRef, useState } from "react";
import { firebaseUpdateTrip } from "@/hooks/use-firebase-operations";
import Icon from "@/components/icons";

export default function ActionBar() {
  const { selectedTrip } = useAppData();
  const { userTrips, dispatchUserTrips, loadingTrips } = useUserTrips();

  const [displayName, setDisplayName] = useState<string>("");
  const [tripSize, setTripSize] = useState(0);

  useEffect(() => {
    if (!loadingTrips) setDisplayName(userTrips[selectedTrip]?.display_name || "");
  }, [selectedTrip, userTrips, loadingTrips]);

  useEffect(() => {
    setTripSize(Number(((JSON.stringify(userTrips[selectedTrip])?.length * 2) / 1024).toFixed(2)));
  }, [userTrips, selectedTrip]);

  const ref = useRef<HTMLInputElement | null>(null);
  const enterPressed = useKeyPress(Key.Enter);
  useEffect(() => {
    if (enterPressed && document.activeElement === ref.current) ref.current!.blur();
  }, [enterPressed]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value);

  const handleInputUpdate = async (e: React.FocusEvent<HTMLInputElement>) => {
    const trip = userTrips[selectedTrip];
    trip.display_name = e.target.value;
    trip.metadata.updated_at = Date.now();

    firebaseUpdateTrip(trip);
    dispatchUserTrips({
      type: UT.UPDATE_FIELD,
      payload: {
        regenerate: false,
        selectedTrip: selectedTrip,
        field: "display_name",
        value: e.target.value,
      },
    });
  };

  return (
    <section className="sticky top-3 z-30 mx-3 flex h-14 w-[calc(100%-1.5rem)] items-center justify-between gap-5 rounded-lg border border-gray-100 bg-white/80 px-5 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
      {!loadingTrips && (
        <>
          <input
            ref={ref}
            type="text"
            value={displayName}
            onChange={handleInputChange}
            onBlur={handleInputUpdate}
            placeholder="Untitled"
            spellCheck="false"
            className="w-full bg-transparent px-2 py-1"
          />

          <section className="flex items-center gap-2">
            <p className="w-fit whitespace-nowrap text-sm">{tripSize} KB</p>
            <DatePicker />
            <DaysPicker maxTripsDays={90} />
            <Icon.x className="h-9 w-9 fill-kolumblue-500" />
          </section>
        </>
      )}
    </section>
  );
}
