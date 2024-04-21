import { api } from "~/trpc/server";
import InviteTrip from "./_components/invite-trip";
import InvalidInvite from "./_components/invalid-invite";

export default async function Invite({ params }: { params: { inviteCode: string } }) {
  const invite = await api.trip.findInvite({ inviteCode: params.inviteCode });

  if (typeof invite === "number") return <InvalidInvite code={invite} />;

  return <InviteTrip invite={invite} />;
}
