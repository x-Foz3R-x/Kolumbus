import { getMyUserRoleLimits } from "~/server/queries";

import { LibraryProvider } from "./_components/provider";
import MyTrips from "./_components/my-trips";
import SharedTrips from "./_components/shared-trips";
import { api } from "~/trpc/server";

export default async function Library() {
  const userRoleLimits = await getMyUserRoleLimits();
  const memberships = await api.membership.getMy();

  const myMemberships = memberships.filter((membership) => membership.owner);
  const sharedMemberships = memberships.filter((membership) => !membership.owner);

  return (
    <LibraryProvider
      userRoleLimits={userRoleLimits}
      memberships={myMemberships}
      sharedMemberships={sharedMemberships}
    >
      <main className="bg-gray-50 px-5 font-inter">
        <MyTrips />
        <SharedTrips />
      </main>
    </LibraryProvider>
  );
}
