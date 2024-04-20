import type { Event, EventTypes, Membership, Trip } from "~/server/db/schema";
import { formatDate } from "~/lib/utils";
import { add } from "date-fns";

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

type BuildTripProps = {
  id: string;
  ownerId: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  inviteCode?: string;
  inviteCreatedAt?: Date;
};
export function buildTrip(data: BuildTripProps): Trip {
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

type BuildMembershipProps = {
  userId: string;
  tripId: string;
  tripPosition: number;
  owner: boolean;
  permissions?: number;
};
export function buildMembership(data: BuildMembershipProps): Membership {
  return {
    userId: data.userId,
    tripId: data.tripId,
    tripPosition: data.tripPosition,
    owner: data.owner,
    permissions: data.permissions ?? 0,
    updatedAt: new Date(),
    createdAt: new Date(),
  };
}

type BuildEventProps = {
  id: string;
  tripId: string;
  date: string;
  position: number;
  type: EventTypes;
  createdBy: string;
};
export function buildEvent(event: BuildEventProps): Event {
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
