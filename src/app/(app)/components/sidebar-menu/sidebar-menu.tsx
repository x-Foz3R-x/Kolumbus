"use client";

import { usePathname } from "next/navigation";

import { AuthProvider } from "@/context/auth";

import TileLink from "./TileLink";
import TripsSection from "./TripsSection";

export default function SidebarMenu() {
  return (
    <nav className="shadow-kolumbus relative flex h-[calc(100vh-3.5rem)] w-56 flex-none select-none flex-col overflow-y-scroll bg-white">
      <section className="mb-3 grid grid-cols-2 flex-col items-center justify-items-center gap-2 px-3">
        <TileLink
          link="/itinerary"
          name="Itinerary"
          isSelected={usePathname() == "/itinerary" ? true : false}
        />
        <TileLink
          link="/structure"
          name="Structure"
          isSelected={usePathname() == "/structure" ? true : false}
        />
        <TileLink
          link="/itinerary"
          name="Map"
          isSelected={usePathname() == "/map" ? true : false}
        />
        <TileLink
          link="/itinerary"
          name="Costs"
          isSelected={usePathname() == "/costs" ? true : false}
        />
        <TileLink
          link="/itinerary"
          name="Packing List"
          isSelected={usePathname() == "/packing-list" ? true : false}
          className="col-span-2"
        />
      </section>

      <AuthProvider LoadingIndicator="spinner">
        <TripsSection />
      </AuthProvider>
    </nav>
  );
}
