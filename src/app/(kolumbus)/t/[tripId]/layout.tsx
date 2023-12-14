import { prisma } from "@/lib/prisma";
import Header from "@/components/layouts/header";
import SidebarMenu from "@/components/layouts/sidebar-menu";

export async function generateMetadata({ params }: { params: { tripId: string } }) {
  const trip = await prisma.trip.findFirst({ where: { id: params.tripId } });
  return { title: `${trip?.name} - Kolumbus` };
}

type LayoutProps = {
  params: { tripId: string };
  children: React.ReactNode;
};
export default async function Layout({ params: { tripId }, children }: LayoutProps) {
  return (
    <>
      <Header />
      <SidebarMenu tripId={tripId} />

      {/* <div className="pointer-events-none fixed bottom-0 left-56 right-0 top-14 z-40 h-full rounded-tl-lg border-l border-t border-gray-100" />
      <div className="pointer-events-none fixed bottom-0 left-56 right-0 top-14 z-40 h-full rounded-tl-lg shadow-inset" /> */}

      <div className="fixed bottom-0 left-56 right-0 top-14 overflow-y-scroll font-inter">
        <main
          style={
            {
              // backgroundImage: `url("https://png.pngtree.com/background/20230414/original/pngtree-sea-%E2%80%8B%E2%80%8Bsunrise-scenery-blue-sky-clouds-beautiful-sky-background-picture-image_2424890.jpg")`,
            }
          }
          className="relative rounded-tl-lg bg-cover bg-fixed bg-center bg-no-repeat"
        >
          {children}
        </main>
      </div>
    </>
  );
}
