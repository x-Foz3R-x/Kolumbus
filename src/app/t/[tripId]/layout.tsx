import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";

import db from "~/server/db";
import { generateItinerary } from "~/lib/utils";
import { type PlaceSchema } from "~/lib/validations/place";

import { TripProvider } from "./_components/trip-provider";
import TopNav from "./_components/top-nav";
import SidebarNav from "./_components/sidebar-nav";

export async function generateMetadata({ params }: { params: { tripId: string } }) {
  const trip = await db.query.trips.findFirst({
    columns: { name: true },
    where: (trip, { eq }) => eq(trip.id, params.tripId),
  });

  return { title: trip?.name ?? "Unknown Trip" };
}

export default async function Layout(props: {
  params: { tripId: string };
  children: React.ReactNode;
}) {
  const user = auth();
  if (!user.userId) return props.children;

  const { events, ...tripData } = await api.trip.get({ id: props.params.tripId });
  const myMemberships = await api.membership.getMy();

  const trip = {
    ...tripData,
    itinerary: generateItinerary(
      tripData.startDate,
      tripData.endDate,
      events as unknown as PlaceSchema[],
    ),
  };

  return (
    <TripProvider userId={user.userId} trip={trip} myMemberships={myMemberships}>
      <TopNav />
      <SidebarNav tripId={props.params.tripId} />
      {props.children}
    </TripProvider>
  );
}
