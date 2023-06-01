import TileLink from "./tile-link";

export default function SidebarMenu() {
  return (
    <nav className="shadow-kolumbus relative flex h-[calc(100vh-3.5rem)] w-56 flex-none select-none flex-col overflow-y-scroll bg-white">
      <section className="mb-3 grid grid-cols-2 flex-col items-center justify-items-center gap-2 px-3">
        <TileLink link="/itinerary" name="Itinerary" isSelected="true" />
        <TileLink link="/structure" name="Structure" />
        <TileLink link="/itinerary" name="Map" />
        <TileLink link="/itinerary" name="Costs" />
        <TileLink
          link="/itinerary"
          name="Packing List"
          className="col-span-2"
        />
      </section>
      <section className="flex flex-col px-3 pb-3">
        <h1>Trips</h1>
      </section>
    </nav>
  );
}
