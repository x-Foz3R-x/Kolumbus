"use client";

import { useRouter } from "next/navigation";
import useAppdata from "@/context/appdata";
import Icon from "./icons";
import { Trip } from "@/types";

export default function Trips({ tripId }: { tripId: string }) {
  const { userTrips } = useAppdata();
  const router = useRouter();

  const handleAddTrip = async () => {};

  return (
    <section className="relative flex flex-col">
      <p className="absolute -top-8 right-0 text-sm text-gray-400">[disk size in KB]</p>

      {userTrips?.map((trip: Trip, index: number) => (
        <button
          key={index}
          onClick={() => router.push(`/t/${trip.id}`)}
          className={
            "group/tripsSection flex h-9 items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium hover:z-10 hover:bg-kolumblue-100 hover:shadow-kolumblueHover " +
            (trip.id === tripId &&
              "bg-kolumblue-200 fill-kolumblue-500 text-kolumblue-500 shadow-kolumblueSelected")
          }
        >
          <Icon.defaultTrip
            className={
              "h-4 w-4 flex-none duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem] group-hover/tripsSection:fill-kolumblue-500 " +
              (trip.id !== tripId ? "fill-tintedGray-400 " : "fill-kolumblue-500 ")
            }
          />
          <p className="overflow-hidden text-ellipsis whitespace-nowrap duration-200 ease-kolumb-overflow group-hover/tripsSection:translate-x-[0.375rem]">
            {trip.name}
          </p>
        </button>
      ))}

      <button
        onClick={handleAddTrip}
        className="mt-1 flex h-9 items-center justify-center gap-1 rounded-md fill-gray-400 text-sm font-medium capitalize text-gray-400 duration-300 ease-kolumb-flow hover:bg-gray-100 hover:fill-gray-600 hover:text-gray-600"
      >
        <Icon.plus className="h-3 w-3" />
        <p>add trip</p>
      </button>
    </section>
  );
}
