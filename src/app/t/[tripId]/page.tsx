import { api } from "~/trpc/server";
import TopNav from "./_components/top-nav";
import type { TripContext } from "~/lib/validations/trip";
import SidebarNav from "./_components/sidebar-nav";

export default async function Itinerary(props: { params: { tripId: string } }) {
  const myTrip = (await api.trip.getMy({ id: props.params.tripId })) as TripContext | undefined;
  if (!myTrip) return null;

  return (
    <div className="h-screen pl-20 pt-14">
      <TopNav trip={myTrip.trip} myMemberships={myTrip.myMemberships} />
      <SidebarNav tripId={myTrip.trip.id} tool={0} />
      Itinerary {props.params.tripId}
    </div>
  );
}
