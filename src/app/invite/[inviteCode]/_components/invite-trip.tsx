"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { differenceInDays } from "~/lib/utils";

import { dotDivider, Button } from "~/components/ui";
import { tripFallbackImageUrl } from "~/lib/constants";
import { format } from "date-fns";

type Invite = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  image: string | null;
  memberCount: number;
  isMember: boolean;
};
export default function InviteTrip(invite: Invite) {
  const router = useRouter();
  const joinTrip = api.trip.join.useMutation();

  const startDate = new Date(invite.startDate);
  const endDate = new Date(invite.endDate);
  const tripDuration = differenceInDays(startDate, endDate, true);

  const handleJoin = () => {
    joinTrip.mutate({ id: invite.id }, { onSuccess: () => router.push(`/t/${invite.id}`) });
  };

  return (
    <>
      <div className="relative h-28 w-28 overflow-hidden rounded-3xl">
        <Image
          src={invite.image ? invite.image : tripFallbackImageUrl}
          alt="Trip photo"
          sizes="80px"
          priority
          fill
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-2 text-center text-sm">
        <p>You’ve been invited to join</p>

        <h1 className="text-2xl font-semibold text-white">{invite?.name}</h1>

        <div className="flex whitespace-nowrap">
          <div className={dotDivider()}>
            {format(startDate, "d MMM")}
            {" - "}
            {format(endDate, "d MMM")}
          </div>

          <div
            className={dotDivider()}
          >{`${tripDuration} ${tripDuration !== 1 ? "days" : "day"}`}</div>

          <div>{`${invite?.memberCount} ${invite?.memberCount !== 1 ? "members" : "member"}`}</div>
        </div>
      </div>

      <Button
        onClick={handleJoin}
        variant="appear"
        size="lg"
        className="hover:bg-kolumblue-550 mt-2 w-full rounded-lg bg-kolumblue-500 py-2.5 font-medium text-white"
        disabled={invite.isMember}
      >
        {invite.isMember ? "Joined" : "Accept Invite"}
      </Button>
    </>
  );
}
