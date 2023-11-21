"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import cuid2 from "@paralleldrive/cuid2";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { tripTemplate } from "@/data/template-data";
import { Trip, UT } from "@/types";

import Icon from "./icons";
import { Modal, ModalActionSection, ModalBodyWithIcon, ModalMessage, ModalTitle } from "./ui/modal";
import { Dropdown, DropdownList, DropdownOption } from "./ui/dropdown";
import Button from "./ui/button";
import Input from "./ui/input";

export default function YourTrips() {
  const { user } = useUser();
  const { userTrips, dispatchUserTrips, selectedTrip } = useAppdata();

  const router = useRouter();

  const createTrip = api.trip.create.useMutation();
  const updateTrip = api.trip.update.useMutation();
  const deleteTrip = api.trip.delete.useMutation();

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
  const deleteSelectedTrip = (index: number) => {
    if (!user) return;

    const tripToDelete = userTrips[index];

    // Redirect if the deleted trip is the selected one
    if (index === selectedTrip) {
      const redirectTripId = index === 0 ? userTrips[1].id : userTrips[index - 1].id;
      router.push(`/t/${redirectTripId}`);
    }

    // Update the position of the trips that are after the trip being deleted
    const handleUpdateTrip = (tripId: string, i: number) => {
      updateTrip.mutate(
        { tripId, data: { position: index + i } },
        {
          onError(error) {
            console.error(error);
            dispatchUserTrips({ type: UT.REPLACE, trips: userTrips });
          },
        },
      );
    };

    // Delete the trip from the database
    const handleDeleteTrip = () => {
      deleteTrip.mutate(
        { tripId: tripToDelete.id },
        {
          onError(error) {
            console.error(error);
            dispatchUserTrips({ type: UT.REPLACE, trips: userTrips });
            router.push(`/t/${tripToDelete.id}`);
          },
        },
      );
    };

    dispatchUserTrips({ type: UT.DELETE_TRIP, trip: tripToDelete });

    const tripsToUpdate = [...userTrips].slice(index + 1);
    tripsToUpdate.forEach((trip, i) => handleUpdateTrip(trip.id, i));

    handleDeleteTrip();
  };
  const swapTripsPosition = (firstIndex: number, secondIndex: number) => {
    if (!user) return;

    const newTrips = [...userTrips];

    // Swap elements using destructuring assignment
    [newTrips[firstIndex], newTrips[secondIndex]] = [newTrips[secondIndex], newTrips[firstIndex]];

    dispatchUserTrips({ type: UT.REPLACE, trips: newTrips });

    const updatePosition = (tripId: string, position: number) => {
      updateTrip.mutate(
        { tripId, data: { position } },
        {
          onError(error) {
            console.error(error);
            dispatchUserTrips({ type: UT.REPLACE, trips: userTrips });
          },
        },
      );
    };

    updatePosition(userTrips[firstIndex].id, secondIndex);
    updatePosition(userTrips[secondIndex].id, firstIndex);
  };

  const TripDropdown = ({ index }: { index: number }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const dropdownList: DropdownList = [
      { index: 0, onSelect: () => swapTripsPosition(index, index - 1), skip: index === 0 },
      { index: 1, onSelect: () => swapTripsPosition(index, index + 1), skip: index === userTrips.length - 1 },
      { index: 2, onSelect: () => {}, skip: true },
      { index: 3, onSelect: () => setModalOpen(true) },
    ];

    return (
      <>
        <Dropdown
          isOpen={isDropdownOpen}
          setOpen={setDropdownOpen}
          list={dropdownList}
          className="w-40"
          buttonProps={{
            variant: "scale",
            size: "icon",
            className: "flex h-6 w-6 items-center justify-center p-0 before:bg-kolumblue-500/20",
            children: <Icon.horizontalDots className="w-3.5" />,
          }}
        >
          <DropdownOption index={0} className="rounded-t-lg">
            Move up
          </DropdownOption>
          <DropdownOption index={1}>Move down</DropdownOption>
          <DropdownOption index={2}>Duplicate</DropdownOption>
          <DropdownOption index={3} className="rounded-b-lg">
            Delete
          </DropdownOption>
        </Dropdown>

        <Modal isOpen={isModalOpen} setOpen={setModalOpen} backdrop={{ type: "blur" }} removeButton>
          <ModalBodyWithIcon variant="danger" icon={<Icon.exclamationTriangle />}>
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
                deleteSelectedTrip(index);
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
              className="whitespace-nowrap bg-red-500 text-gray-100"
            >
              Delete trip
            </Button>
          </ModalActionSection>
        </Modal>
      </>
    );
  };

  return (
    <section className="flex flex-col gap-2 px-3 pb-3">
      <div className="flex items-center justify-between">
        <h2 className="cursor-default font-adso text-xl font-bold text-tintedGray-400">Your trips</h2>

        <Modal
          isOpen={isModalOpen}
          setOpen={setModalOpen}
          backdrop={{ type: "none" }}
          className="max-w-md shadow-border3XL"
          buttonProps={{
            variant: "unstyled",
            className: "h-6 w-6 fill-tintedGray-400 text-tintedGray-400",
            children: (
              <>
                <Icon.plus className="absolute right-0 h-6 w-6 flex-shrink-0 flex-grow p-1.5 duration-200 ease-kolumb-flow group-hover:right-14" />
                <span className="absolute right-0 h-6 origin-right scale-x-0 select-none whitespace-nowrap pt-0.5 font-medium opacity-0 duration-200 ease-kolumb-flow group-hover:scale-x-100 group-hover:opacity-100">
                  New Trip
                </span>
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

      <ul className="flex flex-col">
        {userTrips?.map((trip: Trip, index: number) => (
          <li key={trip.id} className="group/trip relative">
            <Button
              onClick={() => router.push(`/t/${trip.id}`)}
              variant="scale"
              size="default"
              className={cn(
                "peer w-full gap-3 font-medium before:bg-kolumblue-100 before:shadow-kolumblueSelected group-hover/trip:before:scale-100 group-hover/trip:before:opacity-100",
                index !== selectedTrip
                  ? "fill-tintedGray-400"
                  : "fill-kolumblue-500 text-kolumblue-500 group-hover/trip:fill-kolumblue-500 group-hover/trip:text-kolumblue-500",
              )}
              animatePress
            >
              <Icon.defaultTrip className="h-4 w-4 duration-300 ease-kolumb-overflow group-hover/trip:translate-x-1.5 group-hover:translate-x-1.5" />
              <p className="overflow-hidden text-ellipsis whitespace-nowrap duration-300 ease-kolumb-overflow group-hover/trip:translate-x-1.5 group-hover:translate-x-1.5">
                {trip.name}
              </p>
            </Button>

            <span className="absolute right-2 top-1 z-10 opacity-0 duration-300 ease-kolumb-leave group-hover/trip:opacity-100 group-hover/trip:ease-kolumb-flow">
              <TripDropdown index={index} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
