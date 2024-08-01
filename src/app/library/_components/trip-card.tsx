"use client";

import { memo, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

import { differenceInDays, cn } from "~/lib/utils";

import TripImage from "~/components/trip-image";
import { TripDeleteModal } from "~/components/trip-delete-modal";
import { TripLeaveModal } from "~/components/trip-leave-modal";
import { Menu, MenuLink, MenuOption } from "~/components/ui/menu";
import { Icons, ScrollIndicator } from "~/components/ui";

type TripCardProps = {
  trip: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    eventCount: number;
  };
  onDuplicate?: () => void;
  onDelete?: () => void;
  onLeave?: () => void;
  loading?: boolean;
  shared?: boolean;
};
const TripCard = memo(function TripCard({
  trip,
  onDuplicate: handleDuplicate,
  onLeave: handleLeave,
  onDelete: handleDelete,
  loading,
  shared,
}: TripCardProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLeaveModalOpen, setLeaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const scrollRef = useRef<HTMLHeadingElement>(null);

  const startDate = useMemo(() => new Date(trip.startDate), [trip.startDate]);
  const endDate = useMemo(() => new Date(trip.endDate), [trip.endDate]);
  const tripDuration = useMemo(() => differenceInDays(startDate, endDate), [startDate, endDate]);

  return (
    <li
      className={cn(
        "relative origin-bottom overflow-hidden rounded-xl border-2 border-white bg-white shadow-borderXL duration-400 ease-kolumb-flow hover:scale-[1.03] hover:shadow-borderSplashXl",
        isMenuOpen && "scale-[1.03]",
        loading && "pointer-events-none animate-pulse",
      )}
    >
      <Link href={`/t/${trip.id}`}>
        <div className="relative h-56 w-56 overflow-hidden rounded-b-sm bg-gray-200">
          <TripImage imageUrl={trip.imageUrl} size="224px" />
        </div>

        <div
          ref={scrollRef}
          className="relative w-full overflow-hidden whitespace-nowrap px-2.5 py-2 text-center"
        >
          {trip.name}
          <ScrollIndicator scrollRef={scrollRef} />
        </div>

        <div className="flex w-full flex-col gap-0.5 px-2.5 pb-2 text-xs text-gray-500">
          <div>
            {format(startDate, "d MMM")}
            {" - "}
            {format(endDate, "d MMM")}
          </div>
          <div>{`${tripDuration} ${tripDuration !== 1 ? "days" : "day"}`}</div>
          <div>{`${trip.eventCount} ${trip.eventCount !== 1 ? "events" : "event"}`}</div>
        </div>
      </Link>

      <Menu
        isOpen={isMenuOpen}
        setIsOpen={setMenuOpen}
        placement="bottom-start"
        className="w-32"
        buttonProps={{
          variant: "unset",
          size: "icon",
          className: "absolute bottom-3.5 right-1 z-40 rotate-90 rounded-full p-3 hover:bg-gray-50",
          children: <Icons.horizontalDots className="w-4 overflow-visible" />,
        }}
      >
        <MenuLink label="open" href={`/t/${trip.id}`}>
          Open
        </MenuLink>
        <MenuOption label="share" disabled>
          Share
        </MenuOption>
        {shared ? (
          <MenuOption label="leave" onClick={() => setLeaveModalOpen(true)} variant="danger">
            Leave
          </MenuOption>
        ) : (
          <>
            <MenuOption label="duplicate" onClick={handleDuplicate}>
              Duplicate
            </MenuOption>
            <MenuOption label="Delete" onClick={() => setDeleteModalOpen(true)} variant="danger">
              Delete
            </MenuOption>
          </>
        )}
      </Menu>

      <TripLeaveModal
        isOpen={isLeaveModalOpen}
        setOpen={setLeaveModalOpen}
        onLeave={handleLeave!}
      />
      <TripDeleteModal
        isOpen={isDeleteModalOpen}
        setOpen={setDeleteModalOpen}
        onDelete={handleDelete!}
      />
    </li>
  );
});

export default TripCard;
