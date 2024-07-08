import "~/styles/custom-cursor.css";

import TopNav from "./_components/top-nav";
import Hero from "./_components/hero";
import Discover from "./_components/discover";
import ProgressiveBackgroundColor from "~/components/progressiveBackgroundColor";

export default async function HomePage() {
  return (
    <>
      <TopNav />

      <main className="apply-custom-cursor min-h-screen w-screen px-4 font-belanosima">
        <Hero />
        <Discover />

        <ProgressiveBackgroundColor
          colors={[
            [255, 255, 255],
            [235, 215, 245],
          ]}
          scrollOffset={["start end", "end start"]}
          className="relative flex min-h-screen w-full flex-col items-center justify-center"
        >
          <div className="h-96 w-full rounded-3xl bg-rose-500/25 px-4 shadow-2xl lg:w-[90%]">
            test
          </div>
          <div className="h-96 w-full rounded-3xl bg-rose-500/50 px-4 lg:w-[90%]">test</div>
        </ProgressiveBackgroundColor>
      </main>
    </>
  );
}
