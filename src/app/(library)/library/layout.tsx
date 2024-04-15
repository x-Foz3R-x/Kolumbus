import { serverApi } from "@/app/_trpc/serverClient";
import { LibraryProvider } from "@/context/library-provider";
// import { measureRuntime } from "@/lib/utils";

export default async function Layout({ children }: { children: React.ReactNode }) {
  // const memberships = (await measureRuntime(() => serverApi.library.getMemberships())) ?? [];
  const memberships = (await serverApi.memberships.getMemberships()) ?? [];

  return <LibraryProvider memberships={memberships}>{children}</LibraryProvider>;
}
