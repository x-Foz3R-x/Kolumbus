import { and, eq, gt, ne, sql } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

import { error } from "~/lib/trpc";
import { createId } from "~/lib/utils";
import {
  createTripSchema,
  duplicateTripSchema,
  findInviteSchema,
  tripIdSchema,
  updateInviteSchema,
  updateTripSchema,
} from "~/lib/validations/trip";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import analyticsServerClient from "~/server/analytics";
import {
  enforceMembershipLimit,
  enforceRateLimit,
  getMyMembershipDecodedPermissions,
  getMyMembershipsCount,
  getTripMemberCount,
  isUserMemberOfTrip,
} from "~/server/queries";
import { memberships, places, trips } from "~/server/db/schema";

export const tripRouter = createTRPCRouter({
  create: protectedProcedure.input(createTripSchema).mutation(async ({ ctx, input }) => {
    const { sortIndex, ...trip } = input;

    await enforceRateLimit(ctx.user.id);
    await ctx.db.transaction(async (tx) => {
      await enforceMembershipLimit(tx, ctx.user.id);
      await tx.insert(trips).values({ ...trip, ownerId: ctx.user.id });
      await tx.insert(memberships).values({
        tripId: trip.id,
        userId: ctx.user.id,
        sortIndex,
        permissions: -1,
      });
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "create trip",
      properties: { tripId: trip.id },
    });
  }),
  duplicate: protectedProcedure.input(duplicateTripSchema).mutation(async ({ ctx, input }) => {
    const { id, duplicateId } = input;

    await enforceRateLimit(ctx.user.id);
    await ctx.db.transaction(async (tx) => {
      await enforceMembershipLimit(tx, ctx.user.id);

      const originalTrip = await tx.query.trips.findFirst({
        columns: { id: false, inviteCode: false, updatedAt: false, createdAt: false },
        where: and(eq(trips.ownerId, ctx.user.id), eq(trips.id, id)),
        with: {
          places: {
            columns: { tripId: false, updatedAt: false, createdAt: false },
          },
          memberships: {
            columns: { sortIndex: true },
            where: eq(memberships.userId, ctx.user.id),
          },
        },
      });
      if (!originalTrip) {
        throw error.internalServerError(
          "Failed to fetch the trip you're trying to duplicate. Please try again later.",
        );
      }

      // Insert the new trip
      await tx.insert(trips).values({ ...originalTrip, id: duplicateId });

      // Increment the trip position of the user's other trips in memberships table
      await tx
        .update(memberships)
        .set({ sortIndex: sql`"trip_position" + 1` })
        .where(
          and(
            eq(memberships.userId, ctx.user.id),
            eq(memberships.permissions, -1),
            gt(memberships.sortIndex, originalTrip.memberships[0]!.sortIndex),
          ),
        );

      // Insert the new trip membership
      await tx.insert(memberships).values({
        tripId: duplicateId,
        userId: ctx.user.id,
        sortIndex: originalTrip.memberships[0]!.sortIndex + 1,
        permissions: -1,
      });

      if (originalTrip.places.length > 0) {
        // Insert the duplicated events
        await tx
          .insert(places)
          .values(
            originalTrip.places.map((place) => ({ ...place, id: createId(), tripId: duplicateId })),
          );
      }
    });
  }),
  get: protectedProcedure.input(tripIdSchema).query(async ({ ctx, input }) => {
    const trip = await ctx.db.query.trips.findFirst({
      where: eq(trips.id, input.id),
      with: {
        memberships: {
          columns: { userId: true, permissions: true, createdAt: true },
          orderBy: (memberships, { asc }) => asc(memberships.createdAt),
        },
        places: { orderBy: (events, { asc }) => asc(events.sortIndex) },
      },
    });

    if (!trip) {
      throw error.internalServerError("Failed to fetch the trip. Please try again later.");
    }

    const { memberships, ...tripData } = trip;

    const members = memberships
      ? await Promise.all(
          memberships.map(async (membership) => {
            const user = await clerkClient.users.getUser(membership.userId);
            return { ...membership, name: user.fullName, image: user.imageUrl };
          }),
        )
      : [];

    return { ...tripData, members };
  }),
  update: protectedProcedure.input(updateTripSchema).mutation(async ({ ctx, input }) => {
    const { id: tripId, ...trip } = input;

    await ctx.db.transaction(async (tx) => {
      const permissions = await getMyMembershipDecodedPermissions(tx, ctx.user.id, tripId);

      if (!permissions.editTrip) {
        throw error.unauthorized(
          "You do not have permission to edit this trip. Please ensure you have the necessary permissions before attempting to update it again.",
        );
      }

      await tx.update(trips).set(trip).where(eq(trips.id, tripId));
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "update trip",
      properties: { tripId },
    });
  }),
  delete: protectedProcedure.input(tripIdSchema).mutation(async ({ ctx, input }) => {
    const { id: tripId } = input;

    await ctx.db.transaction(async (tx) => {
      const membership = await tx.query.memberships.findFirst({
        columns: { permissions: true, sortIndex: true },
        where: and(eq(memberships.userId, ctx.user.id), eq(memberships.tripId, tripId)),
      });

      if (!membership) {
        throw error.internalServerError(
          "Failed to fetch your membership of the trip you're trying to delete. Please try again later.",
        );
      }
      if (membership.permissions !== -1) {
        throw error.unauthorized(
          "You cannot delete a trip that you do NOT own. Please obtain ownership of the trip before attempting to delete it again.",
        );
      }

      await tx
        .update(memberships)
        .set({ sortIndex: sql`"trip_position" - 1` })
        .where(
          and(
            eq(memberships.userId, ctx.user.id),
            eq(memberships.permissions, -1),
            gt(memberships.sortIndex, membership.sortIndex),
          ),
        );
      await tx.delete(trips).where(and(eq(trips.ownerId, ctx.user.id), eq(trips.id, tripId)));
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "delete trip",
      properties: { tripId },
    });
  }),

  findInvite: protectedProcedure.input(findInviteSchema).query(async ({ ctx, input }) => {
    // Failed find return codes:
    // Code 0 - Invalid Invite
    // Code 1 - Unknown Invite
    // Code 2 - Membership Limit

    const { inviteCode } = input;

    // Check if the invite code is invalid
    if (inviteCode.length !== 8 || !/^[0-9A-Za-z]+$/.test(inviteCode)) return 0;

    return ctx.db.transaction(async (tx) => {
      const trip = await tx.query.trips.findFirst({
        columns: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          imageUrl: true,
          inviteCode: true,
        },
        where: eq(trips.inviteCode, inviteCode),
      });

      // Check if the invite code is unknown
      if (!trip) return 1;

      // Check if the user reached the membership limit
      if (await enforceMembershipLimit(tx, ctx.user.id, true)) return 2;

      const memberCount = await getTripMemberCount(tx, trip.id);
      const isMember = await isUserMemberOfTrip(tx, ctx.user.id, trip.id);

      return {
        id: trip.id,
        name: trip.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        imageUrl: trip.imageUrl,
        memberCount,
        isMember,
      };
    });
  }),
  updateInvite: protectedProcedure.input(updateInviteSchema).mutation(async ({ ctx, input }) => {
    const { id: tripId, inviteCode } = input;

    await enforceRateLimit(ctx.user.id);
    await ctx.db.transaction(async (tx) => {
      const permissions = await getMyMembershipDecodedPermissions(tx, ctx.user.id, tripId);

      if (!permissions?.editInvite) {
        throw error.unauthorized(
          "You do not have permission to change an invite link for this trip",
        );
      }

      await tx.update(trips).set({ inviteCode }).where(eq(trips.id, tripId));
      return inviteCode;
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "create trip invite",
      properties: { tripId },
    });
  }),
  join: protectedProcedure.input(tripIdSchema).mutation(async ({ ctx, input }) => {
    const { id: tripId } = input;

    await enforceRateLimit(ctx.user.id);
    await ctx.db.transaction(async (tx) => {
      await enforceMembershipLimit(tx, ctx.user.id);

      const isMember = await isUserMemberOfTrip(tx, ctx.user.id, tripId);
      if (isMember) throw error.badRequest("You're already a member of this trip");

      // Get the number of shared memberships the user has to determine the trip position
      const sharedMembershipsCount = await getMyMembershipsCount(tx, ctx.user.id, false);

      await tx.insert(memberships).values({
        tripId: tripId,
        userId: ctx.user.id,
        sortIndex: sharedMembershipsCount,
        permissions: 801,
      });
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "join trip",
      properties: { tripId },
    });
  }),
  leave: protectedProcedure.input(tripIdSchema).mutation(async ({ ctx, input }) => {
    const { id: tripId } = input;

    await ctx.db.transaction(async (tx) => {
      const membership = await tx.query.memberships.findFirst({
        columns: { permissions: true, sortIndex: true },
        where: and(eq(memberships.userId, ctx.user.id), eq(memberships.tripId, tripId)),
      });
      if (!membership) {
        throw error.internalServerError(
          "Failed to fetch your membership of the trip you're trying to leave. Please try again later.",
        );
      }
      if (membership.permissions === -1) {
        throw error.unauthorized(
          "You cannot leave a trip that you own. Please transfer ownership before trying again.",
        );
      }

      await tx
        .update(memberships)
        .set({ sortIndex: sql`"trip_position" - 1` })
        .where(
          and(
            eq(memberships.userId, ctx.user.id),
            ne(memberships.permissions, -1),
            gt(memberships.sortIndex, membership.sortIndex),
          ),
        );
      await tx
        .delete(memberships)
        .where(
          and(
            eq(memberships.userId, ctx.user.id),
            eq(memberships.tripId, tripId),
            ne(memberships.permissions, -1),
          ),
        );
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "leave trip",
      properties: { tripId },
    });
  }),
});
