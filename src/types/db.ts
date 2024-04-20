import type { Membership } from "~/server/db/schema";

export type MemberPermissions = {
  // General permissions
  shareInvite: boolean;
  createInvite: boolean;
  kickMembers: boolean;
  managePermissions: boolean;

  // Trip permissions
  editTrip: boolean;
  addEvents: boolean;
  editEvents: boolean;
  deleteEvents: boolean;
  editOwnEvents: boolean;
  deleteOwnEvents: boolean;
};

export type MyMembership = Membership & {
  trip: {
    name: string;
    startDate: string;
    endDate: string;
    image: string | null;
    events: { images: string[] | null; imageIndex: number }[];
    eventCount: number;
  };
};

export type MyUserRole = {
  role: string;
  membershipsLimit: number;
  daysLimit: number;
  eventsLimit: number;
};
