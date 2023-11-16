"use client";

import { useState } from "react";
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

export default function YourTrips({ activeTripId }: { activeTripId: string }) {
  const { user } = useUser();
  const { userTrips, dispatchUserTrips, setSaving } = useAppdata();
  const createTrip = api.trip.create.useMutation();

  const router = useRouter();

  const createNewTrip = () => {
    if (!user) return;

    const newTrip: Trip = { ...tripTemplate, id: cuid2.init({ length: 14 })(), userId: user?.id, position: userTrips.length };

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
    <section className="relative flex flex-col">
      {userTrips?.map((trip: Trip, index: number) => (
        <div key={index} className="relative">
          <button
            onClick={() => router.push(`/t/${trip.id}`)}
            className={
              "group/tripsSection flex h-9 w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium hover:z-10 hover:bg-kolumblue-100 hover:shadow-kolumblueHover " +
              (trip.id === activeTripId && "bg-kolumblue-200 fill-kolumblue-500 text-kolumblue-500 shadow-kolumblueSelected")
            }
          >
            <Icon.defaultTrip
              className={
                "h-4 w-4 flex-none duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem] group-hover/tripsSection:fill-kolumblue-500 " +
                (trip.id !== activeTripId ? "fill-tintedGray-400 " : "fill-kolumblue-500 ")
              }
            />
            <p className="overflow-hidden text-ellipsis whitespace-nowrap duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem]">
              {trip.name}
            </p>
          </button>
          <span className="absolute right-3 top-1.5 z-10">
            <button onClick={deleteTrip} className="rounded-lg p-1.5 hover:bg-black/20">
              <Icon.x className="h-3 w-3" />
            </button>
          </span>
        </div>
      ))}

      <button
        onClick={createNewTrip}
        className="mt-1 flex h-9 items-center justify-center gap-1 rounded-md fill-gray-400 text-sm font-medium text-gray-400 duration-300 ease-kolumb-flow hover:bg-gray-100 hover:fill-gray-600 hover:text-gray-600"
      >
        <Icon.plus className="h-3 w-3" />
        <span>New trip</span>
      </button>
    </section>
  );
}

export function NewTrip() {
  const [isOpen, setOpen] = useState(false);

  const buttonChildren = (
    <>
      <Icon.plus className="absolute right-0 h-3.5 group-hover:right-8" />
      <span className="absolute right-0 top-[2px] h-4 w-20 origin-right scale-x-0 select-none capitalize opacity-0 duration-200 ease-kolumb-flow group-hover:scale-x-100 group-hover:opacity-100">
        New Trip
      </span>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      setOpen={setOpen}
      backdrop={{ type: "none" }}
      className={{ button: "h-6 w-6", modal: "max-w-md shadow-border3XL" }}
      buttonChildren={buttonChildren}
    >
      <ModalBodyWithIcon variant="primary" icon={<Icon.defaultTrip />}>
        <ModalTitle>Create Trip</ModalTitle>

        <ModalMessage>Enter the details below to create a new trip and start planning your itinerary.</ModalMessage>

        <Input label="Trip name" onChange={(e) => {}} variant="insetLabel" />
      </ModalBodyWithIcon>

      <ModalActionSection>
        <Button onClick={() => setOpen(false)} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }} className="px-5">
          Cancel
        </Button>
        <Button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }} className="whitespace-nowrap bg-kolumblue-500 text-gray-100">
          Create trip
        </Button>
      </ModalActionSection>
    </Modal>
  );
}
