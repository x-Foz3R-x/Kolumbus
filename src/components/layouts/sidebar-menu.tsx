import YourTrips from "./sidebar-menu/your-trips";
import Tools from "./sidebar-menu/tools";

export default function SidebarMenu({ tripId }: { tripId: string }) {
  return (
    <nav className="fixed bottom-0 left-0 top-14 z-40 flex max-h-full w-56 flex-none select-none flex-col gap-3 overflow-y-auto bg-white font-inter">
      <Tools tripId={tripId} />
      <YourTrips />
    </nav>
  );
}
