import "~/styles/custom-cursor.css";

import TopNav from "./_components/top-nav";
import Hero from "./_components/hero";
import Discover from "./_components/discover";
import CallToAction from "./_components/call-to-action";
import Footer from "./_components/footer";
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
            // [243, 232, 255],
          ]}
          scrollOffset={["start end", "end start"]}
          className="relative flex w-full flex-col items-center justify-center py-24"
        >
          <div className="h-96 w-full rounded-3xl bg-rose-500/25 px-4 shadow-2xl lg:w-[90%]">
            test
          </div>
        </ProgressiveBackgroundColor>

        {/* Features */}
        {/* About project */}
        {/* FAQ */}
        {/* Call to action */}
        <CallToAction />
        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
