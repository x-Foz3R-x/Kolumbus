import { z } from "zod";
import { selectMembershipSchema as membership } from "~/server/db/schema";

export { membership };

export const myMembershipSchema = z.object({
  userId: z.string(),
  tripId: z.string(),
  permissions: z.number(),
  tripPosition: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  trip: z.object({
    id: z.string(),
    name: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    image: z.string(),
    eventCount: z.number(),
  }),
});

export enum MemberPermissionFlags {
  // General permissions
  shareInvite = 1 << 0,
  editInvite = 1 << 1,
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

export type Membership = z.infer<typeof membership>;
export type MyMembershipSchema = z.infer<typeof myMembershipSchema>;
export type MemberPermissions = Record<keyof typeof MemberPermissionFlags, boolean>;
