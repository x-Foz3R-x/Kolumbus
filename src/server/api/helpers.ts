import { TRPCError } from "@trpc/server";
import type { PgTransaction, QueryResultHKT } from "drizzle-orm/pg-core";
import { count, eq, type TablesRelationalConfig } from "drizzle-orm";
import ratelimit from "../ratelimit";

import { memberships, userRoles } from "../db/schema";
import { getUserRole } from "../queries";

export async function enforceRateLimit(userId: string) {
  const { success } = await ratelimit.limit(userId);
  if (!success)
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate-limited. Please try again later.",
    });
}

export async function enforceMembershipLimit(
  tx: PgTransaction<QueryResultHKT, Record<string, unknown>, TablesRelationalConfig>,
  userId: string,
) {
  const role = getUserRole();

  const [userMembershipData] = await tx
    .select({ membershipsCount: count() })
    .from(memberships)
    .where(eq(memberships.userId, userId));
  if (!userMembershipData) return;

  const [userRole] = await tx
    .select({
      role: userRoles.role,
      membershipsLimit: userRoles.membershipsLimit,
      daysLimit: userRoles.daysLimit,
      eventsLimit: userRoles.eventsLimit,
    })
    .from(userRoles)
    .where(eq(userRoles.role, role))
    .execute();
  if (!userRole) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized. Please sign in to continue.",
    });
  }

  if (userMembershipData.membershipsCount >= userRole.membershipsLimit) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You've reached your limit of ${userRole.membershipsLimit} memberships.`,
    });
  }
}
