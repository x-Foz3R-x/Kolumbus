import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { trips } from "./trips";

export const memberships = pgTable(
  "memberships",
  {
    userId: text("user_id").notNull(),
    tripId: text("trip_id")
      .references(() => trips.id, { onDelete: "cascade" })
      .notNull(),
    owner: boolean("owner").notNull(),
    permissions: integer("permissions").notNull(),
    tripPosition: smallint("trip_position").notNull(),
    createdAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdateFn(() => new Date())
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    membershipsPKey: primaryKey({
      name: "memberships_pkey",
      columns: [table.tripId, table.userId],
    }),
    membershipsUserIdIdx: index("memberships_user_id_idx").on(table.userId),
    membershipsTripIdIdx: index("memberships_trip_id_idx").on(table.tripId),
  }),
);

export const membershipsRelations = relations(memberships, ({ one }) => ({
  trip: one(trips, { fields: [memberships.tripId], references: [trips.id] }),
}));

export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;

export const selectMembershipSchema = createSelectSchema(memberships);
export const insertMembershipSchema = createInsertSchema(memberships);
