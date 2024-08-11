import { and, eq, gt, gte, lt, lte, sql } from "drizzle-orm";

import { error } from "~/lib/trpc";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import analyticsServerClient from "~/server/analytics";

import { places } from "~/server/db/schema";
import { deletePlaceSchema, updatePlacementSchema } from "~/lib/validations/place";
import { getMyMembershipDecodedPermissions } from "~/server/queries";

export const placeRouter = createTRPCRouter({
  updateItemPlacement: protectedProcedure
    .input(updatePlacementSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, tripId, dayIndex, prevDayIndex, sortIndex, prevSortIndex } = input;

      await ctx.db.transaction(async (tx) => {
        const permissions = await getMyMembershipDecodedPermissions(tx, ctx.user.id, tripId);

        if (!permissions.editItinerary) {
          throw error.unauthorized(
            "You do not have permission to update this itinerary. Please contact the trip organizer to request edit permissions.",
          );
        }

        if (dayIndex < 0 || sortIndex < 0) {
          throw error.badRequest("Invalid dayIndex or sortIndex");
        }
        if (dayIndex === prevDayIndex && sortIndex === prevSortIndex) {
          throw error.badRequest("Placement did not change");
        }

        if (dayIndex === prevDayIndex && sortIndex > prevSortIndex) {
          // Decrease sortIndex by 1 for places between the previous and new positions
          await tx
            .update(places)
            .set({ sortIndex: sql`"sort_index" - 1` })
            .where(
              and(
                eq(places.tripId, tripId),
                eq(places.dayIndex, dayIndex),
                gt(places.sortIndex, prevSortIndex),
                lte(places.sortIndex, sortIndex),
              ),
            );
        } else if (dayIndex === prevDayIndex && sortIndex < prevSortIndex) {
          // Increase sortIndex by 1 for places between the new and previous positions
          await tx
            .update(places)
            .set({ sortIndex: sql`"sort_index" + 1` })
            .where(
              and(
                eq(places.tripId, tripId),
                eq(places.dayIndex, dayIndex),
                lt(places.sortIndex, prevSortIndex),
                gte(places.sortIndex, sortIndex),
              ),
            );
        } else if (dayIndex !== prevDayIndex) {
          // Decrease sortIndex by 1 for places after the previous position in the old day
          await tx
            .update(places)
            .set({ sortIndex: sql`"sort_index" - 1` })
            .where(
              and(
                eq(places.tripId, tripId),
                eq(places.dayIndex, prevDayIndex),
                gt(places.sortIndex, prevSortIndex),
              ),
            );
          // Increase sortIndex by 1 for places after the new position in the new day
          await tx
            .update(places)
            .set({ sortIndex: sql`"sort_index" + 1` })
            .where(
              and(
                eq(places.tripId, tripId),
                eq(places.dayIndex, dayIndex),
                gte(places.sortIndex, sortIndex),
              ),
            );
        }

        // Finally, set the new dayIndex and sortIndex for the place
        await tx
          .update(places)
          .set({ dayIndex, sortIndex })
          .where(and(eq(places.id, id), eq(places.tripId, tripId)));
      });

      analyticsServerClient.capture({
        distinctId: ctx.user.id,
        event: "update placement",
        properties: { tripId, itemId: id, dayIndex, sortIndex, prevDayIndex, prevSortIndex },
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
