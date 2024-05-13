/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import type { TripContext } from "~/lib/validations/trip";

import { Button, Divider, Icons, Input } from "~/components/ui";
import Link from "next/link";
import { Floating } from "~/components/ui/floating";
import Switch from "~/components/ui/switch";
import { env } from "~/env";
import SwitchTrip from "./switch-trip";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { toastHandler } from "~/lib/trpc";
import { useRouter } from "next/navigation";

export default function TopNav(props: {
  trip: TripContext["trip"];
  myMemberships: TripContext["myMemberships"];
}) {
  const router = useRouter();

  const createTripInvite = api.trip.createInvite.useMutation(toastHandler());
  const deleteTripInvite = api.trip.deleteInvite.useMutation(toastHandler());

  const [tripName, setTripName] = useState(props.trip.name);
  const [invite, setInvite] = useState(props.trip.inviteCode);

  console.log(props.trip);

  const switchInvite = (checked: boolean) => {
    if (checked) {
      setInvite("loading");
      createTripInvite.mutate(
        { id: props.trip.id },
        {
          onSuccess: (inviteCode) => setInvite(inviteCode),
          onError: () => setInvite(null),
        },
      );
    } else {
      setInvite(null);
      deleteTripInvite.mutate({ id: props.trip.id }, { onError: () => router.refresh() });
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b bg-white/80 px-[1.375rem] backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
      <section className="flex h-full flex-shrink-0 items-center justify-end gap-2">
        <Link
          href="/"
          className="flex origin-left items-center gap-2 font-belanosima text-lg font-bold text-kolumblue-500"
        >
          <Icons.logo2 className="h-6 fill-kolumblue-500" />
        </Link>

        <Icons.slash className="size-[22px] stroke-gray-300" />

        <div className="flex items-center gap-2">
          <Input
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className={{
              container: "h-fit",
              input:
                "rounded bg-transparent px-0 py-0.5 font-normal shadow-none duration-300 ease-kolumb-flow hover:bg-black/5 hover:shadow-sm focus:bg-white focus:px-2 focus:shadow-focus",
              dynamic: "peer-hover:px-2 peer-focus:px-2",
            }}
            preventEmpty
            dynamicWidth
          />

          <SwitchTrip myMemberships={props.myMemberships} />
        </div>
      </section>

      <section className="flex h-full flex-shrink-0 items-center justify-end gap-2">
        <Icons.calendar className="h-8 fill-kolumblue-500" />
        <Icons.rangeCalendar className="h-8 fill-kolumblue-500" />
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
              <Switch checked={!!invite} onChange={switchInvite} />
            </div>

            <Input
              value={
                !!invite && invite !== "loading"
                  ? `${env.NEXT_PUBLIC_APP_URL}/invite/${invite}`
                  : ""
              }
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
              {[...props.trip.members, ...props.trip.members].map((member, index) => (
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
      </section>
    </nav>
  );
}
