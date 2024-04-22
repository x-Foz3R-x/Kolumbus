import "~/styles/custom-cursor.css";

import { Spinner } from "~/components/ui";
import X from "~/components/ui/icons/x";
import TopNav from "./_components/top-nav";
import HeroFeature from "./_components/hero-feature";

export default async function HomePage() {
  return (
    <>
      <TopNav />

      <main className="apply-custom-cursor flex min-h-screen flex-col items-center justify-center font-belanosima">
        Kolumbus
        <Spinner.resize className="stroke-kolumblue-500" />
        <Spinner.background className="fill-slate-500" />
        <Spinner.default className="fill-slate-500" />
        <X size={48} strokeWidth={3} />
        <HeroFeature />
        <div className="h-screen">test</div>
        <div className="h-screen">test</div>
      </main>
    </>
  );
}
