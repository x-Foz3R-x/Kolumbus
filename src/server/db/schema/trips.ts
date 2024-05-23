import { relations } from "drizzle-orm";
import { index, pgTable, smallint, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createId } from "~/lib/utils";

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
    image: text("image"),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
    tierLevel: smallint("tier_level").default(0).notNull(),
    inviteCode: text("invite_code").unique(),
    inviteCreatedAt: timestamp("invite_created_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
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

export const selectTripSchema = createSelectSchema(trips);
export const insertTripSchema = createInsertSchema(trips);
