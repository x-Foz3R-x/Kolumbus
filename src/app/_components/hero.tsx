import HeroFeature from "./hero-feature";
import { Link } from "~/components/ui";

export default function Hero() {
  return (
    <div className="relative flex h-fit min-h-fit w-full justify-around gap-8 pb-24">
      <div className="flex flex-col items-center justify-center gap-5 pb-24 text-center selection:bg-kolumblue-200 sm:gap-[min(max(2.15rem,2.5vw),3.1rem)] md:items-start md:text-left">
        <div className="whitespace-nowrap font-bold">
          <h1 className="sm:text-scale-2xl text-scale-lg text-gray-600">Travel Planning</h1>
          <h2 className="text-scale-md text-gray-600 sm:text-scale-lg">
            Made
            <span className="mx-2 rounded border-0 border-gray-600 bg-emerald-500 px-2 text-white selection:bg-emerald-200 selection:text-emerald-600">
              Simple
            </span>
            and
            <span className="mx-2 rounded border-0 border-gray-600 bg-orange-400 px-2 text-white selection:bg-orange-200 selection:text-orange-600">
              Fun
            </span>
          </h2>
        </div>

        <div>
          <p className="text-pretty text-sm text-gray-600 sm:text-scale-xs sm:leading-tight">
            Plan, explore, and create unforgettable travel experiences <br /> as Kolumbus turns the
            crafting of your next itinerary into <br /> an easy task.
          </p>
          {/* <p className="text-pretty text-sm sm:text-scale-xs">
            Plan, explore, and create unforgettable travel experiences with Kolumbus.
          </p>
          <p className="text-pretty text-sm sm:text-scale-xs">
            Let it turn the crafting of your next itinerary into an easy task.
          </p> */}
        </div>

        <Link.Arrow
          href="/signup"
          size="xl"
          className="hidden bg-kolumblue-700 underline-offset-4 selection:bg-kolumblue-200/30 sm:flex"
        >
          Start Your Adventure
        </Link.Arrow>
        {/* <Link.Arrow
          href="/signup"
          size="xl"
          className="before:bg-kolumblue-500/400 hidden underline underline-offset-4 selection:bg-kolumblue-200/30 before:absolute before:left-[3%] before:top-[20%] before:-z-10 before:size-full before:rounded-br-full before:bg-gradient-to-br before:from-orange-400/50 before:to-yellow-400/50 before:blur-md sm:flex"
        >
          Start Your Adventure
        </Link.Arrow> */}
        <Link.Arrow href="/signup" className="font-bold sm:hidden">
          Start Your Adventure
        </Link.Arrow>
      </div>

      <HeroFeature className="hidden md:flex" />
    </div>
  );
}
