import { asc, count, eq, inArray, sql } from "drizzle-orm";
import db from "@/db";

import { protectedProcedure, router } from "../trpc";
import { events as eventsTable, memberships as membershipsTable } from "@/db/schema";

const memberships = router({
  getMemberships: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.id) return;

    return await db.transaction(async (tx) => {
      const userMemberships = await tx.query.memberships.findMany({
        where: eq(membershipsTable.userId, ctx.user.id),
        orderBy: asc(membershipsTable.tripPosition),
        with: {
          trip: {
            columns: { name: true, startDate: true, endDate: true, photo: true },
            with: {
              events: {
                columns: {},
                limit: 3,
                where: eq(eventsTable.type, "ACTIVITY"),
                extras: {
                  photos: sql<
                    string[] | null
                  >`(SELECT "activities"."photos" FROM "activities" WHERE "activities"."event_id" = ${eventsTable.id})`.as("photos"),
                  photoIndex:
                    sql<number>`(SELECT "activities"."photo_index" FROM "activities" WHERE "activities"."event_id" = ${eventsTable.id})`.as(
                      "photoIndex",
                    ),
                },
              },
            },
          },
        },
      });

      if (userMemberships.length === 0) return [];

      const tripIds = userMemberships.map((membership) => membership.tripId);
      const eventCountByTripId = await tx
        .select({ tripId: eventsTable.tripId, eventCount: count() })
        .from(eventsTable)
        .where(inArray(eventsTable.tripId, tripIds))
        .groupBy(eventsTable.tripId);

      return userMemberships.map((membership) => {
        const eventCount = eventCountByTripId.find((eventCount) => eventCount.tripId === membership.tripId)?.eventCount || 0;
        return { ...membership, trip: { ...membership.trip, eventCount } };
      });
    });
  }),
});

export default memberships;
