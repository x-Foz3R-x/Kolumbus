"use client";

import Icon from "@/components/icons";
import TileLink from "@/components/tile-link";
import useAppdata from "@/context/appdata";

export default function Library() {
  const { userTrips, isLoading } = useAppdata();

  return (
    <main className="fixed inset-0 top-14 overflow-y-scroll bg-gray-50 bg-cover bg-center bg-no-repeat">
      <div className="mx-auto flex h-full max-w-5xl flex-col items-center gap-4 bg-white shadow-borderXl">
        <p className="text-center font-adso text-3xl font-bold text-gray-600">Library</p>
        <section className="grid w-full flex-col items-center justify-items-center gap-2 px-4">
          {userTrips.map((trip) => (
            <TileLink key={trip.id} link={`/t/${trip.id}`} label={trip.name}>
              <Icon.itinerary className="mb-[3px] mt-[9px] h-6 w-6 flex-none" />
            </TileLink>
          ))}
          {/* <TileLink link="" label="create trip">
            <Icon.itinerary className="mb-[3px] mt-[9px] h-6 w-6 flex-none" />
          </TileLink> */}
        </section>
      </div>
    </main>
  );
}
