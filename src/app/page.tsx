"use client";

import { Spinner } from "~/components/ui";
import TopNav from "./_components/top-nav";
import X from "~/components/icons/x";

export default function HomePage() {
  return (
    <>
      <TopNav />

      <main className="flex min-h-screen flex-col items-center justify-center font-belanosima">
        Kolumbus
        <Spinner.resize className="stroke-kolumblue-500" />
        <Spinner.background className="fill-slate-500" />
        <Spinner.default className="fill-slate-500" />
        <X size={48} strokeWidth={3} />
      </main>
    </>
  );
}
