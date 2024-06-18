import { and, eq, gt, sql } from "drizzle-orm";

import { error } from "~/lib/trpc";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import analyticsServerClient from "~/server/analytics";

import { events } from "~/server/db/schema";
import { deleteEventSchema } from "~/lib/validations/event";
import { getMyMembershipDecodedPermissions } from "~/server/queries";

export const eventRouter = createTRPCRouter({
  delete: protectedProcedure.input(deleteEventSchema).mutation(async ({ ctx, input }) => {
    const { id: eventId, tripId, date, position, createdBy } = input;

    await ctx.db.transaction(async (tx) => {
      const permissions = await getMyMembershipDecodedPermissions(tx, ctx.user.id, tripId);

      if (
        (createdBy === ctx.user.id && !permissions.deleteOwnEvents) ||
        (createdBy !== ctx.user.id && !permissions.deleteEvents)
      ) {
        throw error.unauthorized(
          "You do not have permission to delete this event. Please contact the trip organizer to request delete permissions.",
        );
      }

      await tx
        .update(events)
        .set({ position: sql`"position" - 1` })
        .where(
          and(eq(events.tripId, tripId), eq(events.date, date), gt(events.position, position)),
        );
      await tx.delete(events).where(and(eq(events.id, eventId), eq(events.tripId, tripId)));
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "delete event",
      properties: { tripId, eventId },
    });
  }),
});
