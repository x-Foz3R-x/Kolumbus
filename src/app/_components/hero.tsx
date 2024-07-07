import HeroFeature from "./hero-feature";
import { Link } from "~/components/ui";

export default function Hero() {
  return (
    <div className="relative z-10 flex h-fit min-h-fit w-full justify-around gap-8 pb-24 bg-dot-black/25">
      <div className="flex flex-col items-center justify-center gap-5 pb-24 text-center text-gray-600 selection:bg-kolumblue-200 sm:gap-[min(max(2.15rem,2.5vw),3.1rem)] md:items-start md:text-left">
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

        <Link.Arrow href="/signup" theme="default" size="xl" className="sm:flex">
          Start Your Adventure
        </Link.Arrow>
        <Link.Arrow href="/signup" className="font-bold sm:hidden">
          Start Your Adventure
        </Link.Arrow>
      </div>

      <HeroFeature className="hidden md:flex" />
    </div>
  );
}
