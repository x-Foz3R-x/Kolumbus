import "server-only";

import { redirect } from "next/navigation";
import { and, count, eq, gt, inArray, sql, type TablesRelationalConfig } from "drizzle-orm";
import type { PgTransaction, QueryResultHKT } from "drizzle-orm/pg-core";
import { auth } from "@clerk/nextjs/server";
import z from "zod";

import db from "./db";
import analyticsServerClient from "./analytics";
import ratelimit from "./ratelimit";

import { events, memberships, userRoles, trips, insertTripSchema } from "./db/schema";
import { encodePermissions, MemberPermissionsTemplate } from "~/lib/db";
import { validRoles } from "~/lib/constants";

/*--------------------------------------------------------------------------------------------------
 * Create
 *------------------------------------------------------------------------------------------------*/

const createTripSchema = insertTripSchema
  .omit({ ownerId: true })
  .extend({ id: z.string(), position: z.number() });
export async function createTrip(input: z.output<typeof createTripSchema>) {
  const { position, ...trip } = createTripSchema.parse(input);
  const userId = await getUserId();
  await enforceRateLimit(userId);

  await db.transaction(async (tx) => {
    await enforceMembershipLimit(tx, userId);
    await tx.insert(trips).values({ ...trip, ownerId: userId });
    await tx.insert(memberships).values({
      tripId: trip.id,
      userId,
      tripPosition: position,
      owner: true,
      permissions: encodePermissions(true, MemberPermissionsTemplate),
    });
  });

  analyticsServerClient.capture({
    distinctId: userId,
    event: "create trip",
    properties: { tripId: trip.id },
  });
}

/*--------------------------------------------------------------------------------------------------
 * Read
 *------------------------------------------------------------------------------------------------*/

export async function getMyRole(
  tx?: PgTransaction<QueryResultHKT, Record<string, unknown>, TablesRelationalConfig>,
) {
  const { userId, sessionClaims } = auth();
  if (!userId) throw new Error("UNAUTHORIZED, Please sign in to continue.");

  const role =
    sessionClaims?.metadata.role && validRoles.includes(sessionClaims.metadata.role)
      ? sessionClaims.metadata.role
      : "explorer";

  if (!tx) {
    const [myRole] = await db
      .select({
        role: userRoles.role,
        membershipsLimit: userRoles.membershipsLimit,
        daysLimit: userRoles.daysLimit,
        eventsLimit: userRoles.eventsLimit,
      })
      .from(userRoles)
      .where(eq(userRoles.role, role))
      .execute();

    return myRole;
  }

  const [myRole] = await tx
    .select({
      role: userRoles.role,
      membershipsLimit: userRoles.membershipsLimit,
      daysLimit: userRoles.daysLimit,
      eventsLimit: userRoles.eventsLimit,
    })
    .from(userRoles)
    .where(eq(userRoles.role, role))
    .execute();
  return myRole;
}

export async function getMyMemberships() {
  const userId = await getUserId();

  const memberships = await db.transaction(async (tx) => {
    const memberships = await tx.query.memberships.findMany({
      where: (memberships) => eq(memberships.userId, userId),
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
    const eventCountByTripId = await tx
      .select({ tripId: events.tripId, eventCount: count() })
      .from(events)
      .where(inArray(events.tripId, tripIds))
      .groupBy(events.tripId);

    return memberships.map((membership) => {
      const eventCount =
        eventCountByTripId.find((eventCount) => eventCount.tripId === membership.tripId)
          ?.eventCount ?? 0;
      return { ...membership, trip: { ...membership.trip, eventCount } };
    });
  });

  return memberships;
}

/*--------------------------------------------------------------------------------------------------
 * Update
 *------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------------------------------
 * Delete
 *------------------------------------------------------------------------------------------------*/

const deleteTripSchema = z.object({ tripId: z.string(), redirectPath: z.string().optional() });
export async function deleteTrip(input: z.infer<typeof deleteTripSchema>) {
  const { tripId, redirectPath } = deleteTripSchema.parse(input);
  const userId = await getUserId();
  await enforceRateLimit(userId);

  await db.transaction(async (tx) => {
    const membership = (await tx.query.memberships.findFirst({
      columns: { owner: true, tripPosition: true },
      where: and(eq(memberships.userId, userId), eq(memberships.tripId, tripId)),
    })) ?? { owner: false };
    if (!membership) throw new Error("Membership not found");
    if (!membership.owner) throw new Error("You need to be the owner of the trip to delete it");

    await tx
      .update(memberships)
      .set({ tripPosition: sql`"trip_position" - 1` })
      .where(
        and(
          eq(memberships.userId, userId),
          eq(memberships.owner, true),
          gt(memberships.tripPosition, membership.tripPosition),
        ),
      );
    await tx.delete(trips).where(and(eq(trips.ownerId, userId), eq(trips.id, input.tripId)));
  });

  analyticsServerClient.capture({
    distinctId: userId,
    event: "delete trip",
    properties: { tripId },
  });

  if (redirectPath) redirect(redirectPath);
}

/*--------------------------------------------------------------------------------------------------
 * Helpers
 *------------------------------------------------------------------------------------------------*/

export async function getUserId() {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized. Please sign in to continue.");
  return userId;
}
export async function enforceRateLimit(userId: string) {
  const { success } = await ratelimit.limit(userId);
  if (!success) throw new Error("Rate-limited. Please try again later.");
}
export async function enforceMembershipLimit(
  tx: PgTransaction<QueryResultHKT, Record<string, unknown>, TablesRelationalConfig>,
  userId: string,
) {
  const [membership] = await tx
    .select({ membershipsCount: count() })
    .from(memberships)
    .where(eq(memberships.userId, userId));
  if (!membership) throw new Error("Membership not found");

  const role = await getMyRole(tx);
  if (!role) throw new Error("Role not found");

  if (membership.membershipsCount >= role.membershipsLimit) {
    throw new Error(`You've reached your limit of ${role.membershipsLimit} memberships.`);
  }
}
