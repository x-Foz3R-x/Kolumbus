"use client";

import { useUser } from "@clerk/nextjs";
import cuid2 from "@paralleldrive/cuid2";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { USER_ROLE } from "@/lib/config";
import { tripTemplate } from "@/data/template-data";
import { Trip, UT } from "@/types";

import Icon from "@/components/icons";
import { Progress } from "@/components/ui";
import { CreateTripModal } from "@/components/create-trip-modal";
import { TripCard } from "@/components/trip-card";

export default function Library() {
  const { user } = useUser();
  const { userTrips, dispatchUserTrips } = useAppdata();
  const createTrip = api.trip.create.useMutation();

  const createNewTrip = (name: string) => {
    if (!user) return;

    const trips = [...userTrips];
    const newTrip: Trip = {
      ...tripTemplate,
      id: cuid2.init({ length: 14 })(),
      userId: user?.id,
      position: userTrips.length,
      ...(name.length > 0 && { name }),
    };

    dispatchUserTrips({ type: UT.CREATE_TRIP, trip: newTrip });
    createTrip.mutate(newTrip, {
      onSuccess(trip) {
        if (!trip) return;
        dispatchUserTrips({ type: UT.UPDATE_TRIP, trip });
      },
      onError(error) {
        console.error(error);
        dispatchUserTrips({ type: UT.REPLACE, trips });
      },
    });
  };

  return (
    <main className="bg-gray-50 p-5 font-inter">
      <div className="m-auto flex w-full max-w-screen-lg justify-between px-5 pb-5">
        <h1 className="inline-block text-xl font-semibold text-gray-400">Your Trips</h1>

        <Progress
          outsideLabel={{ left: "Trips", right: { type: "value/max" } }}
          value={userTrips.length}
          max={USER_ROLE.TRIPS_LIMIT}
          levels={[{ level: 100, is: "==", className: { progressValue: "min-h-2 bg-red-400" } }]}
          className={{
            progress: "w-24 gap-0 text-[13px]",
            progressBar: "h-2",
            progressValue: "min-h-2 bg-gray-400",
            label: "text-gray-400",
          }}
        />
      </div>

      <div className="m-auto grid w-full max-w-screen-lg grid-cols-[repeat(auto-fit,minmax(14.25rem,_14.25rem))] justify-center gap-x-4 gap-y-6">
        {userTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} userTrips={userTrips} dispatchUserTrips={dispatchUserTrips} />
        ))}

        {userTrips.length === USER_ROLE.TRIPS_LIMIT ? null : (
          <CreateTripModal
            onCreate={createNewTrip}
            buttonProps={{
              variant: "unset",
              size: "unset",
              className:
                "group relative flex h-[20.25rem] items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 fill-gray-400 font-medium text-gray-400 duration-150 ease-kolumb-flow hover:border-gray-500 hover:fill-gray-600 hover:text-gray-600",
              children: (
                <>
                  <Icon.plus className="w-2.5" />
                  New trip
                </>
              ),
            }}
          />
        )}
      </div>
    </main>
  );
}
