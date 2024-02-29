import Link from "next/link";

import Icon from "../icons";
import { ScrollAnimation } from "./global-nav/scroll-animation";
import Actions from "./global-nav/actions";

export default function GlobalNav() {
  return (
    <>
      <div className="anti-focus-behaviour-on-position-sticky-fixed" />
      <nav className="fixed inset-x-0 top-0 flex h-12 justify-center font-medium text-gray-100">
        <ScrollAnimation propertyName="translateY" multiplier={90} className="absolute top-[4.1rem] z-50 flex origin-top justify-center">
          <div className="flex min-w-0 max-w-screen-xl gap-28 overflow-hidden bg-gradient-to-r from-transparent via-gray-500 to-transparent bg-clip-text px-8 font-medium text-transparent">
            <div className="flex h-6 w-full items-center justify-end gap-1">
              <h3 className="flex-none text-sm">From Dream to Itinerary</h3>
              <h2 className="flex-none text-base">From Dream to Itinerary</h2>
              <h1 className="flex-none text-base text-gray-300">From Dream to Itinerary</h1>
            </div>
            <div className="flex h-6 w-full items-center justify-start gap-1">
              <h1 className="flex-none text-base text-gray-300">Your Journey, Your Way</h1>
              <h2 className="flex-none text-base">Your Journey, Your Way</h2>
              <h3 className="flex-none text-sm">Your Journey, Your Way</h3>
            </div>
          </div>
        </ScrollAnimation>

        <div className="container relative z-50 flex w-full items-center px-8">
          <section style={{ width: "calc(50% - 48px)" }} className="z-50 flex">
            {/* <Link
              href="/playground"
              className="relative flex items-center gap-1 rounded-lg bg-transparent fill-gray-100 px-3 py-1.5 text-sm before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:scale-50 before:rounded-lg before:bg-gray-100 before:opacity-0 before:shadow-button before:duration-300 before:ease-kolumb-flow hover:fill-gray-900 hover:text-gray-900 before:hover:scale-100 before:hover:opacity-100 focus-visible:fill-gray-900 focus-visible:text-gray-900 before:focus-visible:scale-100 before:focus-visible:opacity-100"
            >
              Playground
            </Link> */}
          </section>

          <ScrollAnimation propertyName="scale" className="origin-top">
            <section className="h-12 w-24 flex-shrink-0 p-1">
              <Link href="/" title="Homepage" aria-label="Homepage">
                <Icon.logo2 className="m-auto h-full" />
              </Link>
            </section>
          </ScrollAnimation>

          <section style={{ width: "calc(50% - 48px)" }} className="dark flex items-center justify-end gap-4">
            <Actions />
          </section>
        </div>

        <ScrollAnimation
          role="presentation"
          propertyName="scaleY"
          className="fixed inset-x-0 top-0 z-40 h-12 origin-top bg-black/80 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter"
        />
      </nav>
    </>
  );
}
