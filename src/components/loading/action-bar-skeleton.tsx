import Skeleton from "../ui/skeleton";

export function ActionBarSkeleton() {
  return (
    <section className="sticky left-0 right-0 top-14 z-30 flex w-full min-w-min pb-3 pl-3 pr-6 font-inter">
      <div className="flex h-14 w-full items-center justify-between gap-5 rounded-lg border border-gray-100 bg-white/80 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
        <div className="flex h-full w-full items-center overflow-x-auto pl-3">
          <Skeleton className="h-8 w-32 rounded bg-black/5" />
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 pr-5">
          <Skeleton className="h-[38px] w-[35px] rounded bg-black/5" />
          <Skeleton className="h-[38px] w-[81.5px] rounded bg-black/5" />
        </div>
      </div>
    </section>
  );
}
