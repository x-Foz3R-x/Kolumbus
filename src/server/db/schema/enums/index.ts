import { pgEnum } from "drizzle-orm/pg-core";

export const Currency = pgEnum("currency", ["AUD", "CAD", "CHF", "EUR", "GBP", "HUF", "INR", "JPY", "KRW", "PLN", "RUB", "USD"]);
