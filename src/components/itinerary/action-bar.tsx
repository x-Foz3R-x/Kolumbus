import useAppdata from "@/context/appdata";

import Input from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import DaysPicker from "@/components/ui/days-picker";
import Icon from "@/components/icons";

import { UT } from "@/types";
import api from "@/app/_trpc/client";
import ActionBarSkeleton from "../loading/actionBarSkeleton";

export default function ActionBar() {
  const { userTrips, dispatchUserTrips, selectedTrip, isLoading } = useAppdata();
  const updateTrip = api.trip.update.useMutation();

  const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const trip = userTrips[selectedTrip];
    trip.name = e.target.value;

    updateTrip.mutate({ tripId: userTrips[selectedTrip].id, data: { name: e.target.value } });
    dispatchUserTrips({ type: UT.REPLACE, userTrips: [...userTrips] });
  };

  return (
    <section className="sticky top-0 z-30 flex w-full p-3">
      <div className="flex h-14 w-full items-center justify-between gap-5 rounded-lg border border-gray-100 bg-white/80 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
        {!isLoading ? (
          <>
            <section className="flex h-full w-full items-center gap-2 overflow-x-auto pl-3">
              <Input
                id="Trip-name"
                type="text"
                value={userTrips[selectedTrip]?.name}
                onChange={handleChange}
                spellCheck="false"
                variant="unstyled"
                textWidth
                preventEmpty
                className="h-8 cursor-pointer rounded bg-transparent px-2 py-1 duration-300 ease-kolumb-flow hover:bg-black/5 hover:shadow-soft focus:cursor-text focus:bg-white focus:shadow-focus"
              />

              {/* some things */}
              <Icon.x className="h-3 shrink-0" />
              <p className="shrink-0">view / edit</p>
            </section>

            <section className="flex flex-shrink-0 items-center gap-2 pr-5">
              <DatePicker />
              <DaysPicker maxTripsDays={90} />
            </section>
          </>
        ) : (
          <ActionBarSkeleton />
        )}
      </div>
    </section>
  );
}
