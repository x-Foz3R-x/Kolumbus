import "~/styles/custom-cursor.css";

import TopNav from "./top-nav";
import Hero from "./hero";
import Features from "./features";
import Demo from "./demo";
import CTA from "./cta";
import Footer from "./footer";

export default function HomePage({ nav }: { nav?: React.ReactNode }) {
  return (
    <>
      {nav ?? <TopNav />}

      <main className="apply-custom-cursor min-h-screen w-full px-4 font-belanosima">
        <Hero />
        <Features />
        <Demo />

        <CTA />
        <Footer className="rounded-none bg-kolumblue-500" />
      </main>
    </>
  );
}
