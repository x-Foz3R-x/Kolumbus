import { getMyMemberships, getMyUserRoleDetails } from "~/server/queries";

import { LibraryProvider } from "./_components/provider";
import MyTrips from "./_components/my-trips";
import SharedTrips from "./_components/shared-trips";

export default async function Library() {
  const memberships = await getMyMemberships();
  const userRole = await getMyUserRoleDetails();
  if (!userRole) return null;

  const myMemberships = memberships.filter((membership) => membership.owner);
  const sharedMemberships = memberships.filter((membership) => !membership.owner);

  return (
    <LibraryProvider
      userRole={userRole}
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
