import { getMyUserType } from "~/server/queries";
import { auth } from "@clerk/nextjs/server";

import { api } from "~/trpc/server";
import { LibraryProvider } from "./_components/library-provider";
import MyTrips from "./_components/my-trips";
import SharedTrips from "./_components/shared-trips";

export default async function Library() {
  const user = auth();
  const userType = await getMyUserType();
  const memberships = await api.membership.getMy();

  const myMemberships = memberships.filter((membership) => membership.permissions === -1);
  const sharedMemberships = memberships.filter((membership) => membership.permissions !== -1);

  if (!user.userId) return null;

  return (
    <LibraryProvider
      userId={user.userId}
      userType={userType}
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
