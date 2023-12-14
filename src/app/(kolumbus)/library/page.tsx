"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import cuid2 from "@paralleldrive/cuid2";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { CalculateDays } from "@/lib/utils";
import { TRIP_IMG_FALLBACK } from "@/lib/config";
import { tripTemplate } from "@/data/template-data";
import { DispatchAction, Trip, UT } from "@/types";

import Icon from "@/components/icons";
import { Button, Input } from "@/components/ui";
import { Dropdown, DropdownLink, DropdownOption } from "@/components/ui/dropdown";
import { Modal, ModalActionSection, ModalBodyWithIcon, ModalMessage, ModalTitle } from "@/components/ui/modal";

export default function Library() {
  const { user } = useUser();
  const { userTrips, dispatchUserTrips } = useAppdata();

  const createTrip = api.trip.create.useMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const newTripName = useRef("");

  const createNewTrip = () => {
    if (!user) return;

    const newTrip: Trip = {
      ...tripTemplate,
      id: cuid2.init({ length: 14 })(),
      userId: user?.id,
      position: userTrips.length,
      ...(newTripName.current.length > 0 && { name: newTripName.current }),
    };

    setModalOpen(false);

    dispatchUserTrips({ type: UT.CREATE_TRIP, trip: newTrip });
    createTrip.mutate(newTrip, {
      onSuccess(trip) {
        if (!trip) return;
        dispatchUserTrips({ type: UT.UPDATE_TRIP, trip });
      },
      onError(error) {
        console.error(error);
        dispatchUserTrips({ type: UT.REPLACE, trips: userTrips });
      },
    });
  };

  return (
    <main className="bg-gray-50 p-5 font-inter">
      <h1 className="m-auto w-full max-w-screen-lg pb-5 pl-5 text-xl font-semibold text-gray-400">Your Trips</h1>

      <div className="m-auto grid w-full max-w-screen-lg grid-cols-[repeat(auto-fit,minmax(14.25rem,_14.25rem))] justify-center gap-x-4 gap-y-6">
        {userTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} userTrips={userTrips} dispatchUserTrips={dispatchUserTrips} />
        ))}

        <Modal
          isOpen={isModalOpen}
          setOpen={setModalOpen}
          size="sm"
          className="shadow-border3XL"
          buttonProps={{
            variant: "unstyled",
            size: "unstyled",
            className:
              "group relative flex h-[20.25rem] items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 fill-gray-400 font-medium text-gray-400 duration-150 ease-kolumb-flow hover:border-gray-500 hover:fill-gray-600 hover:text-gray-600",
            children: (
              <>
                <Icon.plus className="w-2.5" />
                New trip
              </>
            ),
          }}
        >
          <ModalBodyWithIcon variant="primary" icon={<Icon.defaultTrip />}>
            <ModalTitle>Create Trip</ModalTitle>

            <ModalMessage>Enter the details below to create a new trip and start planning your itinerary.</ModalMessage>

            <Input label="Trip name" onChange={(e) => (newTripName.current = e.target.value)} variant="insetLabel" />
          </ModalBodyWithIcon>

          <ModalActionSection>
            <Button onClick={() => setModalOpen(false)} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }} className="px-5">
              Cancel
            </Button>
            <Button
              onClick={createNewTrip}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
              className="whitespace-nowrap bg-kolumblue-500 text-gray-100"
            >
              Create trip
            </Button>
          </ModalActionSection>
        </Modal>
      </div>
    </main>
  );
}

