import { AppdataProvider } from "@/context/appdata";
import { currentUser } from "@clerk/nextjs";

import Header from "@/components/layouts/header";
import UnsupportedWidth from "@/components/layouts/unsupportedWidth";
import { prisma } from "@/lib/prisma";
import { GenerateItinerary } from "@/lib/utils";
import { Trip } from "@/types";

export default async function Layout({ children }: { children: React.ReactNode }) {
  // const user = await currentUser();

  // const trips = await prisma.trip.findMany({
  //   where: { userId: user?.id },
  //   orderBy: { position: "asc" },
  // });

  // for (let i = 0; i < trips.length; i++) {
  //   const trip = trips[i];

  //   const events = await prisma.event.findMany({
  //     where: { tripId: trip.id },
  //     orderBy: [{ position: "asc" }],
  //   });

  //   (trip as Trip).itinerary = GenerateItinerary(trip.id, trip.startDate, trip.endDate, events);
  // }

  // console.log(trips);

  return (
    <AppdataProvider>
      {/* <div className="supported-width bg-white font-inter"> */}
      <div className="bg-white font-inter">
        <Header />
        {children}
      </div>
      {/* <UnsupportedWidth /> */}
    </AppdataProvider>
  );
}
