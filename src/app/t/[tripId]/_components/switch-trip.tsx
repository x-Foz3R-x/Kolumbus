import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

import { tripFallbackImageUrl } from "~/lib/constants";
import type { MyMembershipSchema } from "~/lib/types";

import TripImage from "~/components/trip-image";
import { useTripContext } from "./trip-provider";
import { CreateTripModal } from "~/components/create-trip-modal";
import { Menu, MenuLink, MenuOption } from "~/components/ui/menu";
import { Icons } from "~/components/ui";

export default function SwitchTrip(props: { myMemberships: MyMembershipSchema[] }) {
  const { createTrip } = useTripContext();

  const [isModalOpen, setModalOpen] = useState(false);

  const myTripMemberships = props.myMemberships.filter(
    (membership) => membership.permissions === -1,
  );
  const sharedTripMemberships = props.myMemberships.filter(
    (membership) => membership.permissions !== -1,
  );

  return (
    <>
      <Menu
        placement="bottom-start"
        animation="fadeToPosition"
        offset={{ mainAxis: 6, crossAxis: -20 }}
        zIndex={50}
        buttonProps={{
          variant: "scale",
          size: "unset",
          className: "h-8 w-6 relative overflow-visible before:rounded before:bg-gray-100",
          children: <Icons.chevronUpDown className="h-4 w-6 scale-100" />,
        }}
      >
        <Link href="/library" className="hover:underline">
          Your Trips
        </Link>
        {myTripMemberships.map((membership, index) => (
          <MenuLink
            key={index}
            href={`/t/${membership.trip.id}`}
            label={membership.trip.name}
            className="relative h-12 min-w-64 text-left"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gray-200">
              <TripImage imageUrl={membership.trip.imageUrl} size="36px" />
            </div>

            <div className="flex flex-col font-light leading-tight">
              {membership.trip.name}

              <span className="text-[12px] text-gray-400">
                {format(new Date(membership.trip.startDate), "d MMM")}
                {" - "}
                {format(new Date(membership.trip.endDate), "d MMM")}
              </span>
            </div>

            <Icons.gripLines className="ml-auto h-1.5 fill-gray-400 px-2 opacity-0 group-hover:opacity-100" />
          </MenuLink>
        ))}

        <MenuOption label="+ New Trip" onClick={() => setModalOpen(true)} />

        {sharedTripMemberships.length > 0 && <div>Shared Trips</div>}
        {sharedTripMemberships.map((membership, index) => (
          <MenuLink
            key={index}
            href={`/t/${membership.trip.id}`}
            label={membership.trip.name}
            className="relative h-12 min-w-64 text-left"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gray-200">
              <Image
                src={membership.trip.imageUrl ? membership.trip.imageUrl : tripFallbackImageUrl}
                alt="Trip photo"
                sizes="224px"
                priority
                fill
              />
            </div>

            <div className="flex flex-col font-light leading-tight">
              {membership.trip.name}

              <span className="text-[12px] text-gray-400">
                {format(new Date(membership.trip.startDate), "d MMM")}
                {" - "}
                {format(new Date(membership.trip.endDate), "d MMM")}
              </span>
            </div>

            <Icons.gripLines className="ml-auto h-1.5 fill-gray-400 px-2 opacity-0 group-hover:opacity-100" />
          </MenuLink>
        ))}
      </Menu>

      <CreateTripModal
        isOpen={isModalOpen}
        setOpen={setModalOpen}
        maxDays={14}
        onCreate={createTrip}
      />
    </>
  );
}
