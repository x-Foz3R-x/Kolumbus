import { relations } from "drizzle-orm";
import { index, pgTable, smallint, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createId } from "~/lib/utils";

import { trips } from "./trips";

// export const EventTypes = pgEnum("event_type", [
//   "PLACE",
//   "CUSTOM_PLACE",
//   "NOTE",
//   "CHECKLIST",
//   "GROUP",
// ]);

export const places = pgTable(
  "places",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    tripId: text("trip_id")
      .references(() => trips.id, { onDelete: "cascade" })
      .notNull(),
    googleId: text("google_id"),

    name: text("name"),
    address: text("address"),
    startTime: text("start_time"),
    endTime: text("end_time"),
    note: text("note"),
    imageUrl: text("image_url"),
    attachmentUrl: text("attachment_url"),

    position: smallint("position").notNull(),
    createdBy: text("created_by").notNull(),
    updatedBy: text("updated_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdateFn(() => new Date())
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    eventsTripIdIdx: index("events_trip_id_idx").on(table.tripId),
  }),
);

export const eventsRelations = relations(places, ({ one }) => ({
  trip: one(trips, { fields: [places.tripId], references: [trips.id] }),
}));

export const selectEventSchema = createSelectSchema(places);
export const insertEventSchema = createInsertSchema(places);
