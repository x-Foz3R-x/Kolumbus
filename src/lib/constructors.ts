import { add } from "date-fns";

import { formatDate } from "./utils";
import type { Trip } from "./validations/trip";
import type { Membership } from "./validations/membership";
import type { ActivityEventSchema, Event, EventTypes } from "./validations/event";
import type { Currency } from "./validations/db";

export function constructTrip(data: {
  id: string;
  ownerId: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  tierLevel?: number;
  inviteCode?: string;
  inviteCreatedAt?: Date;
}): Trip {
  return {
    id: data.id,
    ownerId: data.ownerId,
    name: data.name ?? "New Trip",
    startDate: data.startDate ?? formatDate(new Date()),
    endDate: data.endDate ?? formatDate(add(new Date(), { days: 4 })),
    image: data.image ?? null,
    tierLevel: data.tierLevel ?? 0,
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
    tripPosition: data.tripPosition,
    permissions: data.permissions ?? 0,
    updatedAt: new Date(),
    createdAt: new Date(),
  };
}

export function constructEvent(event: {
  id: string;
  tripId: string;
  date: string;
  position: number;
  type: EventTypes;
  createdBy: string;
}): Event {
  return {
    id: event.id,
    tripId: event.tripId,
    date: event.date,
    position: event.position,
    type: event.type,
    createdBy: event.createdBy,
    updatedBy: event.createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function constructActivityEvent(event: {
  id: string;
  tripId: string;
  date: string;
  position: number;
  createdBy: string;

  activity: {
    id: string;
    placeId?: string;
    name?: string;
    startTime?: string;
    endTime?: string;
    openingHours?: { day: number; open: string; close?: string }[];
    address?: string;
    phoneNumber?: string;
    website?: string;
    cost?: string;
    currency?: Currency;
    images?: string[];
    imageIndex?: number;
    note?: string;
    url?: string;
  };
}): ActivityEventSchema {
  return {
    ...constructEvent({ ...event, type: "ACTIVITY" }),
    activity: {
      id: event.activity.id,
      eventId: event.id,
      placeId: event.activity.placeId ?? null,
      name: event.activity.name ?? "",
      startTime: event.activity.startTime ?? null,
      endTime: event.activity.endTime ?? null,
      openingHours: event.activity.openingHours ?? [],
      address: event.activity.address ?? null,
      phoneNumber: event.activity.phoneNumber ?? null,
      website: event.activity.website ?? null,
      cost: event.activity.cost ?? "0",
      currency: event.activity.currency ?? "USD",
      images: event.activity.images ?? [],
      imageIndex: event.activity.imageIndex ?? 0,
      note: event.activity.note ?? null,
      url: event.activity.url ?? null,
    },
  };
}
