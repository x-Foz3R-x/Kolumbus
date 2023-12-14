import { serverApi } from "@/app/_trpc/serverClient";
import { AppdataProvider } from "@/context/appdata";
import { ConvertTripDatesToISOString } from "@/lib/utils";

export default async function Layout({ children }: { children: React.ReactNode }) {
  // if no user get trips data from local storage
  const trips = ((await serverApi.trip.getAllWithEvents()) ?? []).map(ConvertTripDatesToISOString);

  return <AppdataProvider trips={trips}>{children}</AppdataProvider>;
}
