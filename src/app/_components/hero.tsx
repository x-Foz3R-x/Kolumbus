import Link from "next/link";

import HeroFeature from "./hero-feature";
import { Icons } from "~/components/ui";

export default function Hero() {
  return (
    <div className="relative flex h-fit min-h-fit w-full justify-around gap-8 px-6 pb-14">
      <div
        style={{ gap: "min(max(2.15rem, 2.5vw), 3.1rem)" }}
        className="relative flex flex-shrink-0 flex-col items-center justify-center text-center md:items-start md:text-left"
      >
        <div className="whitespace-nowrap font-bold">
          <h1 className="text-scale-xl leading-none text-kolumblue-500">Travel Planning</h1>
          <h2 className="text-scale-sm">
            Made
            <span className="text-scale-lg text-green-500"> Simple </span>
            and
            <span className="text-scale-lg text-amber-500"> Fun</span>
          </h2>
        </div>

        <p className="text-scale-xs">Plan, explore, and create unforgettable travel experiences.</p>

        <Link
          href="/signup"
          className="group relative flex w-fit items-center rounded-xl border-2 border-black/10 bg-kolumblue-500 px-5 py-2 text-lg font-bold text-white shadow-lg outline-kolumblue-200 duration-400 ease-kolumb-flow hover:rounded focus:shadow-focus lg:px-8 lg:py-3 lg:text-2xl"
        >
          <Icons.arrowRight className="absolute left-px w-4 fill-white opacity-0 duration-400 ease-kolumb-flow group-hover:left-2 group-hover:opacity-100 lg:left-1 lg:w-5 lg:group-hover:left-4" />

          <div className="w-fit duration-400 ease-kolumb-flow group-hover:translate-x-2.5 lg:group-hover:translate-x-4">
            Start Your Adventure
          </div>
        </Link>
      </div>

      <HeroFeature className="hidden md:flex" />
    </div>
  );
}
