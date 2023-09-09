import Main from "@/components/kolumbus/main";

export default function ItineraryPageSkeleton() {
  return (
    <Main>
      Loading Itinerary...
      {ItinerarySkeleton()}
    </Main>
  );
}

export function ItinerarySkeleton() {
  return <div className="rounded-lg bg-kolumblue-200 p-4">Loading...</div>;
}
