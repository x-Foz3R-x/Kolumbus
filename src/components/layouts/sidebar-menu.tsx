import Trips from "../trips";
import TileLink from "../tile-link";
import Icon from "@/components/icons";

export default function SidebarMenu({ tripId }: { tripId: string }) {
  const tileLinkStyle = "h-6 w-6 flex-none mt-[9px] mb-[3px] ";

  return (
    <nav className="shadow-kolumbus relative z-40 flex h-[calc(100vh-3.5rem)] w-56 flex-none select-none flex-col gap-3 overflow-y-scroll bg-white">
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

        <TileLink link={`/t/${tripId}/costs`} label="Costs">
          <Icon.costs className={tileLinkStyle} />
        </TileLink>

        <TileLink link={`/t/${tripId}/packing-list`} label="Packing List" className="col-span-2">
          <Icon.packingList className={tileLinkStyle} />
        </TileLink>
      </section>

      <section className="flex flex-col gap-2 px-3 pb-3">
        <h1 className="cursor-default font-adso text-xl font-bold text-tintedGray-400">Your trips</h1>
        <Trips tripId={tripId} />
      </section>
    </nav>
  );
}
