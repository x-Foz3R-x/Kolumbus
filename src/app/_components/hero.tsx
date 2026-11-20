import ColorBlock from "./color-block";
import HeroFeature from "./hero-feature";
import { Link } from "~/components/ui";
import { startLink } from "~/config/site";

export default function Hero() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen w-full items-center justify-around gap-8 px-4 pb-52 pt-40 bg-dot-gray-800/15"
    >
      <div className="flex min-w-0 flex-col items-center justify-center text-center text-gray-600 selection:bg-kolumblue-200 md:items-start md:text-left">
        <h1 className="pb-d6 text-2xl font-bold sm:whitespace-nowrap sm:text-d-4xl">
          <span className="block text-3xl sm:text-d-6xl">Travel Planning</span>
          Made
          <ColorBlock className="rotate-3 bg-emerald-400 text-white selection:bg-emerald-100 selection:text-emerald-600 hover:-rotate-6">
            Simple
          </ColorBlock>
          and
          <ColorBlock className="-rotate-6 bg-yellow-400 text-white selection:bg-yellow-100 selection:text-yellow-600 hover:rotate-6">
            Fun
          </ColorBlock>
        </h1>

        <p className="pb-d12 text-d-lg text-gray-500">
          Plan, explore, and create unforgettable travel experiences <br /> as Kolumbus turns the
          crafting of your itinerary into <br /> an easy task.
        </p>

        <Link.Arrow href={startLink.href} variant="primary" size="d3xl">
          {startLink.label}
        </Link.Arrow>
      </div>

      <HeroFeature />
    </section>
  );
}
