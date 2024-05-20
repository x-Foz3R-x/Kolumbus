/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { toastHandler } from "~/lib/trpc";
import { cn, createId } from "~/lib/utils";
import { env } from "~/env";

import Switch from "~/components/ui/switch";
import { Floating } from "~/components/ui/floating";
import { Button, Divider, Icons, Input } from "~/components/ui";

type Props = {
  tripId: string;
  tripInviteCode: string | null;
  tripMembers: {
    userId: string;
    name: string | null;
    image: string;
    permissions: number;
    owner: boolean;
  }[];
};
export default function MembersDropdown({ tripId, tripInviteCode, tripMembers }: Props) {
  const router = useRouter();

  const createTripInvite = api.trip.createInvite.useMutation(toastHandler());
  const deleteTripInvite = api.trip.deleteInvite.useMutation(toastHandler());

  const [invite, setInvite] = useState(tripInviteCode);

  const switchInvite = (checked: boolean) => {
    if (checked) {
      const inviteCode = createId(8);
      setInvite(inviteCode);

      createTripInvite.mutate(
        { id: tripId, inviteCode },
        {
          onSuccess: (inviteCode) => setInvite(inviteCode),
          onError: () => setInvite(null),
        },
      );
    } else {
      setInvite(null);
      deleteTripInvite.mutate({ id: tripId }, { onError: () => router.refresh() });
    }
  };

  return (
    <Floating
      placement="bottom-end"
      offset={{ mainAxis: 6, crossAxis: 8 }}
      className="w-[23.5rem] space-y-4 rounded-xl bg-white p-4 shadow-floating"
      zIndex={50}
      triggerProps={{ children: <Icons.members className="h-4" /> }}
    >
      <div className="flex flex-col gap-4 rounded-lg">
        <div className="flex items-center gap-4">
          Invite
          <Switch
            checked={!!invite}
            onChange={switchInvite}
            loading={createTripInvite.isPending || deleteTripInvite.isPending}
          />
        </div>

        <Input
          value={!!invite ? `${env.NEXT_PUBLIC_APP_URL}/invite/${invite}` : ""}
          className={{
            container: cn(
              "rounded-lg shadow-sm duration-150 ease-kolumb-flow",
              !invite && "pointer-events-none opacity-50",
            ),
            input: "h-11 bg-gray-100 text-[13px] focus:shadow-border",
          }}
          readOnly
        >
          <div>
            <Button
              variant="appear"
              size="sm"
              className="absolute right-1.5 top-1.5 h-8 w-16 bg-kolumblue-500 text-white hover:bg-kolumblue-400"
              animatePress
            >
              Copy
            </Button>
          </div>
        </Input>
      </div>

      <Divider />

      <div className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-gray-50 px-2 py-4">
        <h4 className="px-2">Members</h4>
        <div className="flex flex-col gap-4">
          {tripMembers.map((member, index) => (
            <div
              key={member.userId + index}
              className="flex items-center justify-between gap-4 px-2"
            >
              <div className="flex items-center gap-2">
                <img src={member.image} alt="user avatar" className="size-8 rounded-full" />
                <span>{member.name}</span>
              </div>
              {member.owner ? (
                <span className="rounded border-[1.5px] border-orange-400 px-2 py-px text-xs font-medium text-orange-500">
                  owner
                </span>
              ) : (
                <span>{member.permissions}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Floating>
  );
}
