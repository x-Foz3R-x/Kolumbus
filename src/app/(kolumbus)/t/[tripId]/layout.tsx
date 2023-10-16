import SidebarMenu from "@/components/layouts/sidebar-menu";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: { tripId: string } }) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: params.tripId,
    },
  });

  return {
    title: `${trip?.name} - Kolumbus`,
  };
}

type LayoutProps = {
  params: { tripId: string };
  children: React.ReactNode;
};
export default function Layout({ params: { tripId }, children }: LayoutProps) {
  return (
    <>
      <SidebarMenu tripId={tripId} />

      <div className="pointer-events-none fixed bottom-0 left-56 right-0 top-14 z-40 h-full rounded-tl-lg border-l border-t border-gray-100" />
      <div className="pointer-events-none fixed bottom-0 left-56 right-0 top-14 z-40 h-full rounded-tl-lg shadow-kolumblueInset" />

      <main
        style={
          {
            // backgroundImage: `url("https://png.pngtree.com/background/20230414/original/pngtree-sea-%E2%80%8B%E2%80%8Bsunrise-scenery-blue-sky-clouds-beautiful-sky-background-picture-image_2424890.jpg")`,
          }
        }
        className="fixed inset-0 ml-56 mt-14 overflow-auto bg-cover bg-center bg-no-repeat"
      >
        {children}
      </main>
    </>
  );
}
