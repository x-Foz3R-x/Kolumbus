import HeroFeature from "./hero-feature";
import { Link } from "~/components/ui";

export default function Hero() {
  return (
    <div className="relative flex h-fit min-h-fit w-full justify-around gap-8 px-6 pb-14">
      <div className="relative flex flex-shrink-0 flex-col items-center justify-center gap-[min(max(2.15rem,2.5vw),3.1rem)] pb-24 text-center md:items-start md:text-left">
        <div className="whitespace-nowrap font-bold">
          <h1 className="text-scale-2xl leading-none text-kolumblue-500">Travel Planning</h1>
          <h2 className="text-scale-md">
            Made
            <span className="text-scale-xl text-green-500"> Simple </span>
            and
            <span className="text-scale-xl text-amber-500"> Fun</span>
          </h2>
        </div>

        <p className="text-scale-xs">Plan, explore, and create unforgettable travel experiences.</p>

        <Link.arrow href="/signup" size="xl">
          Start Your Adventure
        </Link.arrow>
      </div>

      <HeroFeature className="hidden md:flex" />
    </div>
  );
}
