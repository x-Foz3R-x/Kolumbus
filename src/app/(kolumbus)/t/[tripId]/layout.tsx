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

      <main className="relative ml-56 mt-14">{children}</main>
    </>
  );
}
