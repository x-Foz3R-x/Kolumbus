import { format } from "date-fns";
import Image from "next/image";
import type { TripContext } from "~/lib/validations/trip";

import { Icons } from "~/components/ui";
import { Menu, MenuLink, MenuOption } from "~/components/ui/menu";
import { tripFallbackUrl } from "~/lib/constants";

export default function SwitchTrip(props: { myMemberships: TripContext["myMemberships"] }) {
  const myTripMemberships = props.myMemberships.filter((membership) => membership.tripOwner);
  const sharedTripMemberships = props.myMemberships.filter((membership) => !membership.tripOwner);

  return (
    <Menu
      placement="bottom-start"
      animation="fadeToPosition"
      offset={{ mainAxis: 6, crossAxis: -20 }}
      zIndex={50}
      buttonProps={{
        variant: "scale",
        size: "unset",
        className: "h-8 w-6 relative overflow-visible before:rounded before:bg-gray-100",
        children: <Icons.chevronUpDown className="h-4 w-full scale-100 overflow-visible" />,
      }}
    >
      <h2>Your Trips</h2>
      {myTripMemberships.map((membership, index) => (
        <MenuLink
          key={index}
          href={`/t/${membership.tripId}`}
          label={membership.tripName}
          className="relative h-12 min-w-64 text-left"
        >
          <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gray-200">
            <Image
              src={membership.tripImage ? membership.tripImage : tripFallbackUrl}
              alt="Trip photo"
              sizes="224px"
              priority
              fill
            />
          </div>

          <div className="flex flex-col font-light leading-tight">
            {membership.tripName}

            <span className="text-[12px] text-gray-400">
              {format(membership.tripStartDate, "d MMM")}
              {" - "}
              {format(membership.tripEndDate, "d MMM")}
            </span>
          </div>

          <Icons.gripLines className="ml-auto h-1.5 fill-gray-400 px-2 opacity-0 group-hover:opacity-100" />
        </MenuLink>
      ))}
      <MenuOption label="+ New Trip"></MenuOption>
    </Menu>
  );
}
