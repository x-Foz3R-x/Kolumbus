import { and, eq, gt, sql } from "drizzle-orm";

import { error } from "~/lib/trpc";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import analyticsServerClient from "~/server/analytics";

import { places } from "~/server/db/schema";
import { deletePlaceSchema } from "~/lib/validations/place";
import { getMyMembershipDecodedPermissions } from "~/server/queries";

export const eventRouter = createTRPCRouter({
  delete: protectedProcedure.input(deletePlaceSchema).mutation(async ({ ctx, input }) => {
    const { id: eventId, tripId, dayIndex, sortIndex } = input;

    await ctx.db.transaction(async (tx) => {
      const permissions = await getMyMembershipDecodedPermissions(tx, ctx.user.id, tripId);

      if (!permissions.deleteEvents) {
        throw error.unauthorized(
          "You do not have permission to delete this event. Please contact the trip organizer to request delete permissions.",
        );
      }

      await tx
        .update(places)
        .set({ sortIndex: sql`"position" - 1` })
        .where(
          and(
            eq(places.tripId, tripId),
            eq(places.dayIndex, dayIndex),
            gt(places.sortIndex, sortIndex),
          ),
        );
      await tx.delete(places).where(and(eq(places.id, eventId), eq(places.tripId, tripId)));
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "delete event",
      properties: { tripId, eventId },
    });
  }),
});
