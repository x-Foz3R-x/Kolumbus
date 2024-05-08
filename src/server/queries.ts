import "server-only";

import { TRPCError } from "@trpc/server";
import { and, count, eq, type ExtractTablesWithRelations, inArray } from "drizzle-orm";
import type { PgTransaction, QueryResultHKT } from "drizzle-orm/pg-core";
import { auth } from "@clerk/nextjs/server";
import ratelimit from "./ratelimit";
import { error } from "~/lib/trpc";
import db from "./db";

import type * as schema from "~/server/db/schema";
import { events, memberships, userRoles } from "./db/schema";

type Transaction = PgTransaction<
  QueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
const validRoles = ["explorer", "navigator", "captain", "fleetCommander", "tester", "admin"];

/*--------------------------------------------------------------------------------------------------
 * Read
 *------------------------------------------------------------------------------------------------*/

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

export async function getMyMembershipPermissions(tx: Transaction, userId: string, tripId: string) {
  const result = await tx.query.memberships.findFirst({
    columns: { permissions: true },
    where: and(eq(memberships.userId, userId), eq(memberships.tripId, tripId)),
  });

  if (!result) {
    throw error.internalServerError(
      "Failed to fetch your membership permissions. Please try again later.",
    );
  }

  return result.permissions;
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

export async function getTripsEventCount(tx: Transaction, tripIds: string[]) {
  const result = await tx
    .select({ tripId: events.tripId, eventCount: count() })
    .from(events)
    .where(inArray(events.tripId, tripIds))
    .groupBy(events.tripId);

  return result.reduce(
    (acc, item) => {
      acc[item.tripId] = item.eventCount;
      return acc;
    },
    {} as Record<string, number>,
  );
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
