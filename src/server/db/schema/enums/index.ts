import { pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";

export const Currency = pgEnum("currency", [
  "AUD",
  "CAD",
  "CHF",
  "EUR",
  "GBP",
  "HUF",
  "INR",
  "JPY",
  "KRW",
  "PLN",
  "RUB",
  "USD",
]);

export const CurrencySchema = z.enum(Currency.enumValues);
