import { api } from "~/trpc/server";
import type { TripContext } from "~/lib/validations/trip";
import { TripContextProvider } from "./_components/trip-context";

import TopNav from "./_components/top-nav";
import SidebarNav from "./_components/sidebar-nav";

export default async function Layout(props: {
  params: { tripId: string };
  children: React.ReactNode;
}) {
  const tripContext = (await api.trip.getMy({ id: props.params.tripId })) as
    | TripContext
    | undefined;
  if (!tripContext) return null;

  return (
    <TripContextProvider context={tripContext}>
      <TopNav />
      <SidebarNav tripId={props.params.tripId} />
      {props.children}
    </TripContextProvider>
  );
}
