import { decimal, index, jsonb, pgTable, smallint, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createId } from "~/lib/db";

import { Currency } from "./enums";
import { events } from "./events";

type OpeningHoursPeriod = {
  day: number;
  open: string;
  close?: string;
};

export const activities = pgTable(
  "activities",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    eventId: text("event_id")
      .references(() => events.id, { onDelete: "cascade" })
      .notNull(),
    placeId: text("place_id"),
    name: text("name").notNull(),
    startTime: text("start_time"),
    endTime: text("end_time"),
    openingHours: jsonb("opening_hours").$type<OpeningHoursPeriod>().array(),
    address: text("address"),
    phoneNumber: text("phone_number"),
    website: text("website"),
    cost: decimal("cost", { precision: 10, scale: 2 }).default("0").notNull(),
    currency: Currency("currency").default("USD").notNull(),
    images: text("images").array(),
    imageIndex: smallint("image_index").default(0).notNull(),
    note: text("note"),
    url: text("url"),
  },
  (table) => ({
    activitiesEventIdIdx: index("activities_event_id_idx").on(table.eventId),
  }),
);

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

export const selectActivitySchema = createSelectSchema(activities);
export const insertActivitySchema = createInsertSchema(activities);
