import useLibraryContext from "./provider";
import type { MyMembership } from "~/types";

import TripCard from "./trip-card";

export default function TripCards(props: { memberships: MyMembership[]; shared?: boolean }) {
  const { loadingTripId, duplicateTrip, deleteTrip } = useLibraryContext();

  return props.memberships.map((membership) => {
    const eventImagesRefs: string | null =
      membership.trip.events
        .map((event) => event.images?.[event.imageIndex])
        .filter(Boolean)
        .join(",") || null;
    const trip = { id: membership.tripId, eventImagesRefs, ...membership.trip };

    return (
      <TripCard
        key={membership.tripId}
        trip={trip}
        onDuplicate={() => duplicateTrip(trip.id)}
        onDelete={() => deleteTrip(trip.id)}
        shared={props.shared}
        loading={loadingTripId === trip.id}
      />
    );
  });
}
