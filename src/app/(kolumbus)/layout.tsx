import { serverApi } from "../_trpc/serverClient";
import { AppdataProvider } from "@/context/appdata";

import type { ServerTrip } from "@/server/routers/trip";
import type { Trip } from "@/types";

import Header from "@/components/layouts/header";
import UnsupportedWidth from "@/components/layouts/unsupportedWidth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  let trips: (Trip | ServerTrip)[] = (await serverApi.trip.getAllWithEvents()) ?? [];

  trips = trips?.map((trip) => {
    if (trip.startDate instanceof Date) trip.startDate = trip.startDate.toISOString();
    if (trip.endDate instanceof Date) trip.endDate = trip.endDate.toISOString();
    if (trip.updatedAt instanceof Date) trip.updatedAt = trip.updatedAt.toISOString();
    if (trip.createdAt instanceof Date) trip.createdAt = trip.createdAt.toISOString();

    return trip as Trip;
  });

  return (
    <AppdataProvider trips={trips as Trip[]}>
      {/* <div className="supported-width bg-white font-inter"> */}
      <div className="bg-white font-inter">
        <Header />
        {children}
      </div>
      {/* <UnsupportedWidth /> */}
    </AppdataProvider>
  );
}
