import { eq, sql } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { events } from "~/server/db/schema";
import { getTripsEventCount } from "~/server/queries";

import { tripFallbackUrl } from "~/lib/constants";

export const membershipRouter = createTRPCRouter({
  getMy: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.transaction(async (tx) => {
      const memberships = await tx.query.memberships.findMany({
        where: (memberships) => eq(memberships.userId, ctx.user.id),
        orderBy: (memberships, { asc }) => asc(memberships.tripPosition),
        with: {
          trip: {
            columns: { id: true, name: true, startDate: true, endDate: true, image: true },
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
        const { events, ...trip } = membership.trip;

        const eventsImages = events.flatMap((event) => event.images?.[event.imageIndex ?? 0] ?? []);

        const image =
          trip.image ??
          (eventsImages.length > 0
            ? `/api/get-trip-image?imageRefs=${eventsImages.join(",")}`
            : tripFallbackUrl);

        const eventCount = tripsEventCount[membership.tripId] ?? 0;

        return {
          ...membership,
          trip: {
            ...trip,
            image,
            eventCount,
          },
        };
      });
    });
  }),
});
