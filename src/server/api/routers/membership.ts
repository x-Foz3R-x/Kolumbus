import { eq, sql } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { events } from "~/server/db/schema";
import { getTripsEventCount } from "~/server/queries";

export const membershipRouter = createTRPCRouter({
  getMy: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.transaction(async (tx) => {
      const memberships = await tx.query.memberships.findMany({
        where: (memberships) => eq(memberships.userId, ctx.user.id),
        orderBy: (memberships, { asc }) => asc(memberships.tripPosition),
        with: {
          trip: {
            columns: { name: true, startDate: true, endDate: true, image: true },
            with: {
              events: {
                columns: {},
                limit: 3,
                where: (events) => eq(events.type, "ACTIVITY"),
                extras: {
                  images: sql<
                    string[] | null
                  >`(SELECT "activities"."images" FROM "activities" WHERE "activities"."event_id" = ${events.id})`.as(
                    "images",
                  ),
                  imageIndex:
                    sql<number>`(SELECT "activities"."image_index" FROM "activities" WHERE "activities"."event_id" = ${events.id})`.as(
                      "imageIndex",
                    ),
                },
              },
            },
          },
        },
      });

      if (memberships.length === 0) return [];

      const tripIds = memberships.map((membership) => membership.tripId);
      const tripsEventCount = await getTripsEventCount(tx, tripIds);

      return memberships.map((membership) => {
        return {
          ...membership,
          trip: { ...membership.trip, eventCount: tripsEventCount[membership.tripId] ?? 0 },
        };
      });
    });
  }),
});
