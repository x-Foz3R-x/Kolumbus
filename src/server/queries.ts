import "server-only";
import { count, eq, inArray, sql } from "drizzle-orm";
import {
  events,
  memberships,
  userRoles,
  trips,
  insertTripSchema,
} from "./db/schema";
import z from "zod";

import db from "./db";
import { auth } from "@clerk/nextjs/server";
import { encodePermissions } from "./db/utils";
import { MemberPermissionsTemplate } from "~/types";

import type { TablesRelationalConfig } from "drizzle-orm";
import type { PgTransaction, QueryResultHKT } from "drizzle-orm/pg-core";

export async function getMyRole(
  tx?: PgTransaction<
    QueryResultHKT,
    Record<string, unknown>,
    TablesRelationalConfig
  >,
) {
  const { sessionClaims } = auth();
  const role = sessionClaims?.metadata.role ?? "explorer";

  if (!tx) {
    return await db
      .select({
        role: userRoles.role,
        membershipsLimit: userRoles.membershipsLimit,
        daysLimit: userRoles.daysLimit,
        eventsLimit: userRoles.eventsLimit,
      })
      .from(userRoles)
      .where(eq(userRoles.role, role))
      .execute();
  }

  return await tx
    .select({
      role: userRoles.role,
      membershipsLimit: userRoles.membershipsLimit,
      daysLimit: userRoles.daysLimit,
      eventsLimit: userRoles.eventsLimit,
    })
    .from(userRoles)
    .where(eq(userRoles.role, role))
    .execute();
}

export async function getMyMemberships() {
  const user = auth();
  if (!user.userId)
    throw new Error("UNAUTHORIZED, Please sign in to continue.");

  const memberships = await db.transaction(async (tx) => {
    const memberships = await tx.query.memberships.findMany({
      where: (memberships) => eq(memberships.userId, user.userId),
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
                photos: sql<
                  string[] | null
                >`(SELECT "activities"."photos" FROM "activities" WHERE "activities"."event_id" = ${events.id})`.as(
                  "photos",
                ),
                photoIndex:
                  sql<number>`(SELECT "activities"."photo_index" FROM "activities" WHERE "activities"."event_id" = ${events.id})`.as(
                    "photoIndex",
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
        eventCountByTripId.find(
          (eventCount) => eventCount.tripId === membership.tripId,
        )?.eventCount ?? 0;
      return { ...membership, trip: { ...membership.trip, eventCount } };
    });
  });

  return memberships;
}

const createTripSchema = insertTripSchema.extend({
  id: z.string(),
  position: z.number(),
});
export async function createTrip(tripInput: z.infer<typeof createTripSchema>) {
  const { position, ...trip } = createTripSchema.parse(tripInput);

  const { userId } = auth();
  if (!userId) throw new Error("UNAUTHORIZED, Please sign in to continue.");

  await db.transaction(async (tx) => {
    await checkMembershipLimit(tx, userId);

    await tx.insert(trips).values(trip);
    await tx.insert(memberships).values({
      tripId: trip.id,
      userId,
      tripPosition: position,
      owner: true,
      permissions: encodePermissions(true, MemberPermissionsTemplate),
    });
  });
}

async function checkMembershipLimit(
  tx: PgTransaction<
    QueryResultHKT,
    Record<string, unknown>,
    TablesRelationalConfig
  >,
  userId: string,
) {
  const [membership] = await tx
    .select({ membershipsCount: count() })
    .from(memberships)
    .where(eq(memberships.userId, userId));
  if (!membership) return;

  const [role] = await getMyRole(tx);
  if (!role) throw new Error("Role not found");

  if (membership.membershipsCount >= role.membershipsLimit) {
    throw new Error(
      `You've reached your limit of ${role.membershipsLimit} memberships.`,
    );
  }
}
