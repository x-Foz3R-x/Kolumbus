import { api } from "~/trpc/server";
import TopNav from "./_components/top-nav";
import type { TripContext } from "~/lib/validations/trip";

export default async function Itinerary(props: { params: { tripId: string } }) {
  const myTrip = (await api.trip.getMy({ id: props.params.tripId })) as TripContext | undefined;
  if (!myTrip) return null;

  return (
    <div>
      <TopNav trip={myTrip.trip} myMemberships={myTrip.myMemberships} />
      Itinerary {props.params.tripId}
    </div>
  );
}
