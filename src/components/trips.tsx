"use client";

import { useRouter } from "next/navigation";
import cuid2 from "@paralleldrive/cuid2";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { useUser } from "@clerk/nextjs";

import { tripTemplate } from "@/data/template-data";
import { Trip, UT } from "@/types";
import Icon from "./icons";

export default function Trips({ tripId }: { tripId: string }) {
  const { user } = useUser();
  const { userTrips, dispatchUserTrips, setSaving } = useAppdata();
  const createTrip = api.trip.create.useMutation();

  const router = useRouter();

  const createNewTrip = () => {
    if (!user) return;

    const newTrip: Trip = { ...tripTemplate, id: cuid2.init({ length: 14 })(), userId: user?.id, position: userTrips.length };

    setSaving(true);
    dispatchUserTrips({ type: UT.CREATE_TRIP, trip: newTrip });
    createTrip.mutate(newTrip, {
      onSuccess(trip) {
        if (!trip) return;
        dispatchUserTrips({ type: UT.UPDATE_TRIP, trip });
      },
      onError(error) {
        console.error(error);
        dispatchUserTrips({ type: UT.REPLACE, userTrips });
      },
      onSettled() {
        setSaving(false);
      },
    });
  };

  const deleteTrip = () => {
    if (!user) return;

    const currentUserTrips: Trip[] = userTrips;
    const newTrips = [...userTrips];

    const tripIndex = newTrips.findIndex((trip) => trip.id === tripId);
    if (tripIndex === -1) return;

    newTrips.splice(tripIndex, 1);
    dispatchUserTrips({ type: UT.REPLACE, userTrips: newTrips });

    // api.trip.delete
    //   .useMutation({ tripId })
    //   .then((trip) => {
    //     if (!trip) return;
    //     dispatchUserTrips({ type: UT.UPDATE_TRIP, payload: { trip } });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     dispatchUserTrips({ type: UT.REPLACE, userTrips: currentUserTrips });
    //   });
  };

  return (
    <section className="relative flex flex-col">
      <p className="absolute -top-8 right-0 text-sm text-gray-400">[disk size in KB]</p>

      {userTrips?.map((trip: Trip, index: number) => (
        <div key={index} className="relative">
          <button
            onClick={() => router.push(`/t/${trip.id}`)}
            className={
              "group/tripsSection flex h-9 w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium hover:z-10 hover:bg-kolumblue-100 hover:shadow-kolumblueHover " +
              (trip.id === tripId && "bg-kolumblue-200 fill-kolumblue-500 text-kolumblue-500 shadow-kolumblueSelected")
            }
          >
            <Icon.defaultTrip
              className={
                "h-4 w-4 flex-none duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem] group-hover/tripsSection:fill-kolumblue-500 " +
                (trip.id !== tripId ? "fill-tintedGray-400 " : "fill-kolumblue-500 ")
              }
            />
            <p className="overflow-hidden text-ellipsis whitespace-nowrap duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem]">
              {trip.name}
            </p>
          </button>
          <span className="absolute right-3 top-1.5 z-10">
            <button onClick={deleteTrip} className="rounded-lg p-1.5 hover:bg-black/20">
              <Icon.x className="h-3 w-3" />
            </button>
          </span>
        </div>
      ))}

      <button
        onClick={createNewTrip}
        className="mt-1 flex h-9 items-center justify-center gap-1 rounded-md fill-gray-400 text-sm font-medium text-gray-400 duration-300 ease-kolumb-flow hover:bg-gray-100 hover:fill-gray-600 hover:text-gray-600"
      >
        <Icon.plus className="h-3 w-3" />
        <span>New trip</span>
      </button>
    </section>
  );
}
