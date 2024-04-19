import z from "zod";
import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, smallint, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createId } from "~/lib/db";

import { trips } from "./trips";
import { activities } from "./activities";
import { transportations } from "./transportations";
import { flights } from "./flights";

export const EventTypes = pgEnum("event_type", [
  // Common types
  "ACTIVITY",
  "DINING",
  "ACCOMMODATION",
  "TRANSPORTATION",
  "FLIGHT",
  // Special types
  "NOTE",
  "MARKER",
  "GROUP",
]);

export const events = pgTable(
  "events",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    tripId: text("trip_id")
      .references(() => trips.id, { onDelete: "cascade" })
      .notNull(),
    date: text("date").notNull(),
    position: smallint("position").notNull(),
    type: EventTypes("type").notNull(),
    createdBy: text("created_by").notNull(),
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

export const eventsRelations = relations(events, ({ one }) => ({
  trip: one(trips, { fields: [events.tripId], references: [trips.id] }),
  activity: one(activities, {
    fields: [events.id],
    references: [activities.eventId],
  }),
  transportation: one(transportations, {
    fields: [events.id],
    references: [transportations.eventId],
  }),
  flight: one(flights, { fields: [events.id], references: [flights.eventId] }),
}));

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

const eventTypeSchema = z.enum(EventTypes.enumValues);
export type EventTypes = z.infer<typeof eventTypeSchema>;

export const selectEventSchema = createSelectSchema(events);
export const insertEventSchema = createInsertSchema(events);
