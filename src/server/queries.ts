import "server-only";

import { TRPCError } from "@trpc/server";
import { and, count, eq, inArray, sql, type TablesRelationalConfig } from "drizzle-orm";
import type { PgTransaction, QueryResultHKT } from "drizzle-orm/pg-core";
import { auth } from "@clerk/nextjs/server";
import ratelimit from "./ratelimit";
import { error } from "~/lib/trpc";
import db from "./db";

import { events, memberships, userRoles } from "./db/schema";

type Transaction = PgTransaction<QueryResultHKT, Record<string, unknown>, TablesRelationalConfig>;
const validRoles = ["explorer", "navigator", "captain", "fleetCommander", "tester", "admin"];

/*--------------------------------------------------------------------------------------------------
 * Read
 *------------------------------------------------------------------------------------------------*/

export async function getMyMemberships() {
  const userId = getUserId();

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

export async function getMyUserRoleLimits(tx?: Transaction) {
  const userRole = getUserRole();

  const [userRoleLimits] = tx
    ? await tx
        .select({
          membershipsLimit: userRoles.membershipsLimit,
          daysLimit: userRoles.daysLimit,
          eventsLimit: userRoles.eventsLimit,
        })
        .from(userRoles)
        .where(eq(userRoles.role, userRole))
    : await db
        .select({
          membershipsLimit: userRoles.membershipsLimit,
          daysLimit: userRoles.daysLimit,
          eventsLimit: userRoles.eventsLimit,
        })
        .from(userRoles)
        .where(eq(userRoles.role, userRole));

  if (!userRoleLimits) {
    throw error.internalServerError("Failed to fetch your user role. Please try again later.");
  }

  return userRoleLimits;
}

export async function getMyMembershipsCount(tx: Transaction, userId: string, owner?: boolean) {
  const [result] =
    owner !== undefined
      ? await tx
          .select({ membershipsCount: count() })
          .from(memberships)
          .where(and(eq(memberships.userId, userId), eq(memberships.owner, owner)))
      : await tx
          .select({ membershipsCount: count() })
          .from(memberships)
          .where(eq(memberships.userId, userId));

  if (!result) {
    throw error.internalServerError(
      "Failed to fetch your memberships count. Please try again later.",
    );
  }

  return result.membershipsCount;
}

export async function getTripMemberCount(tx: Transaction, tripId: string) {
  const [result] = await tx
    .select({ memberCount: count() })
    .from(memberships)
    .where(eq(memberships.tripId, tripId));

  if (!result) {
    throw error.internalServerError(
      "Failed to fetch the trip member count. Please try again later.",
    );
  }

  return result.memberCount;
}

export async function isUserMemberOfTrip(tx: Transaction, userId: string, tripId: string) {
  const [result] = await tx
    .select({ tripMembershipCount: count() })
    .from(memberships)
    .where(and(eq(memberships.userId, userId), eq(memberships.tripId, tripId)));

  if (!result) {
    throw error.internalServerError(
      "Failed to check if you're a member of the trip. Please try again later.",
    );
  }

  return result.tripMembershipCount > 0;
}

/*--------------------------------------------------------------------------------------------------
 * Enforcers
 *------------------------------------------------------------------------------------------------*/

export async function enforceRateLimit(userId: string) {
  const { success } = await ratelimit.limit(userId);
  if (!success)
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate-limited. Please try again later.",
    });
}

export async function enforceMembershipLimit<T>(
  tx: Transaction,
  userId: string,
  returnValueOnEnforce?: T,
) {
  const userRole = await getMyUserRoleLimits(tx);
  const membershipsCount = await getMyMembershipsCount(tx, userId);

  if (membershipsCount >= userRole.membershipsLimit) {
    if (returnValueOnEnforce) return returnValueOnEnforce;

    throw error.badRequest(
      `You've reached your limit of ${userRole.membershipsLimit} memberships.`,
    );
  }
}

/*--------------------------------------------------------------------------------------------------
 * Helpers
 *------------------------------------------------------------------------------------------------*/

export function getUserId() {
  const { userId } = auth();
  if (!userId) throw error.unauthorized("Unauthorized. Please sign in to continue.");
  return userId;
}

export function getUserRole() {
  const { userId, sessionClaims } = auth();
  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized. Please sign in to continue.",
    });
  }

  const userRole =
    sessionClaims?.metadata.role && validRoles.includes(sessionClaims.metadata.role)
      ? sessionClaims.metadata.role
      : "explorer";

  return userRole;
}
