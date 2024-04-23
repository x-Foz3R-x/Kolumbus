import Travelers from "~/components/artwork/travelers";
import HomepageLink from "~/components/homepage-link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Travelers />

      <div className="absolute inset-0 flex size-full min-h-[32rem] items-center justify-center p-4">
        <main className="flex w-[26rem] flex-col items-center rounded-xl border bg-white/80 p-8 shadow-2xl backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
          <HomepageLink />

          {children}
        </main>
      </div>
    </>
  );
}
