import { Event, Membership, Trip } from "@/db/schema";
import { formatDate } from "@/lib/utils";

type TripTemplate = {
  id: string;
  ownerId: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  photo?: string;
  inviteCode?: string;
  inviteCreatedAt?: Date;
};
export function TRIP_TEMPLATE(data: TripTemplate): Trip {
  return {
    id: data.id,
    ownerId: data.ownerId,
    name: data.name ?? "New Trip",
    startDate: data.startDate ?? formatDate(new Date()),
    endDate: data.endDate ?? formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 4)),
    photo: data.photo ?? null,
    inviteCode: data.inviteCode ?? null,
    inviteCreatedAt: data.inviteCreatedAt ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

type MembershipTemplate = {
  userId: string;
  tripId: string;
  tripPosition: number;
  owner: boolean;
  permissions?: number;
};
export function MEMBERSHIP_TEMPLATE(data: MembershipTemplate): Membership {
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

type EventData = {
  id: string;
  tripId: string;
  date: string;
  position: number;
  createdBy: string;
};
export function EVENT_TEMPLATE(event: EventData): Event {
  return {
    id: event.id,
    tripId: event.tripId,
    date: event.date,
    position: event.position,
    type: "ACTIVITY",
    createdBy: event.createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
