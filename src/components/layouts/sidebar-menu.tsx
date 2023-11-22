import Icon from "@/components/icons";
import YourTrips from "../your-trips";
import A from "../ui/a";

export default function SidebarMenu({ tripId }: { tripId: string }) {
  const Tile = ({ href, label, className, children }: { href: string; label: string; className?: string; children: React.ReactNode }) => {
    return (
      <A href={href} variant="tile" size="unstyled" className={className}>
        <div className="flex h-full w-full flex-col items-center rounded-lg p-2 duration-200 ease-kolumb-overflow hover:scale-110">
          {children}
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center text-sm font-medium leading-[0.875rem]">{label}</div>
          </div>
        </div>
      </A>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 top-0 z-40 bg-white">
      <div className="pt-14"></div>
      <div className="flex max-h-full w-56 flex-none select-none flex-col gap-3 overflow-y-scroll">
        <section className="grid grid-cols-2 flex-col items-center justify-items-center gap-2 px-3">
          <Tile href={`/t/${tripId}`} label="Itinerary">
            <Icon.itinerary className="mb-[3px] mt-[9px] h-6 w-6 flex-none" />
          </Tile>

          <Tile href={`/t/${tripId}/structure`} label="Structure">
            <Icon.structure className="mb-[3px] mt-[9px] h-6 w-6 flex-none" />
          </Tile>

          <Tile href={`/t/${tripId}/map`} label="Map">
            <Icon.map className="mb-[3px] mt-[9px] h-6 w-6 flex-none" />
          </Tile>

          <Tile href={`/t/${tripId}/expenses`} label="Expenses">
            <Icon.costs className="mb-[3px] mt-[9px] h-6 w-6 flex-none" />
          </Tile>

          <Tile href={`/t/${tripId}/packing-list`} label="Packing List" className="col-span-2">
            <Icon.packingList className="mb-[3px] mt-[9px] h-6 w-6 flex-none" />
          </Tile>
        </section>

        <YourTrips />
      </div>
    </nav>
  );
}
