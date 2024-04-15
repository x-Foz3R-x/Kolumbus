import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "../utils";

import { memberships } from "./memberships";
import { events } from "./events";

export const trips = pgTable(
  "trips",
  {
    id: text("id")
      .$defaultFn(() => createId(10))
      .primaryKey(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
    image: text("image"),
    inviteCode: text("invite_code").unique(),
    inviteCreatedAt: timestamp("invite_created_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdateFn(() => new Date())
      .defaultNow()
      .notNull(),
  },
  (table) => ({ ownerIdIdx: index("owner_id_idx").on(table.ownerId) }),
);

export const tripsRelations = relations(trips, ({ many }) => ({
  memberships: many(memberships),
  events: many(events),
}));

export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
