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

export default function TopNav(props: {
  trip: TripContext["trip"];
  myMemberships: TripContext["myMemberships"];
}) {
  const [trip] = useState(props.trip);
  const [tripName, setTripName] = useState(props.trip.name);
  const [invite, setInvite] = useState(!!props.trip.inviteCode);

  console.log(trip);

  return (
    <nav className="sticky inset-x-0 top-0 z-50 h-14 border-b bg-white bg-white/80 backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between overflow-hidden px-8">
        <section className="flex h-full flex-shrink-0 items-center justify-end gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-belanosima text-lg font-bold text-kolumblue-500"
          >
            <Icons.mark className="mb-2 h-6 fill-gray-800" />
            Kolumbus
          </Link>

          <Icons.slash className="size-[22px] stroke-gray-300" />

          <div className="flex items-center gap-2">
            <Input
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className={{
                container: "h-fit",
                input:
                  "rounded bg-transparent px-0 py-0.5 shadow-none duration-300 ease-kolumb-flow hover:bg-black/5 hover:shadow-sm focus:bg-white focus:px-2 focus:shadow-focus",
                dynamic: "peer-hover:px-2 peer-focus:px-2",
              }}
              preventEmpty
              dynamicWidth
            />

            <SwitchTrip myMemberships={props.myMemberships} />
          </div>
        </section>

        <section className="flex h-full flex-shrink-0 items-center justify-end gap-4">
          <Icons.calendar className="h-8 fill-kolumblue-500" />
          <Icons.rangeCalendar className="h-8 fill-kolumblue-500" />
          <Floating
            placement="bottom-end"
            offset={{ mainAxis: 6, crossAxis: 8 }}
            className="w-[23.5rem] space-y-4 rounded-xl bg-white px-2 py-4 shadow-floating"
            zIndex={50}
            triggerProps={{ children: <Icons.members className="h-4" /> }}
          >
            <div className="flex flex-col gap-4 rounded-lg">
              <div className="flex justify-between gap-2 px-2">
                Invite
                <Switch checked={invite} onChange={(checked) => setInvite(checked)} />
              </div>

              <Input
                value={
                  trip.inviteCode ? `${env.NEXT_PUBLIC_APP_URL}/invite/${trip.inviteCode}` : ""
                }
                className={{
                  container: "rounded-lg shadow-sm",
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
                {[...trip.members, ...trip.members].map((member, index) => (
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
      </div>
    </nav>
  );
}
