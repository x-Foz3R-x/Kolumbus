import SidebarMenu from "@/components/layouts/sidebar-menu";

type LayoutProps = {
  params: { tripId: string };
  children: React.ReactNode;
};

export default function Layout({ params: { tripId }, children }: LayoutProps) {
  return (
    <div className="relative flex h-full bg-white">
      <SidebarMenu tripId={tripId} />

      <div className="pointer-events-none absolute left-56 top-0 z-30 h-full w-[calc(100vw-14rem)] rounded-tl-lg shadow-kolumblueInset"></div>

      <main
        style={
          {
            // backgroundImage: `url("https://png.pngtree.com/background/20230414/original/pngtree-sea-%E2%80%8B%E2%80%8Bsunrise-scenery-blue-sky-clouds-beautiful-sky-background-picture-image_2424890.jpg")`,
          }
        }
        className="relative h-[calc(100vh-3.5rem)] w-[calc(100vw-14rem)] overflow-x-hidden overflow-y-scroll rounded-tl-lg border-l border-t border-gray-100 bg-cover bg-center bg-no-repeat"
      >
        {children}
      </main>
    </div>
  );
}
