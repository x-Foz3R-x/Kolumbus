import {
  decimal,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createId } from "../utils";

import { Currency } from "./enums";
import { events } from "./events";

type Location = {
  name?: string;
  time?: string;
  address?: string;
  url?: string;
};

export const TransportationType = pgEnum("transportation_type", [
  "BUS",
  "CAR",
  "TRAIN",
  "TRAM",
  "TAXI",
  "SUBWAY",
  "FERRY",
  "BIKE",
  "WALK",
]);
export const transportations = pgTable(
  "transportations",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    eventId: text("event_id")
      .references(() => events.id, { onDelete: "cascade" })
      .notNull(),
    transportationType: TransportationType("transportation_type")
      .default("CAR")
      .notNull(),
    seat: text("seat"),
    departure: jsonb("departure").$type<Location>(),
    arrival: jsonb("arrival").$type<Location>(),
    cost: decimal("cost", { precision: 10, scale: 2 }).default("0").notNull(),
    currency: Currency("currency").default("USD").notNull(),
    note: text("note"),
  },
  (table) => ({
    transportationsEventIdIdx: index("transportations_event_id_idx").on(
      table.eventId,
    ),
  }),
);

export type Transportation = typeof transportations.$inferSelect;
export type NewTransportation = typeof transportations.$inferInsert;

export const selectTransportationSchema = createSelectSchema(transportations);
export const insertTransportationSchema = createInsertSchema(transportations);
