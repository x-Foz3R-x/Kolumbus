"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import cuid2 from "@paralleldrive/cuid2";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { useUser } from "@clerk/nextjs";

import { tripTemplate } from "@/data/template-data";
import { Trip, UT } from "@/types";
import Icon from "./icons";
import Modal, { ModalActionSection, ModalBodyWithIcon, ModalMessage, ModalTitle } from "./ui/modal";
import Button from "./ui/button";
import Input from "./ui/input";
import { cn } from "@/lib/utils";
import { Dropdown, DropdownList, DropdownOption } from "./ui/dropdown";

export default function YourTrips({ activeTripId }: { activeTripId: string }) {
  const { user } = useUser();
  const { userTrips, dispatchUserTrips, setSaving } = useAppdata();
  const createTrip = api.trip.create.useMutation();

  const router = useRouter();

  const newTripName = useRef("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownList: DropdownList = [
    {
      index: 0,
      onSelect: () => {
        console.log("first");
      },
    },
    { index: 1, onSelect: () => {} },
    { index: 2, onSelect: () => {} },
    { index: 3, onSelect: () => {} },
  ];

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
    setSaving(true);
    dispatchUserTrips({ type: UT.CREATE_TRIP, trip: newTrip });
    createTrip.mutate(newTrip, {
      onSuccess(trip) {
        if (!trip) return;
        dispatchUserTrips({ type: UT.UPDATE_TRIP, trip });
      },
      onError(error) {
        console.error(error);
        dispatchUserTrips({ type: UT.REPLACE, userTrips });
      },
      onSettled() {
        setSaving(false);
      },
    });
  };

  const deleteTrip = () => {
    if (!user) return;

    const currentUserTrips: Trip[] = userTrips;
    const newTrips = [...userTrips];

    const tripIndex = newTrips.findIndex((trip) => trip.id === activeTripId);
    if (tripIndex === -1) return;

    newTrips.splice(tripIndex, 1);
    dispatchUserTrips({ type: UT.REPLACE, userTrips: newTrips });

    // api.trip.delete
    //   .useMutation({ tripId })
    //   .then((trip) => {
    //     if (!trip) return;
    //     dispatchUserTrips({ type: UT.UPDATE_TRIP, payload: { trip } });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     dispatchUserTrips({ type: UT.REPLACE, userTrips: currentUserTrips });
    //   });
  };

  return (
    <section className="flex flex-col gap-2 px-3 pb-3">
      <div className="flex items-center justify-between">
        <h2 className="cursor-default font-adso text-xl font-bold text-tintedGray-400">Your trips</h2>

        <Modal
          isOpen={isModalOpen}
          setOpen={setModalOpen}
          backdrop={{ type: "none" }}
          buttonVariant="unstyled"
          className={{ button: "h-6 w-6 fill-tintedGray-400 text-tintedGray-400", modal: "max-w-md shadow-border3XL" }}
          buttonChildren={
            <>
              <Icon.plus className="absolute right-0 h-6 w-6 flex-shrink-0 flex-grow p-1.5 duration-200 ease-kolumb-flow group-hover:right-14" />
              <span className="absolute right-0 h-6 origin-right scale-x-0 select-none whitespace-nowrap pt-0.5 font-medium opacity-0 duration-200 ease-kolumb-flow group-hover:scale-x-100 group-hover:opacity-100">
                New Trip
              </span>
            </>
          }
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
          <li key={index} className="relative">
            <span className="peer absolute right-2 top-1 z-10 duration-300 ease-kolumb-overflow">
              <Dropdown
                isOpen={isDropdownOpen}
                setOpen={setDropdownOpen}
                list={dropdownList}
                buttonVariant="scale"
                buttonSize="icon"
                className={{ button: "flex h-6 w-6 items-center justify-center p-0 before:bg-kolumblue-500/20", dropdown: "w-36" }}
                buttonChildren={<Icon.horizontalDots className="w-3.5" />}
              >
                <DropdownOption index={0}>Move up</DropdownOption>
                <DropdownOption index={1}>Move down</DropdownOption>
                <DropdownOption index={2}>Duplicate</DropdownOption>
                <DropdownOption index={3}>Delete</DropdownOption>
              </Dropdown>
              {/* <Button variant="scale" size="icon" className="flex h-6 w-6 items-center justify-center p-0 before:bg-black/10" animatePress>
                <Icon.horizontalDots className="w-3.5" />
              </Button> */}
              {/* <button onClick={deleteTrip} className="rounded-lg p-1.5 hover:bg-black/20">
                <Icon.horizontalDots className="h-3 w-3" />
              </button> */}
            </span>

            <Button
              onClick={() => router.push(`/t/${trip.id}`)}
              variant="scale"
              size="default"
              className={cn(
                "peer w-full gap-3 font-medium before:bg-kolumblue-100 before:shadow-kolumblueSelected peer-hover:before:scale-100 peer-hover:before:opacity-100",
                trip.id !== activeTripId
                  ? "fill-tintedGray-400"
                  : "fill-kolumblue-500 text-kolumblue-500 hover:fill-kolumblue-500 hover:text-kolumblue-500",
              )}
              animatePress
            >
              <Icon.defaultTrip className="h-4 w-4 duration-300 ease-kolumb-overflow group-hover:translate-x-1.5 peer-hover:translate-x-1.5" />
              <p className="overflow-hidden text-ellipsis whitespace-nowrap duration-300 ease-kolumb-overflow group-hover:translate-x-1.5 peer-hover:translate-x-1.5">
                {trip.name}
              </p>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
