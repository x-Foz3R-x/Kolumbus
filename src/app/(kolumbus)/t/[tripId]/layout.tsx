import SidebarMenu from "@/components/layouts/sidebar-menu";

type LayoutProps = {
  params: { tripId: string };
  children: React.ReactNode;
};

export default function Layout({ params: { tripId }, children }: LayoutProps) {
  return (
    <div className="relative flex bg-white">
      <SidebarMenu tripId={tripId} />

      <div className="pointer-events-none absolute left-[14rem] top-0 z-30 h-full w-full rounded-tl-lg shadow-kolumblueInset"></div>

      {children}
    </div>
  );
}
