"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import api from "@/app/_trpc/client";
import { LANGUAGE, TRIP_IMG_FALLBACK } from "@/lib/config";
import { calculateDays, cn } from "@/lib/utils";

import Icon from "@/components/icons";
import { addDotAfter, Button, ButtonVariants } from "@/components/ui";

export default function Invite({ params }: { params: { inviteCode: string } }) {
  const router = useRouter();

  const invite = api.trips.findInvite.useQuery({ inviteCode: params.inviteCode }).data;
  const joinTrip = api.trips.join.useMutation();

  if (invite === undefined) return <Icon.logoVertical className="h-32 w-32 fill-white" />;
  if (invite === 0 || invite === 1 || invite === 2) return <InvalidInvite code={invite} />;

  const startDate = new Date(invite.startDate);
  const endDate = new Date(invite.endDate);
  const tripDuration = calculateDays(startDate, endDate);
  const photoUrl = invite.photo ? invite.photo : TRIP_IMG_FALLBACK;

  const handleJoin = () => {
    joinTrip.mutate({ tripId: invite.id });
    router.push(`/t/${invite.id}`);
  };

  return (
    <>
      <div className="relative h-28 w-28 overflow-hidden rounded-3xl">
        <Image src={photoUrl} alt="Trip photo" sizes="80px" priority fill />
      </div>

      <div className="flex flex-col items-center justify-center gap-2 text-center text-sm">
        <p>You’ve been invited to join</p>

        <h1 className="text-2xl font-semibold text-white">{invite?.name}</h1>

        <div className="flex whitespace-nowrap">
          <div className={addDotAfter()}>
            {startDate.getDate()} {startDate.toLocaleString(LANGUAGE, { month: "short" })}
            {" ➞ "}
            {endDate.getDate()} {endDate.toLocaleString(LANGUAGE, { month: "short" })}
          </div>

          <div className={addDotAfter()}>{`${tripDuration} ${tripDuration !== 1 ? "days" : "day"}`}</div>

          <div>{`${invite?.memberCount} ${invite?.memberCount !== 1 ? "members" : "member"}`}</div>
        </div>
      </div>

      <Button
        onClick={handleJoin}
        variant="appear"
        size="lg"
        className="mt-2 w-full rounded-lg bg-kolumblue-500 py-2.5 font-medium text-white hover:bg-kolumblue-550"
        disabled={invite.isMember}
      >
        {invite.isMember ? "Joined" : "Accept Invite"}
      </Button>
    </>
  );
}

function InvalidInvite({ code }: { code: 0 | 1 | 2 }) {
  const error = {
    titles: {
      0: "Unknown Invite",
      1: "Invalid Invite",
      2: "Membership Limit",
    },
    messages: {
      0: "The invite seems to have disappeared. It might have ended its journey.",
      1: "The invite link doesn't seem right. It might be a bit off.",
      2: "You're already part of 20 trips. That's the limit!",
    },
  };

  return (
    <>
      <div className="relative h-16 w-16">
        <Icon.x_bold className="fill-gray-650" />
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-center text-xs font-bold">YOU RECEIVED INVITE, BUT...</p>
        <h1 className="text-2xl font-semibold text-red-500">{error.titles[code]}</h1>
        <p className="text-center text-sm">{error.messages[code]}</p>
      </div>

      <div className="mt-2 flex w-full flex-col gap-2">
        <Link
          href="/library"
          className={cn(
            ButtonVariants({ size: "lg" }),
            "block w-full rounded-lg bg-kolumblue-500 py-2.5 text-center font-medium text-white hover:bg-kolumblue-550",
          )}
        >
          Continue to library
        </Link>
        <Link href="/invalid-invite" target="_blank" className="text-[13px] font-medium text-kolumblue-500 hover:underline">
          Why is my invite invalid?
        </Link>
      </div>
    </>
  );
}
