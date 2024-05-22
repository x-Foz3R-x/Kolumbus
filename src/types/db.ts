import type { MemberPermissionsTemplate } from "~/lib/templates";
import type { Membership } from "~/server/db/schema";

export type MemberPermissions = Record<keyof typeof MemberPermissionsTemplate, boolean>;

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

export type UserRoleLimits = {
  membershipsLimit: number;
  daysLimit: number;
  eventsLimit: number;
};
