import YourTrips from "../your-trips";
import TileLink from "../tile-link";
import Icon from "@/components/icons";

export default function SidebarMenu({ tripId }: { tripId: string }) {
  const tileLinkStyle = "h-6 w-6 flex-none mt-[9px] mb-[3px] ";

  return (
    <nav className="fixed bottom-0 left-0 top-0 z-40 bg-white">
      <div className="pt-14"></div>
      <div className="flex max-h-full w-56 flex-none select-none flex-col gap-3 overflow-y-scroll">
        <section className="grid grid-cols-2 flex-col items-center justify-items-center gap-2 px-3">
          <TileLink link={`/t/${tripId}`} label="Itinerary">
            <Icon.itinerary className={tileLinkStyle} />
          </TileLink>

          <TileLink link={`/t/${tripId}/structure`} label="Structure">
            <Icon.structure className={tileLinkStyle} />
          </TileLink>

          <TileLink link={`/t/${tripId}/map`} label="Map">
            <Icon.map className={tileLinkStyle} />
          </TileLink>

          <TileLink link={`/t/${tripId}/expenses`} label="Expenses">
            <Icon.costs className={tileLinkStyle} />
          </TileLink>

          <TileLink link={`/t/${tripId}/packing-list`} label="Packing List" className="col-span-2">
            <Icon.packingList className={tileLinkStyle} />
          </TileLink>
        </section>

        <YourTrips activeTripId={tripId} />
      </div>
    </nav>
  );
}
