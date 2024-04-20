import { auth } from "@clerk/nextjs/server";
import type { UserRole } from "~/types";

/**
 * ROLE_BASED_LIMITS defines the limits and permissions for each user role.
 *
 * Each role is an object with the following properties:
 * - membershipsLimit: The maximum number of trips a user can be involved in, whether they are created or joined.
 * - daysLimit: The maximum number of days a trip can last.
 * - eventsLimit: The maximum number of events a single trip can have.
 * - fullAccess: Whether the user has full access to all features and data in the application (typically for admins).
 *
 * The roles are:
 * - explorer: For regular users.
 * - navigator: For users who pay for a premium subscription.
 * - captain: For users who pay for a higher level of premium subscription.
 * - fleetCommander: For travel agencies or other companies that need to manage many trips.
 * - tester: For testing features and finding issues.
 * - admin: For support, moderation, and bypassing all access limits.
 */
export const RoleBasedLimits = {
  /** "Standard" - For regular users. */
  explorer: {
    membershipsLimit: 20,
    daysLimit: 14,
    eventsLimit: 100,
  },
  /** "Premium" - For users who pay for a premium subscription. */
  navigator: {
    membershipsLimit: 16,
    daysLimit: 30,
    eventsLimit: 100,
  },
  /** "Premium Plus" - For users who pay for a higher level of premium subscription. */
  captain: {
    membershipsLimit: 25,
    daysLimit: 60,
    eventsLimit: 100,
  },
  /** "Company" - For travel agencies or other companies that need to manage many trips. */
  fleetCommander: {
    membershipsLimit: 200,
    daysLimit: 90,
    eventsLimit: 100,
  },
  /** For testing features and finding issues. */
  tester: {
    membershipsLimit: 25,
    daysLimit: 90,
    eventsLimit: 200,
  },
  /** For support, moderation, and bypassing all access limits. */
  admin: {
    membershipsLimit: 25,
    daysLimit: 90,
    eventsLimit: 200,
  },
};

export const checkRole = (role: UserRole) => {
  const { sessionClaims } = auth();

  return sessionClaims?.metadata.role === role;
};
