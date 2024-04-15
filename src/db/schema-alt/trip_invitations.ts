import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "../utils";

import { trips } from "../schema/trips";

export const tripInvites = pgTable("trip_invites", {
  code: text("code")
    .primaryKey()
    .$defaultFn(() => createId(12)),
  tripId: text("trip_id")
    .references(() => trips.id)
    .notNull(),
  inviterId: text("inviter_id").notNull(),
  maxAge: integer("max_age"),
  maxUses: integer("max_uses"),
  uses: integer("uses").default(0).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
