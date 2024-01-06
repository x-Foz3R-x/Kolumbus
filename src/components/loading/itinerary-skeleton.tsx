import Skeleton from "../ui/skeleton";

export function ItinerarySkeleton() {
  const days = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="flex h-full w-full gap-5 px-6">
      <ul className="overflow-hidden rounded-xl">
        {days.map((day) => (
          <span key={day}>
            <Skeleton className="h-5 w-32 bg-kolumblue-200" />
            <Skeleton className="h-28 w-32 bg-gray-50" />
          </span>
        ))}
        <Skeleton className="relative z-30 block h-5 w-32 bg-kolumblue-200" />
      </ul>

      <ul className="flex flex-col gap-5 py-5">
        {days.map((day) => (
          <Skeleton key={day} className="h-28 w-8 rounded-xl bg-gray-50" />
        ))}
      </ul>
    </div>
  );
}
