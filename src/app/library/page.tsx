import { getMyMemberships, getMyRole } from "~/server/queries";
import LibraryComponent from "./_components/library";

export default async function Library() {
  const memberships = await getMyMemberships();
  const role = await getMyRole();
  if (!role) return null;

  const tripMemberships = memberships.filter((membership) => membership.owner);
  const sharedTripMemberships = memberships.filter((membership) => !membership.owner);

  return (
    <main className="bg-gray-50 p-5 font-inter">
      <LibraryComponent
        tripMemberships={tripMemberships}
        sharedTripMemberships={sharedTripMemberships}
        role={role}
      />
    </main>
  );
}
