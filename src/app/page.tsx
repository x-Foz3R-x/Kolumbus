import "~/styles/custom-cursor.css";

import Link from "next/link";

import TopNav from "./_components/top-nav";
import HeroFeature from "./_components/hero-feature";
// import DemoOs from "~/components/demo-os";
import ProgressiveBackgroundColor from "~/components/progressiveBackgroundColor";
import { Icons } from "~/components/ui";

export default async function HomePage() {
  return (
    <>
      <TopNav />

      <main className="apply-custom-cursor flex min-h-screen flex-col items-center justify-center overflow-x-clip pt-14 font-belanosima">
        <ProgressiveBackgroundColor
          colors={[
            [255, 255, 255],
            [255, 224, 240],
          ]}
          className="flex min-h-screen w-screen flex-col items-center justify-center"
        >
          <div className="bg-stripe-bold-60-kolumblue-500/5 w-full">
            <div className="relative mx-auto flex h-fit w-full max-w-screen-2xl justify-around gap-8 px-6">
              <div className="flex h-[650px] flex-shrink-0 flex-col items-center justify-center gap-4 text-center md:items-start md:text-left lg:gap-6">
                <div className="whitespace-nowrap font-semibold">
                  <h1 className="text-5xl lg:text-6xl">Travel Planning</h1>
                  <h2 className="text-2xl lg:text-3xl">
                    Made <span className="text-4xl text-green-500 lg:text-5xl">Simple </span>
                    and
                    <span className="text-4xl text-amber-500 lg:text-5xl"> Fun</span>
                  </h2>
                </div>

                <p className="text-base lg:text-xl">
                  Plan, explore, and create unforgettable travel experiences.
                </p>

                <Link
                  href="/signup"
                  className="group relative flex w-fit items-center rounded-xl border-2 border-black/10 bg-kolumblue-500 px-5 py-2 text-lg font-semibold text-white shadow-lg outline-kolumblue-200 duration-400 ease-kolumb-flow hover:rounded focus:shadow-focus lg:px-8 lg:py-3 lg:text-2xl"
                >
                  <Icons.arrowRight className="absolute left-px w-4 fill-white opacity-0 duration-400 ease-kolumb-flow group-hover:left-2 group-hover:opacity-100 lg:left-1 lg:w-5 lg:group-hover:left-4" />

                  <div className="w-fit duration-400 ease-kolumb-flow group-hover:translate-x-2.5 lg:group-hover:translate-x-4">
                    Start Your Adventure
                  </div>
                </Link>

                {/* <Link.arrow
                  href="/signup"
                  className="border-2 border-black/10 shadow-lg outline-kolumblue-200 focus:shadow-focus"
                >
                  Start Your Adventure
                </Link.arrow> */}
              </div>

              <HeroFeature className="hidden md:block" />
            </div>
          </div>

          {/* <DemoOs /> */}

          <div className="h-96 w-full rounded-3xl bg-rose-500/50 px-4 lg:w-[90%]">test</div>
          <div className="h-96 w-full rounded-3xl bg-rose-500/50 px-4 lg:w-[90%]">test</div>
          <div className="h-96 w-full rounded-3xl bg-rose-500/50 px-4 lg:w-[90%]">test</div>
          <div className="h-96 w-full rounded-3xl bg-rose-500/50 px-4 lg:w-[90%]">test</div>
        </ProgressiveBackgroundColor>
      </main>
    </>
  );
}
