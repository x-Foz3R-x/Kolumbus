import "server-only";

import { TRPCError } from "@trpc/server";
import { and, count, eq, type ExtractTablesWithRelations, inArray, ne } from "drizzle-orm";
import type { PgTransaction, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { auth } from "@clerk/nextjs/server";
import ratelimit from "./ratelimit";
import { error } from "~/lib/trpc";

import type * as schema from "~/server/db/schema";
import { places, memberships } from "./db/schema";
import { decodePermissions } from "~/lib/utils";
import { MemberPermissionFlags } from "~/lib/validations/membership";
import type { UserTypeSchema } from "~/lib/validations/auth";

type Transaction = PgTransaction<
  PgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

/*--------------------------------------------------------------------------------------------------
 * Read
 *------------------------------------------------------------------------------------------------*/
export async function getUserMembershipPermissions(
  tx: Transaction,
  userId: string,
  tripId: string,
): Promise<Record<keyof typeof MemberPermissionFlags, boolean>> {
  const result = await tx.query.memberships.findFirst({
    columns: { permissions: true },
    where: and(eq(memberships.userId, userId), eq(memberships.tripId, tripId)),
  });

  if (!result) {
    throw error.internalServerError(
      "Failed to fetch your membership permissions. Please try again later.",
    );
  }

  return decodePermissions(result.permissions, MemberPermissionFlags);
}

export async function getUserMembershipCount(tx: Transaction, userId: string, owner?: boolean) {
  const [result] = owner
    ? await tx
        .select({ membershipsCount: count() })
        .from(memberships)
        .where(and(eq(memberships.userId, userId), eq(memberships.permissions, -1)))
    : await tx
        .select({ membershipsCount: count() })
        .from(memberships)
        .where(and(eq(memberships.userId, userId), ne(memberships.permissions, -1)));

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
    .select({ tripId: places.tripId, eventCount: count() })
    .from(places)
    .where(inArray(places.tripId, tripIds))
    .groupBy(places.tripId);

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
  const userType = await getMyUserType();
  const membershipsCount = await getUserMembershipCount(tx, userId);

  if (membershipsCount >= userType.maxMemberships) {
    if (returnValueOnEnforce) return returnValueOnEnforce;
    throw error.badRequest(`You've reached your limit of ${userType.maxMemberships} memberships.`);
  }
}

/*--------------------------------------------------------------------------------------------------
 * Auth
 *------------------------------------------------------------------------------------------------*/
export async function getMyUserType(): Promise<UserTypeSchema> {
  const { userId, sessionClaims } = auth();
  if (!userId) throw error.unauthorized("Unauthorized. Please sign in to continue.");

  const type = sessionClaims.public_metadata.type ?? 0;

  if (type === 1)
    return {
      value: 1,
      name: "Navigator",
      maxMemberships: 16,
      maxTripUpgrades: 8,
      memories: true,
    };
  else if (type === 2)
    return {
      value: 2,
      name: "Captain",
      maxMemberships: 24,
      maxTripUpgrades: 12,
      memories: true,
    };

  return {
    value: 0,
    name: "Explorer",
    maxMemberships: 16,
    maxTripUpgrades: 0,
    memories: false,
  };
}

export async function getMyUserFlags() {
  const { userId, sessionClaims } = auth();
  if (!userId) throw error.unauthorized("Unauthorized. Please sign in to continue.");
  return sessionClaims.public_metadata.flags;
}
