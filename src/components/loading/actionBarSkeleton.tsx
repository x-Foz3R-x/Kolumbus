export default function ActionBarSkeleton() {
  return (
    <>
      <section className="flex h-full w-full items-center gap-2 overflow-x-scroll pl-3">
        <div className="h-8 w-32 rounded bg-black/5 px-2 py-1" />
      </section>

      <section className="flex flex-shrink-0 items-center gap-2 pr-5">
        <div className="h-9 w-20 rounded bg-black/5" />
        <div className="h-9 w-9 rounded bg-black/5" />
      </section>
    </>
  );
}
