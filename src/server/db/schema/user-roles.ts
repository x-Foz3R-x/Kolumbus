import { pgTable, smallint, text, timestamp } from "drizzle-orm/pg-core";

export const userRoles = pgTable("user_roles", {
  role: text("role").primaryKey(),
  desc: text("desc").notNull(),
  membershipsLimit: smallint("memberships_limit").notNull(),
  daysLimit: smallint("days_limit").notNull(),
  eventsLimit: smallint("events_limit").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdateFn(() => new Date())
    .defaultNow()
    .notNull(),
});

export type UserRoles = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
