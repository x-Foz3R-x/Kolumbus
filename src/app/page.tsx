import "~/styles/custom-cursor.css";

import TopNav from "./_components/top-nav";
import Hero from "./_components/hero";
import Discover from "./_components/discover";
import CTA from "./_components/cta";
import Footer from "./_components/footer";

export default async function HomePage() {
  return (
    <>
      <TopNav />

      <main className="apply-custom-cursor min-h-screen w-screen px-4 font-belanosima">
        <Hero />

        {/* Key Features */}

        <Discover />

        {/* Benefits */}
        {/* <Introduction /> */}

        {/* FAQ */}

        <CTA />

        <Footer className="rounded-none bg-kolumblue-500" />
      </main>
    </>
  );
}
