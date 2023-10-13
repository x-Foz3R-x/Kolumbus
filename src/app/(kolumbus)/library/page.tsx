"use client";

import cuid2 from "@paralleldrive/cuid2";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { useUser } from "@clerk/nextjs";

import { tripTemplate } from "@/data/template-data";
import { Trip, UT } from "@/types";

import Icon from "@/components/icons";
import TileLink from "@/components/tile-link";

export default function Library() {
  const { user } = useUser();
  const createTrip = api.trip.create.useMutation();
  const { userTrips, dispatchUserTrips, isLoading } = useAppdata();

  const createNewTrip = () => {
    if (!user) return;

    const currentUserTrips: Trip[] = userTrips;
    const newTrip: Trip = { ...tripTemplate, id: cuid2.init({ length: 14 })(), userId: user?.id, position: userTrips.length };

    dispatchUserTrips({ type: UT.CREATE_TRIP, payload: { trip: newTrip } });
    createTrip.mutate(newTrip, {
      onSuccess(trip) {
        if (!trip) return;
        dispatchUserTrips({ type: UT.UPDATE_TRIP, payload: { trip } });
      },
      onError(error) {
        console.error(error);
        dispatchUserTrips({ type: UT.REPLACE, userTrips: currentUserTrips });
      },
    });
  };

  return (
    <main className="fixed inset-0 top-14 overflow-y-scroll bg-gray-50 bg-cover bg-center bg-no-repeat">
      <div className="mx-auto flex h-full max-w-5xl flex-col items-center gap-4 bg-white shadow-borderXl">
        <div className="text-center font-adso text-3xl font-bold text-gray-600">
          Library
          <button
            onClick={createNewTrip}
            className="flex items-center justify-center gap-2 rounded-md fill-gray-400 p-1 font-inter text-base font-medium text-gray-400 duration-300 ease-kolumb-flow hover:bg-gray-100 hover:fill-gray-600 hover:text-gray-600"
          >
            <Icon.plus className="h-3 w-3" />
            <span>New trip</span>
          </button>
        </div>
        <section className="grid w-full flex-col items-center justify-items-center gap-2 px-4">
          {userTrips?.map((trip) => (
            <TileLink key={trip.id} link={`/t/${trip.id}`} label={trip.name}>
              <Icon.itinerary className="mb-[3px] mt-[9px] h-6 w-6 flex-none" />
            </TileLink>
          ))}
        </section>
      </div>
    </main>
  );
}
