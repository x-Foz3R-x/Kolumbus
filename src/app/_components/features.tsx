"use client";

import Image from "next/image";
import { Icons } from "~/components/ui";
import FeaturesCard from "./feature-card";

export default function Features() {
  return (
    <section
      className="relative rounded-bl-[3rem] bg-gray-800 px-6 pb-14 pt-20 font-inter sm:px-10 sm:pb-20 lg:px-14"
      aria-label="What you can do with Kolumbus"
    >
      <ul className="grid gap-10 md:grid-cols-3 md:gap-6 xl:gap-10">
        <FeaturesCard
          title="Every idea has a place"
          description="A castle, a coffee stop, a place you stumbled upon. Find it with Google Places, add it to your day and keep the details close."
        >
          <div className="relative flex w-44 -rotate-6 flex-col overflow-hidden rounded-xl border-2 border-white bg-white shadow-2xl">
            <Image src="/place-fallback.png" width={176} height={92} alt="" className="w-full" />
            <div className="space-y-2 p-3">
              <p className="text-sm font-semibold text-gray-700">Wawel Royal Castle</p>
              <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <Icons.pin className="h-3 w-2 fill-kolumblue-400" /> Kraków, Poland
              </p>
              <div className="rounded bg-yellow-50 p-2 text-[10px] leading-relaxed text-gray-500">
                A slow morning, a great view.
              </div>
            </div>
          </div>
          <span className="absolute bottom-6 right-5 flex size-10 rotate-6 items-center justify-center rounded-xl border border-white/20 bg-kolumblue-500 shadow-xl">
            <Icons.plus className="size-4 fill-white" />
          </span>
        </FeaturesCard>

        <FeaturesCard
          title="A plan that moves with you"
          description="Rearrange a place or a whole day with a drag. Pick new dates, add a note, and follow a different idea. Your history keeps the way back."
        >
          <div className="w-full max-w-64 space-y-3">
            {["Friday, 12 June", "Saturday, 13 June", "Sunday, 14 June"].map((day, index) => (
              <div
                key={day}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-gray-800/80 p-3 shadow-lg"
                style={{ transform: index === 1 ? "translateX(8px)" : undefined }}
              >
                <span className="flex size-9 flex-shrink-0 items-center justify-center rounded-lg bg-kolumblue-500 font-belanosima text-lg text-white">
                  {12 + index}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-gray-300">{day}</p>
                  <p className="mt-1 truncate text-[10px] text-gray-500">
                    {["Wawel → Old Town", "Coffee → Kazimierz", "One last wander"][index]}
                  </p>
                </div>
                <Icons.gripDots className="h-4 w-2 fill-gray-500" />
              </div>
            ))}
          </div>
        </FeaturesCard>

        <FeaturesCard
          title="Your adventures, together"
          description="Keep your trips in one library. Start fresh, revisit a favourite or make a copy for next time. The interactive demo saves your plans in this browser."
        >
          <div className="relative flex w-full max-w-64 items-center justify-center">
            <div className="absolute -right-1 -top-4 h-36 w-40 rotate-12 rounded-xl border-2 border-white/50 bg-kolumblue-100 shadow-xl" />
            <div className="relative mr-6 w-40 -rotate-6 overflow-hidden rounded-xl border-2 border-white bg-white shadow-2xl">
              <div className="flex h-28 items-center justify-center bg-kolumblue-100">
                <Icons.defaultTrip className="h-20 w-28" />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-700">A few days in Kraków</p>
                <p className="mt-1 text-[10px] text-gray-400">3 days · a little adventure</p>
              </div>
            </div>
            <span className="absolute -bottom-4 right-0 flex size-11 items-center justify-center rounded-xl bg-emerald-400 shadow-xl">
              <Icons.library className="size-5 fill-white" />
            </span>
          </div>
        </FeaturesCard>
      </ul>
    </section>
  );
}
