import "server-only";

import { TRPCError } from "@trpc/server";
import { count, eq, inArray, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import db from "./db";

import { events, userRoles } from "./db/schema";
import { validRoles } from "~/lib/constants";

/*--------------------------------------------------------------------------------------------------
 * Read
 *------------------------------------------------------------------------------------------------*/

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

export async function getMyUserRoleDetails() {
  const userRole = getUserRole();

  const [myRole] = await db
    .select({
      role: userRoles.role,
      membershipsLimit: userRoles.membershipsLimit,
      daysLimit: userRoles.daysLimit,
      eventsLimit: userRoles.eventsLimit,
    })
    .from(userRoles)
    .where(eq(userRoles.role, userRole))
    .execute();

  return myRole;
}

/*--------------------------------------------------------------------------------------------------
 * Helpers
 *------------------------------------------------------------------------------------------------*/

export async function getUserId() {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized. Please sign in to continue.");
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
