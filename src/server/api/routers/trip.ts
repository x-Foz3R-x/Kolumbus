import { TRPCError } from "@trpc/server";
import { and, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";

import { createId, encodePermissions } from "~/lib/utils";
import { MemberPermissionsTemplate } from "~/lib/templates";
import analyticsServerClient from "~/server/analytics";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { enforceMembershipLimit, enforceRateLimit } from "~/server/api/helpers";
import {
  activities,
  events,
  flights,
  insertTripSchema,
  memberships,
  type NewActivity,
  type NewFlight,
  type NewTransportation,
  transportations,
  trips,
} from "~/server/db/schema";

export const tripRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertTripSchema.extend({ id: z.string(), position: z.number().nonnegative() }))
    .mutation(async ({ ctx, input }) => {
      const { position, ...trip } = input;

      await enforceRateLimit(ctx.user.id);
      await ctx.db.transaction(async (tx) => {
        await enforceMembershipLimit(tx, ctx.user.id);
        await tx.insert(trips).values({ ...trip, ownerId: ctx.user.id });
        await tx.insert(memberships).values({
          tripId: trip.id,
          userId: ctx.user.id,
          tripPosition: position,
          owner: true,
          permissions: encodePermissions(true, MemberPermissionsTemplate),
        });
      });

      analyticsServerClient.capture({
        distinctId: ctx.user.id,
        event: "create trip",
        properties: { tripId: trip.id },
      });
    }),

  duplicate: protectedProcedure
    .input(z.object({ id: z.string(), duplicateId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, duplicateId } = input;

      await enforceRateLimit(ctx.user.id);
      await ctx.db.transaction(async (tx) => {
        await enforceMembershipLimit(tx, ctx.user.id);

        const originalTrip = await tx.query.trips.findFirst({
          columns: { id: false, inviteCode: false, updatedAt: false, createdAt: false },
          where: and(eq(trips.ownerId, ctx.user.id), eq(trips.id, id)),
          with: {
            events: {
              columns: { tripId: false, updatedAt: false, createdAt: false },
              with: {
                activity: { columns: { id: false, eventId: false } },
                transportation: { columns: { id: false, eventId: false } },
                flight: { columns: { id: false, eventId: false } },
              },
            },
            memberships: {
              columns: { tripPosition: true },
              where: eq(memberships.userId, ctx.user.id),
            },
          },
        });
        if (!originalTrip) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "We're sorry, but the trip you're trying to duplicate couldn't be found. Please try again later.",
          });
        }

        // Insert the new trip
        await tx.insert(trips).values({ ...originalTrip, id: duplicateId });

        // Increment the trip position of the user's other trips in memberships table
        await tx
          .update(memberships)
          .set({ tripPosition: sql`"trip_position" + 1` })
          .where(
            and(
              eq(memberships.userId, ctx.user.id),
              eq(memberships.owner, true),
              gt(memberships.tripPosition, originalTrip.memberships[0]!.tripPosition),
            ),
          );

        // Insert the new trip membership
        await tx.insert(memberships).values({
          tripId: duplicateId,
          userId: ctx.user.id,
          tripPosition: originalTrip.memberships[0]!.tripPosition + 1,
          owner: true,
          permissions: encodePermissions(true, MemberPermissionsTemplate),
        });

        if (originalTrip.events.length > 0) {
          // Insert the duplicated events
          const duplicatedEvents = await tx
            .insert(events)
            .values(
              originalTrip.events.map((event) => ({
                ...event,
                id: createId(),
                tripId: duplicateId,
              })),
            )
            .returning();

          const activitiesToInsert: NewActivity[] = [];
          const transportationsToInsert: NewTransportation[] = [];
          const flightsToInsert: NewFlight[] = [];

          // Push activities, transportations, and flights for the duplicated events into their respective arrays
          duplicatedEvents.map((event) => {
            const originalEvent = originalTrip.events.find(
              (e) =>
                e.date === event.date && e.position === event.position && e.type === event.type,
            );

            if (!originalEvent) return;

            if (originalEvent.type === "ACTIVITY") {
              activitiesToInsert.push({ ...originalEvent.activity, eventId: event.id });
            } else if (originalEvent.type === "TRANSPORTATION") {
              transportationsToInsert.push({ ...originalEvent.transportation, eventId: event.id });
            } else if (originalEvent.type === "FLIGHT") {
              flightsToInsert.push({ ...originalEvent.flight, eventId: event.id });
            }
          });

          if (activitiesToInsert.length > 0) {
            // Insert activities for the duplicated events
            await tx.insert(activities).values(activitiesToInsert);
          }

          if (transportationsToInsert.length > 0) {
            // Insert transportations for the duplicated events
            await tx.insert(transportations).values(transportationsToInsert);
          }

          if (flightsToInsert.length > 0) {
            // Insert flights for the duplicated events
            await tx.insert(flights).values(flightsToInsert);
          }
        }
      });
    }),

  delete: protectedProcedure
    .input(z.object({ tripId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { tripId } = input;

      await ctx.db.transaction(async (tx) => {
        const membership = (await tx.query.memberships.findFirst({
          columns: { owner: true, tripPosition: true },
          where: and(eq(memberships.userId, ctx.user.id), eq(memberships.tripId, tripId)),
        })) ?? { owner: false };

        if (!membership) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Membership not found" });
        }
        if (!membership.owner) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You need to be the owner of the trip to delete it",
          });
        }

        await tx
          .update(memberships)
          .set({ tripPosition: sql`"trip_position" - 1` })
          .where(
            and(
              eq(memberships.userId, ctx.user.id),
              eq(memberships.owner, true),
              gt(memberships.tripPosition, membership.tripPosition),
            ),
          );
        await tx
          .delete(trips)
          .where(and(eq(trips.ownerId, ctx.user.id), eq(trips.id, input.tripId)));
      });

      analyticsServerClient.capture({
        distinctId: ctx.user.id,
        event: "delete trip",
        properties: { tripId },
      });
    }),
});
