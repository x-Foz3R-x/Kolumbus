"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import cuid2 from "@paralleldrive/cuid2";
import { useUser } from "@clerk/nextjs";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { tripTemplate } from "@/data/template-data";
import { USER_ROLE } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Trip, UT } from "@/types";

import Icon from "../../icons";
import { Button } from "../../ui";
import { Menu, MenuOption } from "@/components/ui/menu";
import { CreateTripModal } from "@/components/create-trip-modal";
import { ConfirmTripDelete } from "@/components/confirm-trip-delete";

export default function YourTrips() {
  const { user } = useUser();
  const { userTrips, dispatchUserTrips, selectedTrip } = useAppdata();
  const createTrip = api.trip.create.useMutation();
  const updateTrip = api.trip.update.useMutation();
  const deleteTrip = api.trip.delete.useMutation();
  const router = useRouter();

  const [tripName, setTripName] = useState("");

  const createNewTrip = () => {
    if (!user) return;

    const newTrip: Trip = {
      ...tripTemplate,
      id: cuid2.init({ length: 14 })(),
      userId: user?.id,
      position: userTrips.length,
      ...(tripName.length > 0 && { name: tripName }),
    };

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

    setTripName("");
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

    dispatchUserTrips({ type: UT.DELETE_TRIP, trip: tripToDelete });

    const tripsToUpdate = [...userTrips].slice(index + 1);
    tripsToUpdate.forEach((trip, i) => handleUpdateTrip(trip.id, i));

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
    const [isModalOpen, setModalOpen] = useState(false);

    const handleDelete = () => {
      deleteSelectedTrip(index);
    };

    return (
      <>
        <Menu
          offset={{ mainAxis: 12, crossAxis: -4 }}
          className="w-40"
          rootSelector="#sidebar"
          buttonProps={{
            variant: "scale",
            size: "icon",
            className: "flex h-6 w-6 items-center justify-center p-0 before:bg-kolumblue-200",
            children: <Icon.horizontalDots className="w-3.5" />,
          }}
        >
          <MenuOption label="move up" onClick={() => swapTripsPosition(index, index - 1)} disabled={index === 0}>
            Move up
          </MenuOption>
          <MenuOption label="move down" onClick={() => swapTripsPosition(index, index + 1)} disabled={index === userTrips.length - 1}>
            Move down
          </MenuOption>
          <MenuOption label="delete" onClick={() => setModalOpen(true)} variant="danger">
            Delete
          </MenuOption>
        </Menu>

        <ConfirmTripDelete isOpen={isModalOpen} setOpen={setModalOpen} onDelete={handleDelete} />
      </>
    );
  };

  return (
    <section className="flex flex-col gap-2 px-3 pb-3">
      <div className="flex items-center justify-between">
        <h2 className="cursor-default font-adso text-xl font-bold text-tintedGray-400">Your trips</h2>

        <CreateTripModal
          onCreate={createNewTrip}
          buttonProps={{
            variant: "unset",
            size: "unset",
            className: "relative h-6",
            children:
              userTrips.length === USER_ROLE.TRIPS_LIMIT ? (
                <div className="h-6 whitespace-nowrap pt-0.5 text-sm font-medium text-tintedGray-400">
                  {`${userTrips.length}/${USER_ROLE.TRIPS_LIMIT}`}
                </div>
              ) : (
                <>
                  <Icon.plus className="absolute right-0 top-0 h-6 w-6 fill-tintedGray-400 p-1.5 duration-200 ease-kolumb-flow group-hover:right-14" />
                  <span className="absolute right-0 top-0 h-6 origin-right scale-x-0 select-none whitespace-nowrap pt-0.5 text-sm font-medium text-tintedGray-400 opacity-0 duration-200 ease-kolumb-flow group-hover:scale-x-100 group-hover:opacity-100">
                    New Trip
                  </span>
                </>
              ),
          }}
        />
      </div>

      <ul className="flex flex-col">
        {userTrips?.map((trip: Trip, index: number) => (
          <li key={trip.id} className="group/trip relative">
            <Button
              onClick={() => router.push(`/t/${trip.id}`)}
              variant="scale"
              size="default"
              className={cn(
                "relative flex w-full cursor-default items-center gap-3 font-medium before:bg-kolumblue-100 before:shadow-kolumblueSelected group-hover/trip:before:scale-100 group-hover/trip:before:opacity-100",
                index !== selectedTrip
                  ? "fill-gray-700 text-gray-700"
                  : "fill-kolumblue-500 text-kolumblue-500 group-hover/trip:fill-kolumblue-500 group-hover/trip:text-kolumblue-500",
              )}
              animatePress
            >
              <Icon.defaultTrip className="h-4 w-4 flex-shrink-0 duration-300 ease-kolumb-overflow group-hover/trip:translate-x-1.5" />

              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-left duration-300 ease-kolumb-overflow group-hover/trip:w-[7.5rem] group-hover/trip:translate-x-1.5">
                {trip.name}
              </div>
            </Button>

            <span className="absolute right-2 top-1 z-10 opacity-0 duration-300 ease-kolumb-out group-hover/trip:opacity-100 group-hover/trip:ease-kolumb-flow">
              <TripDropdown index={index} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
