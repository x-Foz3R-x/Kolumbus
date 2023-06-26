import { AuthProvider } from "@/context/auth";

import TileLink from "../TileLink";
import Trips from "../Trips";
import Icon from "@/components/icons";

export default function SidebarMenu() {
  const tileLinkStyle = "h-6 w-6 flex-none mt-[9px] mb-[3px] ";

  return (
    <nav className="shadow-kolumbus relative flex h-[calc(100vh-3.5rem)] w-56 flex-none select-none flex-col overflow-y-scroll bg-white">
      <section className="mb-3 grid grid-cols-2 flex-col items-center justify-items-center gap-2 px-3">
        <TileLink link="/itinerary" label="Itinerary">
          <Icon.itinerary className={tileLinkStyle} />
        </TileLink>

        <TileLink link="/structure" label="Structure">
          <Icon.structure className={tileLinkStyle} />
        </TileLink>

        <TileLink link="/map" label="Map">
          <Icon.map className={tileLinkStyle} />
        </TileLink>

        <TileLink link="/costs" label="Costs">
          <Icon.costs className={tileLinkStyle} />
        </TileLink>

        <TileLink
          link="/packingList"
          label="Packing List"
          className="col-span-2"
        >
          <Icon.packingList className={tileLinkStyle} />
        </TileLink>
      </section>

      <AuthProvider LoadingIndicator="spinner">
        <Trips />
      </AuthProvider>
    </nav>
  );
}
