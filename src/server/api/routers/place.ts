import { and, eq } from "drizzle-orm";

import { error } from "~/lib/trpc";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import analyticsServerClient from "~/server/analytics";

import { places, trips } from "~/server/db/schema";
import {
  deletePlaceSchema,
  placeSchema,
  updatePlacementSchema,
  updatePlaceSchema,
} from "~/lib/validations/place";
import { getMyMembershipDecodedPermissions } from "~/server/queries";

export const placeRouter = createTRPCRouter({
  create: protectedProcedure.input(placeSchema).mutation(async ({ ctx, input: place }) => {
    await ctx.db.transaction(async (tx) => {
      const permissions = await getMyMembershipDecodedPermissions(tx, ctx.user.id, place.tripId);

      if (!permissions.editItinerary) {
        throw error.unauthorized(
          "You do not have permission to create an itinerary item. Please contact the trip organizer to request edit permissions.",
        );
      }

      await tx.insert(places).values(place).execute();
      await tx.update(trips).set({ updatedAt: new Date() }).where(eq(trips.id, place.tripId));
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "create item",
      properties: {
        tripId: place.tripId,
        itemId: place.id,
        itemName: place.name,
        dayIndex: place.dayIndex,
        sortIndex: place.sortIndex,
      },
    });
  }),
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
        .where(and(eq(places.tripId, tripId), eq(places.id, id)));
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
      const { tripId, places: placesList } = input;

      await ctx.db.transaction(async (tx) => {
        const permissions = await getMyMembershipDecodedPermissions(tx, ctx.user.id, tripId);

        if (!permissions.editItinerary) {
          throw error.unauthorized(
            "You do not have permission to update this itinerary. Please contact the trip organizer to request edit permissions.",
          );
        }

        // Validate and update each item's placement
        for (const place of placesList) {
          if (place.dayIndex < 0 || place.sortIndex < 0) {
            throw error.badRequest("Invalid item position.");
          }

          await tx
            .update(places)
            .set({ dayIndex: place.dayIndex, sortIndex: place.sortIndex })
            .where(and(eq(places.tripId, tripId), eq(places.id, place.id)));
        }

        analyticsServerClient.capture({
          distinctId: ctx.user.id,
          event: "update placement",
          properties: { tripId, items: placesList },
        });
      });
    }),
  delete: protectedProcedure.input(deletePlaceSchema).mutation(async ({ ctx, input }) => {
    const { tripId, placeIds } = input;

    await ctx.db.transaction(async (tx) => {
      const permissions = await getMyMembershipDecodedPermissions(tx, ctx.user.id, tripId);

      if (!permissions.editItinerary) {
        throw error.unauthorized(
          "You do not have permission to delete this itinerary. Please contact the trip organizer to request edit permissions.",
        );
      }

      for (const placeId of placeIds) {
        await tx.delete(places).where(and(eq(places.tripId, tripId), eq(places.id, placeId)));
      }

      analyticsServerClient.capture({
        distinctId: ctx.user.id,
        event: "delete item",
        properties: { tripId, placeIds },
      });
    });
  }),
});
