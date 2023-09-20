export default function ItineraryPageSkeleton() {
  return (
    <>
      Loading Itinerary...
      {ItinerarySkeleton()}
    </>
  );
}

export function ItinerarySkeleton() {
  return <div className="rounded-lg bg-kolumblue-200 p-4">Loading...</div>;
}
