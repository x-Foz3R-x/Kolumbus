"use client";

import { useMemo, useState } from "react";
import { FloatingDelayGroup } from "@floating-ui/react";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata-provider";
import { calculateDays } from "@/lib/utils";
import { Trip, UT } from "@/types";

import Icon from "../icons";
import Portal from "../portal";
import { Input, Spinner } from "../ui";
import DaysPicker from "./days-picker";
import DatePicker from "./date-picker";
import { TripInfo } from "./trip-info";
import { LANGUAGE } from "@/lib/config";

type ActionBarProps = {
  activeTrip: Trip;
  isSaving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ActionBar({ activeTrip, isSaving, setSaving }: ActionBarProps) {
  const { dispatchUserTrips } = useAppdata();
  const updateTrip = api.trips.update.useMutation();

  const [tripName, setTripName] = useState(activeTrip.name);

  const days = useMemo(() => calculateDays(activeTrip.startDate, activeTrip.endDate), [activeTrip.startDate, activeTrip.endDate]);

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
    <Portal>
      <section id="action-bar" className="fixed left-56 right-0 top-14 z-50 flex min-w-min pr-3 font-inter">
        <div className="flex h-14 w-full items-center justify-between gap-3 rounded-lg border border-gray-100 bg-white/80 px-3 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
          <div className="flex h-full flex-shrink-0 items-center gap-2">
            <Input
              id="Trip-name"
              type="text"
              value={tripName}
              onChange={handleChange}
              onInput={(e) => setTripName(e.currentTarget.value)}
              spellCheck="false"
              variant="unset"
              size="unset"
              dynamicWidth
              preventEmpty
              className="h-8 cursor-pointer rounded bg-transparent px-2 py-1 duration-300 ease-kolumb-flow hover:bg-black/5 hover:shadow-soft focus:cursor-text focus:bg-white focus:shadow-focus"
            />

            <TripInfo activeTrip={activeTrip} />
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            {isSaving && (
              <div className="flex h-full flex-col items-center justify-end text-sm leading-tight">
                <Spinner size="sm" />
                saving
              </div>
            )}

            <div id="trash-container" />

            <FloatingDelayGroup delay={{ open: 600 }} timeoutMs={300}>
              <DaysPicker
                activeTrip={activeTrip}
                days={days}
                buttonProps={{
                  variant: "unset",
                  size: "unset",
                  className: "relative h-[38px] w-9",
                  tooltip: { placement: "bottom", offset: 8, arrow: true, focus: { enabled: false }, zIndex: 50, children: "Days Picker" },
                  children: (
                    <>
                      <Icon.calendar className="h-full w-full fill-kolumblue-500" />

                      <div className="absolute inset-0 flex flex-col items-center justify-between pb-0.5 pt-[5px]">
                        <span className="text-[10px] font-medium uppercase leading-[13px] tracking-tight text-white">days</span>
                        <span className="text-sm leading-[18px]">{days}</span>
                      </div>
                    </>
                  ),
                }}
              />

              <DatePicker
                activeTrip={activeTrip}
                buttonProps={{
                  variant: "unset",
                  size: "unset",
                  className: "relative h-[38px] w-[82px]",
                  tooltip: {
                    placement: "bottom",
                    offset: 8,
                    arrow: true,
                    focus: { enabled: false },
                    zIndex: 50,
                    children: "Date Picker",
                  },
                  children: (
                    <>
                      <Icon.rangeCalendar className="h-full w-full fill-kolumblue-500" />
                      <div className="absolute inset-y-0 left-0 flex w-[35px] flex-col items-center justify-between pb-0.5 pt-[5px] leading-none">
                        <span className="text-[10px] font-medium uppercase leading-[13px] tracking-tight text-white">
                          {new Date(activeTrip.startDate).toLocaleString(LANGUAGE, { month: "short" }).toUpperCase()}
                        </span>
                        <span className="text-sm leading-[18px]">{new Date(activeTrip.startDate).getDate()}</span>
                      </div>

                      <div className="absolute inset-y-0 right-0 flex w-[35px] flex-col items-center justify-between pb-0.5 pt-[5px] leading-none">
                        <span className="text-[10px] font-medium uppercase leading-[13px] tracking-tight text-white">
                          {new Date(activeTrip.endDate).toLocaleString(LANGUAGE, { month: "short" }).toUpperCase()}
                        </span>
                        <span className="text-sm leading-[18px]">{new Date(activeTrip.endDate).getDate()}</span>
                      </div>
                    </>
                  ),
                }}
              />
            </FloatingDelayGroup>
          </div>
        </div>
      </section>
    </Portal>
  );
}
