import { add } from "date-fns";

import { formatDate } from "./utils";

import type { Trip } from "./validations/trip";
import type { Membership } from "./validations/membership";
import type { Place } from "./validations/place";

export function constructTrip(data: {
  id: string;
  ownerId: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  inviteCode?: string;
  inviteCreatedAt?: Date;
}): Trip {
  return {
    id: data.id,
    ownerId: data.ownerId,
    name: data.name ?? "Trip to ...",
    startDate: data.startDate ?? formatDate(new Date()),
    endDate: data.endDate ?? formatDate(add(new Date(), { days: 4 })),
    imageUrl: data.imageUrl ?? null,
    inviteCode: data.inviteCode ?? null,
    inviteCreatedAt: data.inviteCreatedAt ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function constructMembership(data: {
  userId: string;
  tripId: string;
  tripPosition: number;
  permissions?: number;
}): Membership {
  return {
    userId: data.userId,
    tripId: data.tripId,
    sortIndex: data.tripPosition,
    permissions: data.permissions ?? 0,
    updatedAt: new Date(),
    createdAt: new Date(),
  };
}

export function constructPlace(place: {
  id: string;
  tripId: string;
  googleId?: string;
  name?: string;
  address?: string;
  startTime?: string;
  endTime?: string;
  phoneNumber?: string;
  cost?: string;
  website?: string;
  note?: string;
  imageUrl?: string;
  dayIndex: number;
  sortIndex: number;
  createdBy: string;
}): Place {
  return {
    id: place.id,
    tripId: place.tripId,
    googleId: place.googleId ?? null,

    name: place.name ?? null,
    address: place.address ?? null,
    startTime: place.startTime ?? null,
    endTime: place.endTime ?? null,
    phoneNumber: place.phoneNumber ?? null,
    cost: place.cost ?? "0",
    website: place.website ?? null,
    note: place.note ?? null,
    imageUrl: place.imageUrl ?? null,

    dayIndex: place.dayIndex,
    sortIndex: place.sortIndex,
    createdBy: place.createdBy,
    updatedBy: place.createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
