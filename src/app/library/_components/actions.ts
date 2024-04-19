"use server";

import { revalidatePath } from "next/cache";
import type { Trip } from "~/server/db/schema";
import { createTrip as insertTrip } from "~/server/queries";

export const createTrip = async (trip: Omit<Trip, "ownerId">, position: number) => {
  // const { userId } = auth();

  // if (!userId) return;

  // const newTripPosition = tripMemberships.length;

  // const newTrip = buildTrip({ id: createId(10), name });
  // const newMembership = buildMembership({
  //   userId,
  //   tripId: newTrip.id,
  //   tripPosition: newTripPosition,
  //   owner: true,
  // });

  // const newExtendedMembership: Membership = {
  //   ...newMembership,
  //   trip: {
  //     name: newTrip.name,
  //     startDate: newTrip.startDate,
  //     endDate: newTrip.endDate,
  //     image: newTrip.image,
  //     events: [],
  //     eventCount: 0,
  //   },
  // };

  // tripMemberships.push(newExtendedMembership);

  await insertTrip({ ...trip, position: position });
  // revalidatePath("/library");
};
