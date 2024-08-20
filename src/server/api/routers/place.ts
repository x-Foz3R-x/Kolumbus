import { and, eq } from "drizzle-orm";

import { error } from "~/lib/trpc";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import analyticsServerClient from "~/server/analytics";

import { places, trips } from "~/server/db/schema";
import {
  deletePlaceSchema,
  placeSchema,
  updatePlacementSchema as movePlaceSchema,
  updatePlaceSchema,
} from "~/lib/validations/place";
import { getUserMembershipPermissions } from "~/server/queries";

export const placeRouter = createTRPCRouter({
  create: protectedProcedure.input(placeSchema).mutation(async ({ ctx, input: place }) => {
    await ctx.db.transaction(async (tx) => {
      const permissions = await getUserMembershipPermissions(tx, ctx.user.id, place.tripId);

      if (!permissions.editItinerary) {
        throw error.unauthorized(
          "You do not have permission to create an itinerary item. Please contact the trip organizer to request edit itinerary permission.",
        );
      }

      await tx.insert(places).values(place).execute();
      await tx.update(trips).set({ updatedAt: new Date() }).where(eq(trips.id, place.tripId));
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "create place",
      properties: {
        tripId: place.tripId,
        itemId: place.id,
        dayIndex: place.dayIndex,
        sortIndex: place.sortIndex,
      },
    });
  }),
  update: protectedProcedure.input(updatePlaceSchema).mutation(async ({ ctx, input }) => {
    const { tripId, placeId, modifiedFields } = input;

    await ctx.db.transaction(async (tx) => {
      const permissions = await getUserMembershipPermissions(tx, ctx.user.id, tripId);

      if (!permissions.editItinerary) {
        throw error.unauthorized(
          "You do not have permission to update this itinerary. Please contact the trip organizer to request edit itinerary permission.",
        );
      }

      await tx
        .update(places)
        .set({ ...modifiedFields, updatedBy: ctx.user.id, updatedAt: new Date() })
        .where(and(eq(places.tripId, tripId), eq(places.id, placeId)));
      await tx.update(trips).set({ updatedAt: new Date() }).where(eq(trips.id, tripId));
    });

    analyticsServerClient.capture({
      distinctId: ctx.user.id,
      event: "update place",
      properties: { tripId, placeId },
    });
  }),
  move: protectedProcedure.input(movePlaceSchema).mutation(async ({ ctx, input }) => {
    const { tripId, places: placesList } = input;

    await ctx.db.transaction(async (tx) => {
      const permissions = await getUserMembershipPermissions(tx, ctx.user.id, tripId);

      if (!permissions.editItinerary) {
        throw error.unauthorized(
          "You do not have permission to update this itinerary. Please contact the trip organizer to request edit itinerary permission.",
        );
      }

      // Validate and update each item's placement
      for (const place of placesList) {
        if ((place?.dayIndex && place.dayIndex < 0) || (place?.sortIndex && place.sortIndex < 0)) {
          throw error.badRequest("Invalid item position.");
        }

        await tx
          .update(places)
          .set({
            ...(typeof place.dayIndex === "number" ? { dayIndex: place.dayIndex } : {}),
            ...(typeof place.sortIndex === "number" ? { sortIndex: place.sortIndex } : {}),
          })
          // .set({ dayIndex: place.dayIndex, sortIndex: place.sortIndex })
          .where(and(eq(places.tripId, tripId), eq(places.id, place.id)));
        await tx.update(trips).set({ updatedAt: new Date() }).where(eq(trips.id, tripId));
      }

      analyticsServerClient.capture({
        distinctId: ctx.user.id,
        event: "update placement",
        properties: { tripId, places: placesList },
      });
    });
  }),
  delete: protectedProcedure.input(deletePlaceSchema).mutation(async ({ ctx, input }) => {
    const { tripId, placeIds } = input;

    await ctx.db.transaction(async (tx) => {
      const permissions = await getUserMembershipPermissions(tx, ctx.user.id, tripId);

      if (!permissions.editItinerary) {
        throw error.unauthorized(
          "You do not have permission to delete this itinerary item. Please contact the trip organizer to request edit itinerary permission.",
        );
      }

      for (const placeId of placeIds) {
        await tx.delete(places).where(and(eq(places.tripId, tripId), eq(places.id, placeId)));
      }
      await tx.update(trips).set({ updatedAt: new Date() }).where(eq(trips.id, tripId));

      analyticsServerClient.capture({
        distinctId: ctx.user.id,
        event: "delete places",
        properties: { tripId, placeIds },
      });
    });
  }),
});