type TripCardProps = {
  trip: Trip;
  userTrips: Trip[];
  dispatchUserTrips: React.Dispatch<DispatchAction>;
};
function TripCard({ trip, userTrips, dispatchUserTrips }: TripCardProps) {
  const updateTrip = api.trip.update.useMutation();
  const deleteTrip = api.trip.delete.useMutation();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const totalEvents = trip.itinerary.flatMap((day) => day.events).length;
  const photos = trip.itinerary
    .flatMap((day) => day.events)
    .filter((event) => event.photo !== null)
    .slice(0, 3)
    .map((event) => event.photo!)
    .join(",");

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const tripDuration = CalculateDays(startDate, endDate);

  const deleteSelectedTrip = () => {
    // Delete the trip from the database
    const handleTripDelete = () => {
      deleteTrip.mutate(
        { tripId: trip.id },
        {
          onError(error) {
            console.error(error);
            dispatchUserTrips({ type: UT.REPLACE, trips: userTrips });
          },
        },
      );
    };

    dispatchUserTrips({ type: UT.DELETE_TRIP, trip });

    const tripsToUpdate = [...userTrips].slice(trip.position + 1);
    tripsToUpdate.forEach((trip, i) => handleUpdateTrip(trip.id, i));

    // Update the position of the trips that are after the trip being deleted
    const handleUpdateTrip = (tripId: string, i: number) => {
      updateTrip.mutate(
        { tripId, data: { position: trip.position + i } },
        {
          onError(error) {
            console.error(error);
            dispatchUserTrips({ type: UT.REPLACE, trips: userTrips });
          },
        },
      );
    };

    handleTripDelete();
  };

  return (
    <div className="relative origin-bottom overflow-hidden rounded-xl border-2 border-white bg-white shadow-borderXL duration-400 ease-kolumb-flow hover:scale-105 hover:shadow-borderSplashXl">
      <Link href={`/t/${trip.id}`}>
        <div className="relative h-56 w-56 overflow-hidden rounded-b-[10px] bg-gray-200">
          <Image
            src={`${photos ? `/api/get-trip-image?photoRefs=${photos}` : TRIP_IMG_FALLBACK}`}
            alt="Trip photo"
            sizes="244px"
            priority
            fill
          />
        </div>

        <div className="px-3 py-2">
          <h2 className="relative w-full overflow-hidden whitespace-nowrap pb-1 text-center" aria-label={trip.name}>
            {trip.name}
            <span className="absolute inset-y-0 right-0 z-50 w-8 bg-gradient-to-r from-transparent to-white" />
          </h2>

          <div className="flex flex-col gap-0.5 text-xs text-gray-500">
            <span className="block">
              {startDate.getDate()} {startDate.toLocaleString("default", { month: "short" })}
              {" - "}
              {endDate.getDate()} {endDate.toLocaleString("default", { month: "short" })}
            </span>

            <span className="block">{`${tripDuration} ${tripDuration > 1 ? "days" : "day"}`}</span>

            <span className="block">{`${totalEvents} ${totalEvents > 1 ? "events" : "event"}`}</span>
          </div>
        </div>
      </Link>

      <Dropdown
        isOpen={isDropdownOpen}
        setOpen={setDropdownOpen}
        listLength={4}
        skipIndexes={[1, 2]}
        placement="bottom-start"
        container={{ selector: "main" }}
        offset={0}
        className="w-44"
        buttonProps={{
          variant: "disabled",
          size: "icon",
          className: "absolute bottom-3.5 right-1 z-50 rotate-90 rounded-full p-3 hover:bg-gray-50",
          children: <Icon.horizontalDots className="w-4" />,
        }}
      >
        <DropdownLink href={`/t/${trip.id}`} index={0}>
          Open
        </DropdownLink>
        <DropdownOption index={1}>Share</DropdownOption>
        <DropdownOption index={2}>Duplicate</DropdownOption>
        <DropdownOption index={3} onClick={() => setModalOpen(true)}>
          Delete
        </DropdownOption>
      </Dropdown>

      <Modal isOpen={isModalOpen} setOpen={setModalOpen} backdrop={{ type: "blur" }} removeButton>
        <ModalBodyWithIcon variant="danger" icon={<Icon.triangleExclamation />}>
          <ModalTitle>Delete Trip</ModalTitle>

          <ModalMessage>Are you sure you want to delete this trip?</ModalMessage>
        </ModalBodyWithIcon>
        <ModalActionSection>
          <Button onClick={() => setModalOpen(false)} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }} className="px-5">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setModalOpen(false);
              deleteSelectedTrip();
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            className="whitespace-nowrap bg-red-500 text-gray-100"
          >
            Delete trip
          </Button>
        </ModalActionSection>
      </Modal>
    </div>
  );
}
