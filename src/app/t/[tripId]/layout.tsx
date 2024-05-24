import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import type { TripContextSchema } from "~/lib/validations/trip";
import { TripProvider } from "./_components/trip-provider";

import TopNav from "./_components/top-nav";
import SidebarNav from "./_components/sidebar-nav";
import db from "~/server/db";

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
  const tripContext = (await api.trip.getContext({ id: props.params.tripId })) as
    | TripContextSchema
    | undefined;
  if (!tripContext || !user.userId) return props.children;

  return (
    <TripProvider userId={user.userId} context={tripContext}>
      <TopNav />
      <SidebarNav tripId={props.params.tripId} />
      {props.children}
    </TripProvider>
  );
}
