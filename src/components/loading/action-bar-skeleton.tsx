export default function ActionBarSkeleton() {
  return (
    <div className="z-30 flex w-full p-3">
      <div className="flex h-14 w-full items-center justify-between gap-5 rounded-lg border border-gray-100 bg-white/80 shadow-xl backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
        <section className="flex h-full w-full items-center gap-2 overflow-x-scroll pl-3">
          <div className="h-8 w-32 rounded bg-black/5 px-2 py-1" />
        </section>

        <section className="flex flex-shrink-0 items-center gap-2 pr-5">
          <div className="h-9 w-9 rounded bg-black/5" />
          <div className="h-9 w-20 rounded bg-black/5" />
        </section>
      </div>
    </div>
  );
}
