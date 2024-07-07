import HeroFeature from "./hero-feature";
import { Link } from "~/components/ui";

export default function Hero() {
  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full items-center justify-around gap-8 pb-40 bg-dot-black/20">
      <div className="flex flex-col items-center justify-center gap-5 pb-40 pt-16 text-center text-gray-600 selection:bg-kolumblue-200 sm:gap-[min(max(2.15rem,2.5vw),3.1rem)] md:items-start md:text-left">
        <div className="whitespace-nowrap font-bold">
          <h1 className="text-scale-lg sm:text-scale-2xl">Travel Planning</h1>
          <h2 className="text-scale-md sm:text-scale-lg">
            Made
            <span className="mx-2 rounded bg-emerald-400 px-2 text-white selection:bg-emerald-200 selection:text-emerald-600">
              Simple
            </span>
            and
            <span className="mx-2 rounded bg-amber-400 px-2 text-white selection:bg-orange-200 selection:text-orange-600">
              Fun
            </span>
          </h2>
        </div>

        <div>
          <p className="text-pretty text-sm sm:text-scale-xs sm:leading-tight">
            Plan, explore, and create unforgettable travel experiences <br /> as Kolumbus turns the
            crafting of your itinerary into <br /> an easy task.
          </p>
        </div>

        <Link.Arrow href="/signup" size="xl" className="hidden sm:flex">
          Start Your Adventure
        </Link.Arrow>
        <Link.Arrow href="/signup" className="font-bold sm:hidden">
          Start Your Adventure
        </Link.Arrow>
      </div>

      <HeroFeature className="hidden md:flex" />

      {/* Top part of next section */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="relative h-28 w-1/2 rounded-t-[3rem] bg-gray-800">
          <p className="absolute bottom-0 w-full translate-y-1/2 text-balance px-[10%] text-center font-belanosima text-scale-md font-bold text-white">
            Discover the <span className="text-yellow-300"> Power </span> of Kolumbus
          </p>

          <span className="absolute -right-12 bottom-0 -z-10 size-12 bg-gray-800" />
          <span className="absolute -right-12 bottom-0 -z-10 size-12 rounded-bl-full bg-white" />
        </div>

        <div className="h-12 w-full rounded-tr-[3rem] bg-gray-800" />
      </div>
    </div>
  );
}
