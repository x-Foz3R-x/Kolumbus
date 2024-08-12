import { and, eq, gt, sql } from "drizzle-orm";

import { error } from "~/lib/trpc";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import analyticsServerClient from "~/server/analytics";

import { places } from "~/server/db/schema";
import {
  deletePlaceSchema,
  updatePlacementSchema,
  updatePlaceSchema,
} from "~/lib/validations/place";
import { getMyMembershipDecodedPermissions } from "~/server/queries";

export const placeRouter = createTRPCRouter({
  update: protectedProcedure.input(updatePlaceSchema).mutation(async ({ ctx, input }) => {
    const { id, tripId, data } = input;

    await ctx.db.transaction(async (tx) => {
      const permissions = await getMyMembershipDecodedPermissions(tx, ctx.user.id, tripId);

      if (!permissions.editItinerary) {
        throw error.unauthorized(
          "You do not have permission to update this itinerary. Please contact the trip organizer to request edit permissions.",
        );
      }

      await tx
        .update(places)
        .set({ ...data })
        .where(and(eq(places.id, id), eq(places.tripId, tripId)));
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "update item",
      properties: { tripId, itemId: id },
    });
  }),
  updatePlacement: protectedProcedure
    .input(updatePlacementSchema)
    .mutation(async ({ ctx, input }) => {
      const { tripId, items } = input;

      await ctx.db.transaction(async (tx) => {
        const permissions = await getMyMembershipDecodedPermissions(tx, ctx.user.id, tripId);

        if (!permissions.editItinerary) {
          throw error.unauthorized(
            "You do not have permission to update this itinerary. Please contact the trip organizer to request edit permissions.",
          );
        }

        // Validate and update each item's placement
        for (const item of items) {
          if (item.dayIndex < 0 || item.sortIndex < 0) {
            throw error.badRequest("Invalid item position.");
          }

          await tx
            .update(places)
            .set({ dayIndex: item.dayIndex, sortIndex: item.sortIndex })
            .where(and(eq(places.tripId, tripId), eq(places.id, item.id)));
        }

        analyticsServerClient.capture({
          distinctId: ctx.user.id,
          event: "update placement",
          properties: { tripId, items },
        });
      });
    }),
  delete: protectedProcedure.input(deletePlaceSchema).mutation(async ({ ctx, input }) => {
    const { id, tripId, dayIndex, sortIndex } = input;

    await ctx.db.transaction(async (tx) => {
      const permissions = await getMyMembershipDecodedPermissions(tx, ctx.user.id, tripId);

      if (!permissions.editItinerary) {
        throw error.unauthorized(
          "You do not have permission to delete this itinerary. Please contact the trip organizer to request edit permissions.",
        );
      }

      await tx
        .update(places)
        .set({ sortIndex: sql`"sort_index" - 1` })
        .where(
          and(
            eq(places.tripId, tripId),
            eq(places.dayIndex, dayIndex),
            gt(places.sortIndex, sortIndex),
          ),
        );
      await tx.delete(places).where(and(eq(places.id, id), eq(places.tripId, tripId)));
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "delete itinerary item",
      properties: { tripId, itemId: id },
    });
  }),
});
