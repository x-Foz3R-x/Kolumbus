import { relations } from "drizzle-orm";
import { decimal, index, pgTable, smallint, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { createId } from "~/lib/utils";

import { trips } from "./trips";

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
    phoneNumber: text("phone_number"),
    cost: decimal("cost", { precision: 10, scale: 2 }).default("0").notNull(), // to be replaced with its own table
    website: text("website"),
    note: text("note"),
    imageUrl: text("image_url"),

    dayIndex: smallint("day").notNull(),
    sortIndex: smallint("sort_order").notNull(),
    createdBy: text("created_by").notNull(),
    updatedBy: text("updated_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdateFn(() => new Date())
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    placesTripIdIdx: index("places_trip_id_idx").on(table.tripId),
  }),
);

export const placesRelations = relations(places, ({ one }) => ({
  trip: one(trips, { fields: [places.tripId], references: [trips.id] }),
}));

export const selectPlaceSchema = createSelectSchema(places);
export const insertPlaceSchema = createInsertSchema(places);
