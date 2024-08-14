import { z } from "zod";
import { selectMembershipSchema as membership } from "~/server/db/schema";

export { membership };

export const myMembershipSchema = z.object({
  userId: z.string(),
  tripId: z.string(),
  permissions: z.number(),
  sortIndex: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  trip: z.object({
    id: z.string(),
    name: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    imageUrl: z.string(),
    eventCount: z.number(),
  }),
});

export enum MemberPermissionFlags {
  // General permissions
  viewInvite = 1 << 0,
  editInvite = 1 << 1,
  editMembers = 1 << 2,

  // Trip permissions
  editTrip = 1 << 3,
  editItinerary = 1 << 4,
  editBudget = 1 << 5,
  viewDetails = 1 << 6,
}

export type Membership = z.infer<typeof membership>;
export type MyMembershipSchema = z.infer<typeof myMembershipSchema>;
export type MemberPermissions = Record<keyof typeof MemberPermissionFlags, boolean>;
