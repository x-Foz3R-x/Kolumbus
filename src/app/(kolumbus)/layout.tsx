import { serverApi } from "@/app/_trpc/serverClient";
import { AppdataProvider } from "@/context/appdata";

export default async function Layout({ children }: { children: React.ReactNode }) {
  // if no user get trips data from local storage
  const trips = (await serverApi.trip.getAllWithEvents()) ?? [];

  return <AppdataProvider trips={trips}>{children}</AppdataProvider>;
}
