import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getTripsEventCount } from "~/server/queries";

import { tripFallbackUrl } from "~/lib/constants";

export const membershipRouter = createTRPCRouter({
  getMy: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.transaction(async (tx) => {
      const memberships = await tx.query.memberships.findMany({
        where: (t, { eq }) => eq(t.userId, ctx.user.id),
        orderBy: (t, { asc }) => asc(t.sortIndex),
        with: {
          trip: {
            columns: { id: true, name: true, startDate: true, endDate: true, image: true },
            with: { places: { limit: 3, where: (t, { like }) => like(t.imageUrl, "ref:%") } },
          },
        },
      });
      if (memberships.length === 0) return [];

      const tripIds = memberships.map((membership) => membership.tripId);
      const tripsEventCount = await getTripsEventCount(tx, tripIds);

      return memberships.map((membership) => {
        const { places, ...trip } = membership.trip;

        const eventsImages = places.flatMap((place) => place.imageUrl);

        const image =
          trip.image ??
          (eventsImages.length > 0
            ? `/api/get-trip-image?imageRefs=${eventsImages.join(",")}`
            : tripFallbackUrl);

        const eventCount = tripsEventCount[membership.tripId] ?? 0;

        return { ...membership, trip: { ...trip, image, eventCount } };
      });
    });
  }),
});
