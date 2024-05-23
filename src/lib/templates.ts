import { add } from "date-fns";
import { formatDate } from "~/lib/utils";
import type { Activity, Event, EventTypes, Membership, Trip } from "~/server/db/schema";
import type { ActivityEvent } from "./validations/event";

export enum MemberPermissionsTemplate {
  // General permissions
  shareInvite = 1 << 0,
  createInvite = 1 << 1,
  kickMembers = 1 << 2,
  managePermissions = 1 << 3,

  // Trip permissions
  editTrip = 1 << 4,
  addEvents = 1 << 5,
  editEvents = 1 << 6,
  deleteEvents = 1 << 7,
  editOwnEvents = 1 << 8,
  deleteOwnEvents = 1 << 9,
}

type CreateTripProps = {
  id: string;
  ownerId: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  inviteCode?: string;
  inviteCreatedAt?: Date;
};
export function createTrip(data: CreateTripProps): Trip {
  return {
    id: data.id,
    ownerId: data.ownerId,
    name: data.name ?? "New Trip",
    startDate: data.startDate ?? formatDate(new Date()),
    endDate: data.endDate ?? formatDate(add(new Date(), { days: 4 })),
    image: data.image ?? null,
    inviteCode: data.inviteCode ?? null,
    inviteCreatedAt: data.inviteCreatedAt ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

type CreateMembershipProps = {
  userId: string;
  tripId: string;
  tripPosition: number;
  owner: boolean;
  permissions?: number;
};
export function createMembership(data: CreateMembershipProps): Membership {
  return {
    userId: data.userId,
    tripId: data.tripId,
    tripPosition: data.tripPosition,
    permissions: data.permissions ?? 0,
    updatedAt: new Date(),
    createdAt: new Date(),
  };
}

type CreateEventProps = {
  id: string;
  tripId: string;
  date: string;
  position: number;
  type: EventTypes;
  createdBy: string;
};
export function createEvent(event: CreateEventProps): Event {
  return {
    id: event.id,
    tripId: event.tripId,
    date: event.date,
    position: event.position,
    type: event.type,
    createdBy: event.createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

type CreateActivityProps = {
  tripId: string;
  eventId: string;
  activityId: string;
  placeId?: string;

  name?: string;
  startTime?: string;
  endTime?: string;
  openingHours?: { day: number; open: string; close?: string }[];
  address?: string;
  phoneNumber?: string;
  website?: string;
  cost?: string;
  currency?: Activity["currency"];
  images?: string[];
  imageIndex?: number;
  note?: string;
  url?: string;

  date: string;
  position: number;
  createdBy: string;
};
export function createActivityEvent(event: CreateActivityProps): ActivityEvent {
  return {
    ...createEvent({ ...event, id: event.eventId, type: "ACTIVITY" }),
    activity: {
      id: event.activityId,
      eventId: event.eventId,
      placeId: event.placeId ?? null,
      name: event.name ?? "",
      startTime: event.startTime ?? null,
      endTime: event.endTime ?? null,
      openingHours: event.openingHours ?? [],
      address: event.address ?? null,
      phoneNumber: event.phoneNumber ?? null,
      website: event.website ?? null,
      cost: event.cost ?? "0",
      currency: event.currency ?? "USD",
      images: event.images ?? [],
      imageIndex: event.imageIndex ?? 0,
      note: event.note ?? null,
      url: event.url ?? null,
    },
  };
}
