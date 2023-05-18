import TileLink from "./tile-link";

export default function SidebarMenu() {
  return (
    <nav className="relative flex h-[calc(100vh-3.5rem)] w-56 flex-none select-none flex-col overflow-scroll border-r bg-white">
      {/* <section className="flex h-full flex-col px-3 pb-3"> */}
      <section className="grid grid-cols-2 flex-col items-center justify-items-center gap-2 p-3">
        <TileLink link="/itinerary" name="Itinerary" />
        <TileLink link="/structure" name="Structure" isSelected="true" />
        <TileLink link="/itinerary" name="Map" />
        <TileLink link="/itinerary" name="Costs" />
        <TileLink link="/itinerary" name="Packing List" isLongName="true" />
      </section>
      <section className="flex flex-col px-3 pb-3">
        <h1>Trips</h1>
      </section>
    </nav>
  );
}
