import DatePicker from "@/app/(app)/components/DatePicker";
import DaysPicker from "@/app/(app)/components/DaysPicker";
import DaysPicker2 from "@/app/(app)/components/DaysPicker copy";

import SavedSVG from "@/assets/svg/Saved.svg";
import SavingSVG from "@/assets/svg/Saving.svg";

export default function ActionBar() {
  return (
    <section className="sticky top-4 z-20 flex h-14 w-full items-center justify-between gap-4 rounded-lg bg-white/70 px-4 shadow-kolumblue backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
      <input
        type="text"
        placeholder="Untitled"
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
