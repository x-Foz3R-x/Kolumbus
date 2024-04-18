"use client";

import { Spinner } from "~/components/ui";
import TopNav from "./_components/top-nav";

export default function HomePage() {
  return (
    <>
      <TopNav />

      <main className="flex min-h-screen flex-col items-center justify-center font-belanosima">
        Kolumbus
        <Spinner.resize className="stroke-kolumblue-500" />
        <Spinner.background className="fill-slate-500" />
        <Spinner.default className="fill-slate-500" />
      </main>
    </>
  );
}
