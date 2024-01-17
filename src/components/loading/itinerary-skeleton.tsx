import Skeleton from "../ui/skeleton";

// todo - add events to skeleton (3,0,2,4,1 -> number of events per day)

export function ItinerarySkeleton() {
  const days = [3, 0, 2, 4, 1];

  return (
    <ul className="flex w-full min-w-fit flex-col px-6">
      {days.map((dayEvents, index) => (
        <li key={index} className="group/day flex w-full gap-5">
          <div>
            {/* Calendar Header */}
            <Skeleton className="h-5 w-32 bg-kolumblue-200 group-first/day:rounded-t-xl" />

            {/* Calendar */}
            <Skeleton className="h-28 w-32 bg-gray-50" />
          </div>

          {/* Events list */}
          <ul className="mt-5 flex h-28 w-full list-none gap-2">
            {Array.from({ length: dayEvents }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-40 rounded-lg bg-black/5" />
            ))}
            <Skeleton className="h-28 w-8 rounded-xl bg-black/5" />
          </ul>
        </li>
      ))}

      {/* Calendar End */}
      <Skeleton className="h-5 w-32 rounded-b-xl bg-kolumblue-200" />
    </ul>
  );
}
