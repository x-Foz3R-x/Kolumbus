import { serverApi } from "@/app/_trpc/serverClient";
import { AppdataProvider } from "@/context/appdata-provider";

export default async function Layout({ children }: { children: React.ReactNode }) {
  // const trips = (await serverApi.trip.getAllWithEvents()) ?? [];

  return <AppdataProvider trips={[]}>{children}</AppdataProvider>;
}
