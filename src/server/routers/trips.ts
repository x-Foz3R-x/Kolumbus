import { and, count, eq, gt, sql, TablesRelationalConfig } from "drizzle-orm";
import { PgTransaction, QueryResultHKT } from "drizzle-orm/pg-core";
import { z } from "zod";
import db from "@/db";

import { protectedProcedure, router } from "../trpc";
import {
  activities as activitiesTable,
  events as eventsTable,
  flights as flightsTable,
  insertTripSchema,
  memberships as membershipsTable,
  NewActivity,
  NewFlight,
  NewTransportation,
  transportations as transportationsTable,
  trips as tripsTable,
} from "@/db/schema";
import { ROLE_BASED_LIMITS } from "@/lib/config";
import { createId, encodePermissions } from "@/db/utils";
import { MemberPermissionsTemplate } from "@/types";

const trips = router({
  create: protectedProcedure.input(insertTripSchema.extend({ id: z.string(), position: z.number() })).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) throw new Error("Please sign in to create a trip");

    await db.transaction(async (tx) => {
      await checkMembershipLimit(tx, ctx.user.id);

      await tx.insert(tripsTable).values(input);
      await tx.insert(membershipsTable).values({
        tripId: input.id,
        userId: ctx.user.id,
        tripPosition: input.position,
        owner: true,
        permissions: encodePermissions(true, MemberPermissionsTemplate),
      });
    });
  }),

  duplicate: protectedProcedure.input(z.object({ id: z.string(), newId: z.string() })).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) throw new Error("Please sign in to duplicate a trip");

    await db.transaction(async (tx) => {
      await checkMembershipLimit(tx, ctx.user.id);

      const originalTrip = await tx.query.trips.findFirst({
        columns: { id: false, inviteCode: false, updatedAt: false, createdAt: false },
        where: and(eq(tripsTable.ownerId, ctx.user.id), eq(tripsTable.id, input.id)),
        with: {
          events: {
            columns: { tripId: false, updatedAt: false, createdAt: false },
            with: {
              activity: { columns: { id: false, eventId: false } },
              transportation: { columns: { id: false, eventId: false } },
              flight: { columns: { id: false, eventId: false } },
            },
          },
          memberships: { columns: { tripPosition: true }, where: eq(membershipsTable.userId, ctx.user.id) },
        },
      });

      if (!originalTrip) {
        throw new Error("We're sorry, but the trip you're trying to duplicate couldn't be found. Please try again later.");
      }

      // Insert the new trip
      await tx.insert(tripsTable).values({ ...originalTrip, id: input.newId });
      // Increment the trip position of the user's other trips in memberships table
      await tx
        .update(membershipsTable)
        .set({ tripPosition: sql`"trip_position" + 1` })
        .where(
          and(
            eq(membershipsTable.userId, ctx.user.id),
            eq(membershipsTable.owner, true),
            gt(membershipsTable.tripPosition, originalTrip.memberships[0].tripPosition),
          ),
        );
      // Insert the new trip membership
      await tx.insert(membershipsTable).values({
        tripId: input.newId,
        userId: ctx.user.id,
        tripPosition: originalTrip.memberships[0].tripPosition + 1,
        owner: true,
        permissions: encodePermissions(true, MemberPermissionsTemplate),
      });

      // Check if the original trip has events to duplicate and insert them
      if (originalTrip.events.length > 0) {
        // Insert the duplicated events
        const duplicatedEvents = await tx
          .insert(eventsTable)
          .values(originalTrip.events.map((event) => ({ ...event, id: createId(), tripId: input.newId })))
          .returning();

        const activitiesToInsert: NewActivity[] = [];
        const transportationsToInsert: NewTransportation[] = [];
        const flightsToInsert: NewFlight[] = [];

        // Push activities, transportations, and flights for the duplicated events into their respective arrays
        duplicatedEvents.map((event) => {
          const originalEvent = originalTrip.events.find(
            (e) => e.date === event.date && e.position === event.position && e.type === event.type,
          );

          if (!originalEvent) return;

          if (originalEvent.type === "ACTIVITY") {
            activitiesToInsert.push({ ...originalEvent.activity, eventId: event.id });
          } else if (originalEvent.type === "TRANSPORTATION") {
            transportationsToInsert.push({ ...originalEvent.transportation, eventId: event.id });
          } else if (originalEvent.type === "FLIGHT") {
            flightsToInsert.push({ ...originalEvent.flight, eventId: event.id });
          }
        });

        // Insert activities for the duplicated events
        if (activitiesToInsert.length > 0) await tx.insert(activitiesTable).values(activitiesToInsert);

        // Insert transportations for the duplicated events
        if (transportationsToInsert.length > 0) await tx.insert(transportationsTable).values(transportationsToInsert);

        // Insert flights for the duplicated events
        if (flightsToInsert.length > 0) await tx.insert(flightsTable).values(flightsToInsert);
      }
    });
  }),

  delete: protectedProcedure.input(z.object({ tripId: z.string() })).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) throw new Error("Please sign in to delete a trip");

    await db.transaction(async (tx) => {
      const { owner, tripPosition } = (await tx.query.memberships.findFirst({
        columns: { owner: true, tripPosition: true },
        where: and(eq(membershipsTable.userId, ctx.user.id), eq(membershipsTable.tripId, input.tripId)),
      })) ?? { owner: false };

      if (!owner) throw new Error("You need to be the owner of the trip to delete it");

      await tx
        .update(membershipsTable)
        .set({ tripPosition: sql`"trip_position" - 1` })
        .where(
          and(eq(membershipsTable.userId, ctx.user.id), eq(membershipsTable.owner, true), gt(membershipsTable.tripPosition, tripPosition)),
        );
      await tx.delete(tripsTable).where(eq(tripsTable.id, input.tripId));
    });
  }),

  //#region Memberships and Invites (join, leave, findInvite)
  // Code 0 - Unknown Invite
  // Code 1 - Invalid Invite
  // Code 2 - Membership Limit
  findInvite: protectedProcedure.input(z.object({ inviteCode: z.string() })).query(async ({ ctx, input }) => {
    if (!ctx.user.id) throw new Error("Please sign in to find an invite");

    if (input.inviteCode.length !== 8 || !/^[0-9A-Za-z]+$/.test(input.inviteCode)) return 1;
    if (input.inviteCode === "1234567890") return 2;

    return db.transaction(async (tx) => {
      const trip = await tx.query.trips.findFirst({
        columns: { id: true, name: true, startDate: true, endDate: true, photo: true, inviteCode: true },
        where: eq(tripsTable.inviteCode, input.inviteCode),
      });

      if (!trip) return 0;

      const [{ membershipsCount }] = await tx
        .select({ membershipsCount: count() })
        .from(membershipsTable)
        .where(eq(membershipsTable.userId, ctx.user.id));

      if (membershipsCount >= ROLE_BASED_LIMITS["explorer"].membershipsLimit) return 2;

      // Get the number of members in the trip
      const [{ memberCount }] = await tx
        .select({ memberCount: count() })
        .from(membershipsTable)
        .where(eq(membershipsTable.tripId, trip.id));

      // Check if the user is already a member of the trip
      const [{ isMember }] = await tx
        .select({ isMember: count() })
        .from(membershipsTable)
        .where(and(eq(membershipsTable.userId, ctx.user.id), eq(membershipsTable.tripId, trip.id)));

      return {
        id: trip.id,
        name: trip.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        photo: trip.photo,
        memberCount,
        isMember: isMember > 0,
      };
    });
  }),
  join: protectedProcedure.input(z.object({ tripId: z.string(), permissions: z.number().optional() })).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) throw new Error("Please sign in to join a trip");
    await db.transaction(async (tx) => {
      // Check if the user is already a member of the trip
      const [{ isMember }] = await tx
        .select({ isMember: count() })
        .from(membershipsTable)
        .where(and(eq(membershipsTable.userId, ctx.user.id), eq(membershipsTable.tripId, input.tripId)));
      if (isMember > 0) throw new Error("You're already a member of this trip");

      await checkMembershipLimit(tx, ctx.user.id);

      const [{ membershipsCount }] = await tx
        .select({ membershipsCount: count() })
        .from(membershipsTable)
        .where(and(eq(membershipsTable.userId, ctx.user.id), eq(membershipsTable.tripId, input.tripId), eq(membershipsTable.owner, false)));

      await tx.insert(membershipsTable).values({
        tripId: input.tripId,
        userId: ctx.user.id,
        tripPosition: membershipsCount,
        owner: false,
        permissions: input.permissions ?? 0,
      });
    });
  }),
  leave: protectedProcedure.input(z.object({ tripId: z.string() })).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) throw new Error("Please sign in to leave a trip");

    await db.transaction(async (tx) => {
      const { tripPosition } = (await tx.query.memberships.findFirst({
        columns: { tripPosition: true },
        where: and(eq(membershipsTable.userId, ctx.user.id), eq(membershipsTable.tripId, input.tripId)),
      })) ?? { tripPosition: null };

      if (!tripPosition) throw new Error("We're sorry, but the trip you're trying to leave couldn't be found. Please try again later.");

      await tx
        .update(membershipsTable)
        .set({ tripPosition: sql`"trip_position" - 1` })
        .where(
          and(eq(membershipsTable.userId, ctx.user.id), eq(membershipsTable.owner, false), gt(membershipsTable.tripPosition, tripPosition)),
        );
      await tx
        .delete(membershipsTable)
        .where(and(eq(membershipsTable.userId, ctx.user.id), eq(membershipsTable.tripId, input.tripId), eq(membershipsTable.owner, false)));
    });
  }),
  //#endregion
});

export default trips;

async function checkMembershipLimit(tx: PgTransaction<QueryResultHKT, Record<string, unknown>, TablesRelationalConfig>, userId: string) {
  const [{ membershipsCount }] = await tx
    .select({ membershipsCount: count() })
    .from(membershipsTable)
    .where(eq(membershipsTable.userId, userId));
  if (membershipsCount >= ROLE_BASED_LIMITS["explorer"].membershipsLimit) {
    throw new Error(`You've reached your limit of ${ROLE_BASED_LIMITS["explorer"].membershipsLimit} active trips`);
  }
}
