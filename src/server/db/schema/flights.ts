import { decimal, index, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { createId } from "../utils";

import { Currency } from "./enums";
import { events } from "./events";

type Location = {
  airportCode?: string;
  airportName?: string;
  time?: string;
  address?: string;
  terminal?: string;
  url?: string;
};
type Departure = Location & { boardingTime?: string; gate?: string };
type Arrival = Location & { baggageClaim?: string };

export const flights = pgTable(
  "flights",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    eventId: text("event_id")
      .references(() => events.id, { onDelete: "cascade" })
      .notNull(),
    flightNumber: text("flight_number"),
    airline: text("airline"),
    seat: text("seat"),
    departure: jsonb("departure").$type<Departure>(),
    arrival: jsonb("arrival").$type<Arrival>(),
    cost: decimal("cost", { precision: 10, scale: 2 }).default("0").notNull(),
    currency: Currency("currency").default("USD").notNull(),
    note: text("note"),
  },
  (table) => ({
    flightsEventIdIdx: index("flights_event_id_idx").on(table.eventId),
  }),
);

export type Flight = typeof flights.$inferSelect;
export type NewFlight = typeof flights.$inferInsert;
