import { z } from "zod";
import { encodePermissions, MemberPermissionsTemplate } from "~/lib/db";
import analyticsServerClient from "~/server/analytics";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { insertTripSchema, memberships, trips } from "~/server/db/schema";
import { enforceMembershipLimit, enforceRateLimit } from "~/server/queries";

export const tripRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      insertTripSchema.omit({ ownerId: true }).extend({ id: z.string(), position: z.number() }),
    )
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
});
